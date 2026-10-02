package com.Akarsh.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Akarsh.entities.Hotel;
import com.Akarsh.entities.HotelOwner;
import com.Akarsh.services.HotelService;

@RestController
@RequestMapping("/api/v1")
public class HotelController {
	@Autowired
	HotelService hotelService;
	
	@PostMapping("/hotelowner/hotels")
	public ResponseEntity<?>addHotel(
			@RequestPart("hotelObject") String hotelObject,
			@RequestParam("hotelImage") MultipartFile hotelImage)throws IOException
	{
		return hotelService.addHotel(hotelObject, hotelImage);
	}
	
	@GetMapping("/hotelowner/hotels/{hotelOwnerId}")
	public ResponseEntity<?> getHotelByHotelOwnerId(@PathVariable("hotelOwnerId") long hotelOwnerId)
	{
		return hotelService.getHotelByHotelOwnerId(hotelOwnerId);
	}
	
	@PutMapping("/hotelowner/hotels/{hotelId}")
	public ResponseEntity<?>updateHotel(
			@RequestPart("hotelObject") String hotelObject,
			@RequestParam("hotelImage") MultipartFile hotelImage,
			@PathVariable("hotelId") long hotelId) throws IOException
	{
		return hotelService.updateHotel(hotelObject, hotelImage, hotelId);
	}
	
	@GetMapping("/get/hotels/{hotelId}")
	public ResponseEntity<?>getHotelById(@PathVariable("hotelId") long hotelId)
	{
		return hotelService.getHotelById(hotelId);
	}
	
	//get all hotel
	@GetMapping("get/hotels")
	public ResponseEntity<?>getAllHotels(){
		return hotelService.getAllHotels();
	}
	
	@DeleteMapping("/hotelowner/hotels/{hotelId}")
	public ResponseEntity<?>deleteHotelById(@PathVariable("hotelId") long hotelId)
	{
		return hotelService.deleteHotelById(hotelId); 
	}
	
	//get filter hotel
	@GetMapping("/get/filtered-hotels")
	public ResponseEntity<?> getAllFilteredHotel(
			@RequestParam(name="cityName",required = false) String cityName,
			@RequestParam(name="locationName",required = false) String locationName,
			@RequestParam(name = "sortDirection",required = false) String sortDirection)
	{
		return hotelService.getAllFilteredHotel(cityName,locationName,sortDirection);
	}
}
