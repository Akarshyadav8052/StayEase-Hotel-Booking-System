package com.Akarsh.entities;

import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.Akarsh.enums.HotelStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
public class Hotel {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Column(nullable = false)
	private String name;
	private String location;
	private String city;
	private String pincode;
	private String imageName;
	
	@Enumerated(EnumType.STRING)
	private HotelStatus hotelStatus;
	
	@ManyToOne
	@JoinColumn(name = "hotelOwner_id")
	@JsonProperty(access = Access.WRITE_ONLY)
	private HotelOwner hotelOwner; 
	
	@OneToMany(mappedBy = "hotel")
	private List<Room> room;

}
