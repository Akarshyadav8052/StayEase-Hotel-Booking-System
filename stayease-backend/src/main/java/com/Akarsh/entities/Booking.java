package com.Akarsh.entities;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Booking {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "customer_id")
	@JsonProperty(access = Access.WRITE_ONLY)
	private Customer customer;
	
	@ManyToOne
	@JoinColumn(name = "room_id")
	@JsonProperty(access = Access.WRITE_ONLY)
	private Room room;
	private double  price;     
	private String paymentId;         // Razorpay Payment ID
	private String razorpayOrderId;   // Razorpay Order ID
	private String paymentStatus = "PENDING";      // PAID, FAILED, PENDING
	private LocalDateTime bookingDate;
	

}
