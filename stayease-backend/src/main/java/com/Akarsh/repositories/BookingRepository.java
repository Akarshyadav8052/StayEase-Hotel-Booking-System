package com.Akarsh.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Akarsh.entities.Booking;

@Repository 
public interface BookingRepository extends JpaRepository<Booking, Long> 
{
	
	Optional<Booking> findByRazorpayOrderId(String razorpayOrderId);

}
