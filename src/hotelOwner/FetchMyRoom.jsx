import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import DisplayMyRoom from './DisplayMyRoom';
import { useParams } from 'react-router-dom';

export default function FetchMyRoom() {
    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    let [Rooms, setRooms] = useState(null);
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
        
        let response = await fetch(`http://localhost:8080/api/v1/get/rooms/${hotelId}`);
        let responseObject = await response.json();
        console.log(responseObject);

        if (response.ok) {
            toast.success(responseObject.massage)
            setRooms(responseObject.data);
        }
        else {
            toast.error(responseObject.massage)
        }
    }

    useEffect(() => {
        getAllRoomByHotelID(hotelId)
    }, [isRoomDeleted])

    return (
        <div >
            {
               Rooms? <DisplayMyRoom  roomArray={Rooms} deleteRoomFunction={deleteRoomById}/>:<h3 className='text-center border-bottom p-5'>There are no any Room found, please add some Room!</h3>
            }
        </div>
    )
}
