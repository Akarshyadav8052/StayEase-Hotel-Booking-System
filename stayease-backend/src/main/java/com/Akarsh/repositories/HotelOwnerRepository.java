package com.Akarsh.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Akarsh.entities.HotelOwner;

@Repository
public interface HotelOwnerRepository extends JpaRepository<HotelOwner, Long> 
{

	boolean existsByPhone(String phone);
	boolean existsByemail(String email);
	
	 
	 Optional<HotelOwner> findByUserId(long userId);
}
