
package com.Akarsh.controllers;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Akarsh.dtos.VarifyPaymentRequest;
import com.Akarsh.services.PaymentService;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/api/v1")
public class PaymentController {

	@Autowired
	PaymentService paymentService;

	// Create booking and Razorpay order
	@PostMapping("/customer/create-booking")
	public ResponseEntity<?> createBooking(@RequestParam Long roomId, @RequestParam Long customerId,
			@RequestParam(defaultValue = "INR") String currency) {

		try {
			Map<String, Object> response = paymentService.createBookingOrder(roomId, customerId, currency);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Booking creation failed: " + e.getMessage());
		}
	}

	// Verify Razorpay payment
	@PostMapping("/customer/verify-payment")
	public ResponseEntity<?> verifyPayment(@RequestBody VarifyPaymentRequest request, @RequestParam Long customerId) {

		try {
			Map<String, Object> response = paymentService.verifyPayment(request, customerId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Payment verification failed: " + e.getMessage());
		}
	}
}
