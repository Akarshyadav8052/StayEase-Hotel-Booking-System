package com.Akarsh.entities;

import com.Akarsh.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Column(unique = true,nullable = false)
	private String username;
	@Column(nullable = false)
	private String password;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;

	@OneToOne(mappedBy = "user")
	private HotelOwner hotelOwner;
	
//	@OneToOne(mappedBy = "user")
//	private Admin admin;
	
	@OneToOne(mappedBy = "user")
	private Customer customer;
}
