package com.Akarsh.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Room {	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String roomNumber;
    private String roomType;
    private double price;
    private int capacity;
    private String roomImage;
    
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    @JsonProperty(access = Access.WRITE_ONLY)
    private Hotel hotel;
}
