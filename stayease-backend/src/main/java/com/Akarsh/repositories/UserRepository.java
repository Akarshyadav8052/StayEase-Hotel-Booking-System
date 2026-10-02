package com.Akarsh.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Akarsh.entities.User;
import java.util.*;


@Repository
public interface UserRepository extends JpaRepository<User, Long>
{
 
	//after login, collect user object we use
	Optional<User> findByUsername(String username); //if username present then it will give object
	//while registering, to check if username already exists or not
	boolean existsByUsername(String username);  //if username present then return true otherwise false
}
