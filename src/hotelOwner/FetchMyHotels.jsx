import React, { useEffect, useState } from 'react'
import DisplayMyHotels from './DisplayMyHotels';
import { toast } from 'react-toastify';

export default function FetchMyHotels() {
    let loggedInUser=JSON.parse(localStorage.getItem("user"));
        let [hotels,sethotels]=useState(null);
        let[isHotelDeleted,setIsHotelDeleted]=useState(null)

        //create function for delete hotel in hotel owner dashboard
        async function deleteHotelById(hotelId){
            let response=await fetch(`http://localhost:8080/api/v1/hotelowner/hotels/${hotelId}`,
        {
            method:"delete",
            headers:{Authorization:`Bearer ${loggedInUser.jwtToken}`}
        });
        let responseObject=await response.json();
        if(response.ok)
        {
            toast.success(responseObject.massage)
            setIsHotelDeleted(true)
        }
        else
        {
            toast.error("hotel not deleted")
        }
        }
    
        async function getHotelByHotelOwnerID() 
        {
            setIsHotelDeleted(false)
            let response=await fetch(`http://localhost:8080/api/v1/hotelowner/hotels/${loggedInUser.id}`,
                {
                    headers:{Authorization:`Bearer ${loggedInUser.jwtToken}`}
                })
            let responseObject=await response.json();
            console.log(responseObject); 
            sethotels(responseObject.data); 
        }
    
        useEffect(()=>{
            getHotelByHotelOwnerID()
        },[isHotelDeleted])
  return (
    <div>
    {
        // DisplayMyHotels --> component 
        // hotelsArray ------> property (component ki property)
        hotels?<DisplayMyHotels  hotelsArrays={hotels} deleteHotelFunction={deleteHotelById}/>: <h3 className='text-center border-bottom p-5'>There are no any Hotel found, please add some Hotel!</h3>
    }
    </div>
  )
}
