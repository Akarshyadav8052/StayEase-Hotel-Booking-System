package com.Akarsh.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Akarsh.entities.Customer;
import com.Akarsh.entities.HotelOwner;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>
{
	boolean existsByPhone(String phone);
	boolean existsByemail(String email);
	
	Optional<Customer> findByUserId(long userId);

}
