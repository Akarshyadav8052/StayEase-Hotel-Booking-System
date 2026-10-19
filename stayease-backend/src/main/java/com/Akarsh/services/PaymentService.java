
package com.Akarsh.services;

import com.Akarsh.dtos.VarifyPaymentRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Akarsh.entities.Booking;
import com.Akarsh.entities.Customer;
import com.Akarsh.entities.Room;
import com.Akarsh.repositories.BookingRepository;
import com.Akarsh.repositories.CustomerRepository;
import com.Akarsh.repositories.RoomRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
public class PaymentService {

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    private RazorpayClient razorpayClient;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public PaymentService(
            RazorpayClient razorpayClient,
            BookingRepository bookingRepository,
            CustomerRepository customerRepository,
            RoomRepository roomRepository) {

        this.razorpayClient = razorpayClient;
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    public Map<String, Object> createBookingOrder(
            Long roomId, Long customerId, String currency)
            throws Exception {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        if (!"INR".equalsIgnoreCase(currency)) {
            throw new IllegalArgumentException(
                    "Only INR currency is supported");
        }

        // Read the price from the database, not from React.
        double price = room.getPrice();

        if (!Double.isFinite(price) || price <= 0) {
            throw new IllegalArgumentException(
                    "Invalid room price");
        }

        // Razorpay expects the amount in paise.
        long amountInPaise = Math.round(price * 100);

        if (amountInPaise <= 0) {
            throw new IllegalArgumentException(
                    "Invalid payment amount");
        }

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put(
                "receipt",
                "room_" + roomId + "_" + System.currentTimeMillis()
        );

        Order razorpayOrder = razorpayClient.orders.create(
                orderRequest
        );

        String orderId = razorpayOrder.get("id");

        // Save the pending booking before opening checkout.
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setPrice(price);
        booking.setRazorpayOrderId(orderId);
        booking.setPaymentStatus("PENDING");
        booking.setBookingDate(LocalDateTime.now());

        bookingRepository.save(booking);

        Map<String, Object> response = new HashMap<>();
        response.put("key", apiKey);
        response.put("orderId", orderId);
        response.put("amount", amountInPaise);
        response.put("currency", "INR");
        response.put("bookingId", booking.getId());

        return response;
    }

    @Transactional
    public Map<String, Object> verifyPayment(
            VarifyPaymentRequest request,
            Long authenticatedCustomerId) throws Exception {

        if (request.getRazorpayOrderId() == null
                || request.getRazorpayPaymentId() == null
                || request.getRazorpaySignature() == null) {
            throw new IllegalArgumentException(
                    "Missing payment verification details");
        }

        Booking booking = bookingRepository
                .findByRazorpayOrderId(
                        request.getRazorpayOrderId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking/order not found"));

        // The logged-in customer must own this booking.
        if (booking.getCustomer().getId()
                != authenticatedCustomerId.longValue()) {
            throw new SecurityException(
                    "You cannot verify another customer's booking");
        }

        if ("PAID".equals(booking.getPaymentStatus())) {
            if (request.getRazorpayPaymentId()
                    .equals(booking.getPaymentId())) {
                return Map.of(
                        "message", "Payment already verified",
                        "bookingId", booking.getId(),
                        "paymentStatus", "PAID"
                );
            }

            throw new IllegalStateException(
                    "Booking has already been paid");
        }

        JSONObject options = new JSONObject();
        options.put(
                "razorpay_order_id",
                request.getRazorpayOrderId());
        options.put(
                "razorpay_payment_id",
                request.getRazorpayPaymentId());
        options.put(
                "razorpay_signature",
                request.getRazorpaySignature());

        boolean validSignature = Utils.verifyPaymentSignature(
                options, apiSecret);

        if (!validSignature) {
            throw new SecurityException(
                    "Invalid Razorpay payment signature");
        }

        // Confirm payment status with Razorpay as well.
        com.razorpay.Payment payment =
                razorpayClient.payments.fetch(
                        request.getRazorpayPaymentId());

        String paymentOrderId = payment.get("order_id");
        String paymentStatus = payment.get("status");

        if (!request.getRazorpayOrderId().equals(paymentOrderId)) {
            throw new SecurityException(
                    "Payment does not belong to this order");
        }

        if (!"captured".equals(paymentStatus)) {
            throw new IllegalStateException(
                    "Payment is not captured yet");
        }

        booking.setPaymentId(
                request.getRazorpayPaymentId());
        booking.setPaymentStatus("PAID");

        bookingRepository.save(booking);

        return Map.of(
                "message", "Payment verified successfully",
                "bookingId", booking.getId(),
                "paymentStatus", "PAID"
        );
    }
}
