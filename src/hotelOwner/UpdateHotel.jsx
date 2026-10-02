import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Link, replace, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function UpdateHotel() {
    const { register, handleSubmit, formState } = useForm();
    let navigateTo = useNavigate()
    let loggedInUser = JSON.parse(localStorage.getItem("user"));

    let URLParams = useParams()
    console.log(URLParams);

    async function collectFormData(formData) {
        let formDataObject = new FormData()
        formDataObject.append("hotelObject", JSON.stringify(
            {
                name: formData.name,
                location: formData.location,
                city: formData.city,
                pincode: formData.pincode,
                hotelOwner: { id: loggedInUser.id }
            }
        ))
        formDataObject.append("hotelImage", formData.hotelImage[0]);

        let response = await fetch(`http://localhost:8080/api/v1/hotelowner/hotels/${URLParams.hotelId}`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${loggedInUser.jwtToken}` },
                body: formDataObject
            }
        )
        let responseObject = await response.json()
        console.log(responseObject);
        if (response.ok) {
            toast.success(responseObject.massage)
            navigateTo("/hotel-owner")
        }
        else {
            toast.error(responseObject.massage)
        }
    }

    //getting hotel details based on hotelId to show hotel details in the form
    let [hotel, setHotel] = useState(null);
    console.log(hotel);
    // console.log(`http://localhost:8080/api/v1/get/hotels/${URLParams.hotelId}`); check url in console


    async function fetchHotelById() {
        let response = await fetch(`http://localhost:8080/api/v1/get/hotels/${URLParams.hotelId}`);
        let responseObject = await response.json();
        setHotel(responseObject.data);
    }

    useEffect(() => {
        fetchHotelById();
    }, []);

    return (
        <div>
            <h3 className="text-center">Update Hotel Here</h3>

            {
                // hotel?"YES":"NO"
                hotel ?
                    <form className="mx-auto" style={{ width: "400px" }}
                        onSubmit={handleSubmit(collectFormData)}>

                        {/* Hotel Name */}
                        <div className="mb-4">
                            <input type="text" className="form-control" style={{ height: "48px" }}
                                id="name"
                                defaultValue={hotel.name}
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: "Hotel name is required"
                                    }
                                })}
                            />

                            <div className="text-danger">
                                {formState.errors?.name?.message}
                            </div>
                        </div>


                        {/* Hotel Location */}
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control"
                                style={{ height: "48px" }}
                                id="location"
                                defaultValue={hotel.location}
                                {...register("location", {
                                    required: {
                                        value: true,
                                        message: "Location is required"
                                    }
                                })}
                            />

                            <div className="text-danger">
                                {formState.errors?.location?.message}
                            </div>
                        </div>


                        {/* Hotel City */}
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control"
                                style={{ height: "48px" }}
                                id="city"
                                defaultValue={hotel.city}
                                {...register("city", {
                                    required: {
                                        value: true,
                                        message: "City is required"
                                    }
                                })}
                            />

                            <div className="text-danger">
                                {formState.errors?.city?.message}
                            </div>
                        </div>


                        {/* Hotel Pincode */}
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control"
                                style={{ height: "48px" }}
                                id="pincode"
                                defaultValue={hotel.pincode}
                                {...register("pincode", {
                                    required: {
                                        value: true,
                                        message: "Pincode is required"
                                    }})}
                            />
                            <div className="text-danger">
                                {formState.errors?.pincode?.message}
                            </div>
                        </div>

                        <div className="mb-4">
                            <input className="form-control" type="file" id="formFile"
                                {...register("hotelImage", {
                                    required: { value: true, message: "hotel Image is required" }
                                })} />
                            <div className="text-danger">{formState.errors?.hotelImage?.message}</div>
                        </div>


                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit" className="btn btn-primary w-100"> Submit</button>
                        </div>
                    </form> : "Fetching product details...."
            }
        </div>
    )
}
