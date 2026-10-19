import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

export default function FilterNavbar(props) {

    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    const { register, handleSubmit, formState, watch } = useForm();
    let [hotels, setHotels] = useState(null);
    let selectedCity = watch("city");
    console.log(selectedCity);

    async function fetchAllHotels() {
        let response = await fetch("http://localhost:8080/api/v1/get/hotels",)
        let responseObject = await response.json()
        console.log(response);
        setHotels(responseObject.data)
    }

    useEffect(() => {
        fetchAllHotels();
    }, []);


    //filtretion logic 
    let filterHotels = props.filteredHotelFunction
    let [cityName, setCityName] = useState(null)
    let [locationName, setLocationName] = useState(null)
    let [hotelName, setHotelName] = useState(null)

    function collecFormData(formData) //this is used to collect hotel only
    {
        console.log(formData);
        setHotelName(formData.hotelName)
    }

    useEffect(() => {
        filterHotels(cityName, locationName, hotelName)
    }, [cityName, locationName, hotelName])


    return (
        <div className='row mt-3 mb-3'>
            {/* city dropDown */}
           <div className="col-3">
            <select
                className="form-select"
                {...register("city", {
                    onChange: (event) => {
                        const city = event.target.value;

                        setCityName(city);
                        setLocationName("");
                    }
                })}
            >
                <option value="">Select City</option>
                <option value="All">All</option>

                {hotels && [...new Set(
                    hotels.map((hotel) => hotel.city)
                )].filter(Boolean).map((city) => (
                    <option value={city} key={city}>
                        {city}
                    </option>
                ))}
            </select>
        </div>
            <div className="col-3">
                <select className="form-select" {...register("location"),
                {
                    onChange: (event) => {
                        console.log(event.target.options[event.target.selectedIndex].text)
                        setLocationName(event.target.options[event.target.selectedIndex].text)

                    }
                }
                }>
                    <option value="">Select Your location</option>
                    <option value="All">All</option>
                    {
                        hotels
                            ? hotels
                                .filter((hotel) => hotel.city === selectedCity)
                                .map((hotel, index, filteredHotels) => {

                                    let firstIndex = filteredHotels.findIndex(
                                        (h) => h.location === hotel.location
                                    );

                                    if (firstIndex === index) {
                                        return (
                                            <option
                                                value={hotel.location}
                                                key={hotel.location}
                                            >
                                                {hotel.location}
                                            </option>
                                        );
                                    }

                                    return null;
                                })
                            : "loading hotels"
                    }
                </select>
            </div>
            <div className="col-3">
                <select className="form-select">
                    <option value="">Sort  By Price</option>
                    <option value="All">Reset</option>
                    <option value="desc">High to Low</option>
                    <option value="asc">Low to High</option>
                </select>
            </div>
            <div className="col-3 ">
                <form className='d-flex ' onSubmit={handleSubmit(collecFormData)}>
                    <input type="text" class="form-control me-2" placeholder='Hotel Name'
                        {...register("hotelName")} />
                    <button type="submit" class="btn btn-primary">Search</button> 
                </form>
            </div>
        </div>
    )
}
