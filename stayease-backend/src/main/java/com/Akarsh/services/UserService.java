package com.Akarsh.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Akarsh.custom_response.JWTResponse;
import com.Akarsh.custom_response.Response;
import com.Akarsh.dtos.UserLoginDTO;
import com.Akarsh.entities.Customer;
import com.Akarsh.entities.HotelOwner;
import com.Akarsh.entities.User;
import com.Akarsh.jwt.JWTTokenGenerator;
import com.Akarsh.repositories.CustomerRepository;
import com.Akarsh.repositories.HotelOwnerRepository;
import com.Akarsh.repositories.UserRepository;

@Service
public class UserService {
	
	@Autowired
	UserRepository userRepository;
	@Autowired
	CustomerRepository customerRepository;
	@Autowired
	HotelOwnerRepository hotelOwnerRepository;
	@Autowired
	Response response;
	@Autowired
	PasswordEncoder passwordEncoder;
	
	public ResponseEntity<?>register(User user)
	{
		//encoding password
		String encodedPassword=passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
		
		//saved user
		User savedUser=userRepository.save(user); 
		
		//adding user id into customer or vendor table according to role
		if(user.getRole().name().equals("CUSTOMER"))
		{
			Customer customer=new Customer();
			customer.setUser(savedUser);
			Customer savedCustomer=customerRepository.save(customer);
			return response.send("User register as a customer", savedCustomer,HttpStatus.OK);
		}
		else { 
			
			HotelOwner hotelOwner=new HotelOwner();
			hotelOwner.setUser(savedUser);
			HotelOwner savedHotelOwner=hotelOwnerRepository.save(hotelOwner);
			return response.send("User register as a HotelOwner", savedHotelOwner, HttpStatus.OK);
			
		
		
		}
	}
	
	//Login code
	
	@Autowired
	AuthenticationManager authenticationManager;
	@Autowired
	MyUserDetailsService myUserDetailsService;
	@Autowired
	JWTResponse jwtResponse;
	@Autowired
	JWTTokenGenerator jwtTokenGenerator;
	
	public ResponseEntity<?>login(UserLoginDTO userLoginDTO)
	{
		try {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						userLoginDTO.getUsername(),
						userLoginDTO.getPassword())
						);
		}
		catch (AuthenticationException exception) {
			return response.send("bad credential!", null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		//generate jwt token
		
		UserDetails userDetails=myUserDetailsService.loadUserByUsername(userLoginDTO.getUsername());
		User existingUser=userRepository.findByUsername(userLoginDTO.getUsername()).get();
		String jwtToken=jwtTokenGenerator.generateToken(userDetails, existingUser.getRole().name());
		
//		jwtResponse.setId(existingUser.getId());
		
		//code update for user id who login 
		String role=existingUser.getRole().name();
		
		if(role.equals("HOTELOWNER"))
		{
			//hotelOwnerRepository.FindByUserId(existingUser.getId()).get();// from here we got hotelowner object
			//hotelOwnerRepository.FindByUserId(existingUser.getId()).get().getId();//then here we got hotelowner id by using get id
			jwtResponse.setId(hotelOwnerRepository.findByUserId(existingUser.getId()).get().getId());
		}
		else if(role.equals("ADMIN"))  
		{
			jwtResponse.setId(userRepository.findById(existingUser.getId()).get().getId());
		}
		else 
		{
			jwtResponse.setId(customerRepository.findByUserId(existingUser.getId()).get().getId());
		}              
		jwtResponse.setUsername(existingUser.getUsername());
		jwtResponse.setRole(existingUser.getRole().name());
		jwtResponse.setJwtToken(jwtToken);
		
		return response.send("login success", jwtResponse, HttpStatus.OK);
	}


}
