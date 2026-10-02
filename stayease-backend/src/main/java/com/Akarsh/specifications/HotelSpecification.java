package com.Akarsh.specifications;

import org.springframework.data.jpa.domain.Specification;

import com.Akarsh.entities.Hotel;

public class HotelSpecification {
	
	//according to cityName filteration
	public static Specification<Hotel>hasCityName(String cityName)
	{
		return (root,query,cb)->
		{
			if(cityName==null || cityName.isBlank())
			{
				return null;
			}
			return  cb.equal(cb.lower(root.get("city")), cityName.toLowerCase());
		};
	}
	
	//according to locationName filteration
	public static Specification<Hotel>hasLocationName(String locationName)
	{
		return (root,query,cb)->
		{
			if(locationName==null || locationName.isBlank())
			{
				return null;
			}
			return  cb.equal(cb.lower(root.get("location")), locationName.toLowerCase());
		};
	}
	
	
	//according to price sort filteration
	public static Specification<Hotel> shortByPrice(String sortDirection)
	 { 
		 return (root,query,criteriaBuilder) -> 
		 {
			 if(sortDirection==null || sortDirection.isBlank())
			 {
				 return null;
			 }
			 
			 if(sortDirection.equalsIgnoreCase("asc"))
			 {
				 query.orderBy(criteriaBuilder.asc(root.get("price")));
			 }
			 else
			 {
				 query.orderBy(criteriaBuilder.desc(root.get("price")));
			 }
			 return null;
		 }; 
	 } 

}
