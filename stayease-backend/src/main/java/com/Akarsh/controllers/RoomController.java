package com.Akarsh.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Akarsh.entities.Room;
import com.Akarsh.services.RoomService;

@RestController
@RequestMapping("/api/v1")
public class RoomController {

	@Autowired
	RoomService roomService;
	
	@PostMapping("/hotelowner/rooms")
	public  ResponseEntity<?>addRoom(
			@RequestPart("roomObject") String roomObject,
			@RequestParam("roomImage") MultipartFile roomImage)throws IOException
	{
		return roomService.addRoom(roomObject,roomImage);
				
	}
	
	@GetMapping("/get/rooms/{hotelId}") 
	public ResponseEntity<?>getRoomByHotelId(@PathVariable("hotelId") long hotelId)
	{
		return roomService.getRoomByHotelId(hotelId);
	}
	
	@DeleteMapping("/hotelowner/rooms/{roomId}")
	public ResponseEntity<?>deleteRoomByRoomId(@PathVariable("roomId") long roomId)
	{
		return roomService.deleteRoomByRoomId(roomId);
	}
}
