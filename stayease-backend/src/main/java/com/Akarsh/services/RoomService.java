package com.Akarsh.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Akarsh.custom_response.Response;
import com.Akarsh.entities.Hotel;
import com.Akarsh.entities.Room;
import com.Akarsh.repositories.HotelRepository;
import com.Akarsh.repositories.RoomRepository;

import tools.jackson.databind.ObjectMapper;

@Service
public class RoomService {
	
	@Autowired
	RoomRepository roomRepository;
	@Autowired
	Response response;
	@Autowired 
	HotelRepository hotelRepository;
	
	//add room 
	final private String IMAGE_UPLOAD_DIR=System.getProperty("user.dir")+"/uploads/images";
	public  ResponseEntity<?>addRoom(String roomObject,MultipartFile roomImage) throws IOException
	{
		//convert String room object to real room object
		ObjectMapper objectMapper=new ObjectMapper();
		Room room=objectMapper.readValue(roomObject, Room.class);
		
		//set fk for hotel
		long hotelId=room.getHotel().getId();
		Optional<Hotel> existingHotel=hotelRepository.findById(hotelId);
		if (existingHotel.isEmpty()) 
		{
			return response.send("Hotel not found",null,HttpStatus.NOT_FOUND);
        }
		
		room.setHotel(existingHotel.get());
		
		
		//check image exists or not
		if (roomImage == null || roomImage.isEmpty())
		{
            return response.send("roomImage is required",null,HttpStatus.NOT_FOUND);
        }
		 //set image 
		String roomImageName=roomImage.getOriginalFilename();
		room.setRoomImage(roomImageName);
		
		//writing image into uploads/images folder
		
		Path completeImagePath=Paths.get(IMAGE_UPLOAD_DIR,roomImageName);
		Files.write(completeImagePath,roomImage.getBytes());
		
		Room existingRoom=roomRepository.save(room);
		return response.send("following room added..", existingRoom, HttpStatus.OK);
	}

	//get room by hotel id 
	public ResponseEntity<?>getRoomByHotelId(long hotelId)
	{
		List<Room> rooms=roomRepository.findByHotelId(hotelId);
		if(rooms.size()>0) 
		{
			return response.send("following room found", rooms, HttpStatus.OK);
		}
		else
		{
			return response.send("following room not found", null, HttpStatus.NOT_FOUND);
		}
	}
	
	//delete room by room id
	public ResponseEntity<?>deleteRoomByRoomId(long roomId)
	{
		try {
			roomRepository.deleteById(roomId);
			return response.send("following room deleted", null, HttpStatus.OK); 
		}
		catch(Exception exception)
		{
			return response.send("following room not deleted try again!", null, HttpStatus.INTERNAL_SERVER_ERROR);
			
		}
	}
	
	
	
	
	

















}
