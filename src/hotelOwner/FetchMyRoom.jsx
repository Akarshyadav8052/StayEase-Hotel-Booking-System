import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import DisplayMyRoom from './DisplayMyRoom';
import { useParams } from 'react-router-dom';

export default function FetchMyRoom() {
    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    let [rooms, setRooms] = useState(null);
    const { hotelId } = useParams()
    let [isRoomDeleted, setIsRoomDeleted] = useState(null)

    //create function for delete hotel in vendor dashboard
    async function deleteRoomById(roomId) {
        let response = await fetch(`http://localhost:8080/api/v1/hotelowner/rooms/${roomId}`,
            {
                method: "delete",
                headers: { Authorization: `Bearer ${loggedInUser.jwtToken}` }
            });
        let responseObject = await response.json();
        if (response.ok) {
            toast.success(responseObject.massage)
            setIsRoomDeleted(true)                         
        }
        else {
            toast.error(responseObject.massage)
        }
    }

    async function getAllRoomByHotelID(hotelId) {
        setIsRoomDeleted(false)
        let response = await fetch(`http://localhost:8080/api/v1/get/rooms/${hotelId}`);
        let responseObject = await response.json();
        console.log(responseObject);

        if (response.ok) {
           
            setRooms(responseObject.data);
        }
    }

    useEffect(() => {
        getAllRoomByHotelID(hotelId)
    }, [isRoomDeleted,hotelId])

    return (
        <div >
            
            {
                
               rooms ?<DisplayMyRoom  roomArray={rooms} deleteRoomFunction={deleteRoomById}/>:<h3 className='text-center border-bottom p-5'>There are no any Room found, please add some Room!</h3>
            }
        </div>
    )
}
