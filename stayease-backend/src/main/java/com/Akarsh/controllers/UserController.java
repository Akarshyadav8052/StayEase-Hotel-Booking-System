package com.Akarsh.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Akarsh.dtos.UserLoginDTO;
import com.Akarsh.entities.User;
import com.Akarsh.services.UserService;

@RestController
@RequestMapping("/api/v1")
public class UserController {
	@Autowired
	UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<?>register(@RequestBody User user)
	{
		return userService.register(user);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?>login(@RequestBody UserLoginDTO userLoginDTO)
	{
		return userService.login(userLoginDTO);
	}

}
