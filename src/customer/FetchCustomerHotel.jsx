import React, { useEffect, useState } from 'react'
import DisplayCustomerHotel from './DisplayCustomerHotel';

export default function FetchCustomerHotel() {
  let loggedInUser=JSON.parse(localStorage.getItem("user"));
  let [hotels,setHotel]=useState(null)
  console.log(hotels);

  async function fetchAllHotels()
  {
    let response=await fetch("http://localhost:8080/api/v1/get/hotels",)
    let responseObject=await response.json()
    console.log(response);
    setHotel(responseObject.data)
  }

  useEffect(()=>
    {
      fetchAllHotels()
    },[])

    async function filterHotels(cityName,locationName)
    {
       let BASEURL="http://localhost:8080/api/v1/get/filtered-hotels?"
       let urlParams=new URLSearchParams()
       if(cityName!=null && cityName!="All")
       {
        urlParams.append("cityName",cityName)

       }
       if(locationName!=null && locationName!="All")
      {
        urlParams.append("locationName",locationName)
      }

       console.log(BASEURL+urlParams.toString());
       
       let response=await fetch(BASEURL+urlParams.toString())
       let responseObject=await response.json()
       console.log(responseObject)
       setHotel(responseObject.data)

    }
  return (
    <div>
    {
      hotels?<DisplayCustomerHotel hotelArrays={hotels} filteredHotelFunction={filterHotels}/>:"Hotels loading.."
    }
    </div>
  )
}
