import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function CustomerHotelDetails() {
    let loggedInUser=JSON.parse(localStorage.getItem("user"))
    let navigateTo=useNavigate()
    let { hotelId } = useParams()
    let [rooms, setRooms] = useState([])


    async function fetchAllRoom(hotelId) {
        let response = await fetch(`http://localhost:8080/api/v1/get/rooms/${hotelId}`)
        let responseObject = await response.json()
        console.log(responseObject);
        if (response.ok) {
            setRooms(responseObject.data);
        }
        else{
            toast.error(responseObject.massage)
        }
    }

    useEffect(() => {
        fetchAllRoom(hotelId);
    }, [])

     // Load Razorpay checkout script
    function loadRazorpayScript() {
        return new Promise((resolve) => {
            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    }

    // Book room and make payment
    async function handlePayment(roomId) {

        try {

            // Check customer login
            if (!loggedInUser || !loggedInUser.jwtToken) {
                alert("Please login before booking.");
                navigateTo("/login");
                return;
            }

            // Load Razorpay
            const loaded = await loadRazorpayScript();

            if (!loaded) {
                toast.error("Razorpay failed to load.");
                return;
            }

            // Step 1: Create booking and order
            const response = await fetch(
                `http://localhost:8080/api/v1/customer/create-booking?roomId=${roomId}&customerId=${loggedInUser.id}&currency=INR`,
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            `Bearer ${loggedInUser.jwtToken}`
                    }
                }
            );

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const order = await response.json();

            // Step 2: Open Razorpay checkout
            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "StayEase",
                description: "Hotel Room Booking",
                order_id: order.orderId,

                handler: async function (paymentResponse) {

                    try {

                        // Step 3: Verify payment in backend
                        const verifyResponse = await fetch(
                            `http://localhost:8080/api/v1/customer/verify-payment?customerId=${loggedInUser.id}`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization":
                                        `Bearer ${loggedInUser.jwtToken}`
                                },
                                body: JSON.stringify({
                                    razorpayOrderId:
                                        paymentResponse.razorpay_order_id,

                                    razorpayPaymentId:
                                        paymentResponse.razorpay_payment_id,

                                    razorpaySignature:
                                        paymentResponse.razorpay_signature
                                })
                            }
                        );

                        const result = await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(
                                result.message || "Payment verification failed"
                            );
                        }

                        toast.success("Payment successful! Booking confirmed.");

                        // Change this route if your booking page has another path
                        navigateTo("/customer/my-bookings");

                    } catch (error) {
                        console.error("Verification error:", error);

                        alert(
                            "Payment completed, but verification failed. " +
                            "Please check your booking before trying again."
                        );
                    }
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                alert("Payment failed. Please try again.");
            });

            razorpay.open();

        } catch (error) {

            console.error("Booking/payment error:", error);
            alert(error.message || "Unable to start payment.");

        }
    }

    return (
    <div className="row">
        {
        rooms.map(room => {
            return (
            <div className="col-md-4 col-lg-3 mb-4" key={room.id}>
                <div className="card shadow-sm h-100 border-0">
                    {/* Room Image */}
                    <img src={`http://localhost:8080/api/v1/images/${room.roomImage}`}
                    className="card-img-top p-2"alt="Room"
                    style={{height: "200px",objectFit: "cover",borderRadius: "12px"}}/>
                    <div className="card-body">
                        {/* Room Number */}
                        <h5 className="fw-bold text-center mb-2">Room {room.roomNumber}</h5>
                        {/* Room Type */}
                        <div className="text-center mb-3">
                            <span className="badge bg-primary px-3 py-2">{room.roomType}</span>
                        </div>
                        {/* Capacity */} 
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Capacity</span>
                            <span className="fw-semibold">{room.capacity} Guests</span></div>
                            {/* Price */}
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Price</span>
                                <span className="fw-bold text-success">₹{room.price}/night</span>
                            </div>
                            {/* Book Now Button */}
                            <button className="btn btn-primary" 
                            onClick={() => handlePayment(room.id)}> Book Room & Pay
                            </button>
                                
                            </div>
                        </div>
                    </div>)})
                    }
        </div>
    );
}
