package com.Akarsh.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Akarsh.custom_response.Response;
import com.Akarsh.entities.Hotel;
import com.Akarsh.entities.HotelOwner;
import com.Akarsh.enums.HotelStatus;
import com.Akarsh.repositories.HotelOwnerRepository;
import com.Akarsh.repositories.HotelRepository;
import com.Akarsh.specifications.HotelSpecification;

import tools.jackson.databind.ObjectMapper;

@Service
public class HotelService 
{
 
	@Autowired
	HotelRepository hotelRepository;
	@Autowired
	HotelOwnerRepository hotelOwnerRepository;
	
	@Autowired 
	Response response;
	
	//add hotel 
	final private String IMAGE_UPLOAD_DIR=System.getProperty("user.dir")+"/uploads/images";
	public ResponseEntity<?>addHotel(String hotelObject,MultipartFile image) throws IOException
	{
		
		//convert String hotel object to real product object
		ObjectMapper objectMapper=new ObjectMapper();
		Hotel hotel=objectMapper.readValue(hotelObject, Hotel.class);
		
		//set fk for hotel owner
		
		long hotelOwnerId=hotel.getHotelOwner().getId();
		HotelOwner existingHotelOwner=hotelOwnerRepository.findById(hotelOwnerId).get();
		hotel.setHotelOwner(existingHotelOwner);
		
		//set hotel status
		hotel.setHotelStatus(HotelStatus.PENDING);
		
		 // Check image
		if (image == null || image.isEmpty())
		{
            return response.send("Hotel image is required",null,HttpStatus.NOT_FOUND);
        }
		
		//setting imagename
		String imageName=image.getOriginalFilename();
		hotel.setImageName(imageName);
		
		//writing image into uploads/images folder
		Path completeImagePath=Paths.get(IMAGE_UPLOAD_DIR,imageName);
		Files.write(completeImagePath, image.getBytes());
		
		Hotel hotels=hotelRepository.save(hotel);
		return response.send("Hotel added", hotels, HttpStatus.OK);
		
	}
	
	//getting all products for particular HotelOwner
	
	public ResponseEntity<?> getHotelByHotelOwnerId(long hotelOwnerId)
	{
		List<Hotel> hotels=hotelRepository.findAllByHotelOwnerId(hotelOwnerId);
		if(hotels.size()>0) 
		{
			return response.send("following hotel found.", hotels, HttpStatus.OK);
			
		}else
		{
			return response.send("There are no hotels, Please add some!", null, HttpStatus.NOT_FOUND);
		}
	}
	 
	//updateHotel by hotelId
	public ResponseEntity<?>updateHotel(String hotelObject,MultipartFile image,long hotelId) throws IOException
	{
		//collecting hotel data based on hotelId
		Hotel existingHotel=hotelRepository.findById(hotelId).get();
		
		//convert String product object to real product object
		ObjectMapper objectMapper=new ObjectMapper();
		Hotel hotelToUpdated=objectMapper.readValue(hotelObject, Hotel.class);
		
		//attaching id of exixstingProduct to product update
		
		hotelToUpdated.setId(hotelId);
		
		//set fk for hotel owner
		hotelToUpdated.setHotelOwner(existingHotel.getHotelOwner());
		
		//set hotel status
		hotelToUpdated.setHotelStatus(HotelStatus.PENDING);
		
		 // Check image
		if (image == null || image.isEmpty())
		{
            return response.send("Hotel image is required",null,HttpStatus.NOT_FOUND);
        }
		
		//setting imagename
		String imageName=image.getOriginalFilename();
		hotelToUpdated.setImageName(imageName);
		
		//writing image into uploads/images folder
		Path completeImagePath=Paths.get(IMAGE_UPLOAD_DIR,imageName);
		Files.write(completeImagePath, image.getBytes());
		
		Hotel savedHotels=hotelRepository.save(hotelToUpdated);
		return response.send("Hotel updated succefully", savedHotels, HttpStatus.OK); 
		
	} 
	 //get hotel by id
	public ResponseEntity<?>getHotelById(long hotelId)
	{
		Hotel existingHotels=hotelRepository.findById(hotelId).get();
		return response.send("following hotel found.", existingHotels,HttpStatus.FOUND);
	}
	
	//get all hotels 
	
	public ResponseEntity<?>getAllHotels()
	{
		List<Hotel> hotels=hotelRepository.findAll();
		return response.send("Following hotels found", hotels, HttpStatus.OK);
	}
	 
	//delete hotel by hotelId
	
	public ResponseEntity<?>deleteHotelById(long hotelId)
	{
		try {
		hotelRepository.deleteById(hotelId);
		return response.send("hotel deleted successfully..", null, HttpStatus.OK);
	}
		catch(Exception e) 
	{
		return response.send("product not deleted", null, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	}
	

	//hotel filteration method 
	public ResponseEntity<?> getAllFilteredHotel(String cityName,String locationName,String sortDirection)
	{
		Specification<Hotel> customFilter=Specification.where(HotelSpecification.hasCityName(cityName)
				.and(HotelSpecification.hasLocationName(locationName))
				.and(HotelSpecification.shortByPrice(sortDirection)));
		List<Hotel> filteredHotel=hotelRepository.findAll(customFilter);
		return response.send("folllowing hetel found.", filteredHotel, HttpStatus.OK);
	}
	
}
