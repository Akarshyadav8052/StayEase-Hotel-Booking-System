package com.Akarsh.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Akarsh.entities.Hotel;
import com.Akarsh.entities.HotelOwner;
import com.Akarsh.enums.HotelStatus;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>,JpaSpecificationExecutor<Hotel>
{
	List<Hotel> findByHotelStatus(HotelStatus hotelStatus);
	
	List<Hotel> findAllByHotelOwnerId(long hotelOwnerId); 
	boolean existsByNameAndCityAndLocationAndPincode(
	        String name,
	        String city,
	        String location,
	        String pincode
	        );

}
