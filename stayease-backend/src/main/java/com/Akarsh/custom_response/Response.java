package com.Akarsh.custom_response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class Response {
	
	@Autowired
	CustomResponse customResponse;
	
	public ResponseEntity<CustomResponse> send(String massage,Object data,HttpStatus httpStatus)

	{
		customResponse.setMassage(massage);
		customResponse.setData(data);
		return new ResponseEntity<>(customResponse,httpStatus); 
	}
}
