package com.Akarsh.custom_response;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class CustomResponse {
	private String massage;
	private Object data;

}
