import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyHotels() {

    let loggedInUser = JSON.parse(localStorage.getItem("user"));

    let [hotels, setHotels] = useState(null);

    let navigateTo = useNavigate();


    async function getHotelByHotelOwnerID() {
        let response = await fetch(`http://localhost:8080/api/v1/hotelowner/hotels/${loggedInUser.id}`,
            {
                headers: { Authorization: `Bearer ${loggedInUser.jwtToken}` }
            })
        let responseObject = await response.json();
        console.log(responseObject);
        setHotels(responseObject.data);
    }


    useEffect(() => {

        getHotelByHotelOwnerID()

    }, []);


    return (
    <div className="container mt-4">
        <h2 className="text-center mb-4">My Hotels</h2>
        <div className="row">
            {
            hotels?hotels.map((hotel) => {
                return (
                     <div className="col-md-4 mb-4"key={hotel.id}>
                        <div className="card">
                            <img src={`http://localhost:8080/api/v1/images/${hotel.imageName}`}
                            className="card-img-top"style=
                            {{height: "200px",objectFit: "cover" }}/>
                            <div className="card-body">
                                <h5 className="card-title">{hotel.name}</h5>
                                <p className="card-text">{hotel.location}</p>
                                <p className="card-text">{hotel.city}</p>
                                <p className="card-text">Pincode: {hotel.pincode}</p>
                                <p>Status:{hotel.hotelStatus}</p>
                                <button className="btn btn-primary"
                                onClick={() =>navigateTo
                                (`/hotel-owner/add-room/${hotel.id}`) }>Add Room</button>
                                <button className="btn btn-primary ml-4"
                                onClick={() =>navigateTo(`/hotel-owner/rooms/${hotel.id}`)}
                                >View Room</button>
                            </div>
                        </div>
                    </div>
                );}):<p className="text-center">Loading hotels...</p>

                }
            </div>

        </div>

    );
}