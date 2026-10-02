import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, replace, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function RoomAdd() {
    const { register, handleSubmit, formState } = useForm();
    let navigateTo = useNavigate()
    let { hotelId } = useParams();
    console.log(useParams());
    let loggedInUser = JSON.parse(localStorage.getItem("user"));

    async function collectFormData(formData) 
    {
        let formDataObject = new FormData()
        formDataObject.append("roomObject", JSON.stringify(
            {
                roomNumber: formData.roomNumber,
                roomType: formData.roomType,
                price: formData.price,
                capacity: formData.capacity,
                hotel: {id:hotelId}
            }
        ))
        formDataObject.append("roomImage", formData.roomImage[0]);

        let response = await fetch("http://localhost:8080/api/v1/hotelowner/rooms",
            {
                method: "POST",
                headers: { Authorization: `Bearer ${loggedInUser.jwtToken}` },
                body: formDataObject
            }
        )
        let responseObject = await response.json()
        console.log(responseObject.data);
        if (response.ok) {
            toast.success(responseObject.massage)
            navigateTo("/hotel-owner")
        }
        else {
            toast.error(responseObject.massage)
        }

    }

    //fetch all room 
      let [rooms, setrooms] = useState(null)
      console.log(rooms);
      async function fetchAllrooms() {
        let response = await fetch(`http://localhost:8080/api/v1/get/rooms/${hotelId}`)
        let responseObject = await response.json()
        setrooms(responseObject.data);
      }
    
      useEffect(() => {
        fetchAllrooms()
      }, []);

    return (

        <div>
            <h3 className="text-center mb-4">Add Room</h3>
            <form className="mx-auto" style={{ width: "400px" }}
                onSubmit={handleSubmit(collectFormData)}>

                {/*hotel room Number */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        style={{ height: "48px" }}
                        id="name"
                        placeholder="Room Number"
                        {...register("roomNumber", {
                            required: {
                                value: true,
                                message: "Room Number is required"
                            }
                        })}
                    />

                    <div className="text-danger">
                        {formState.errors?.roomNumber?.message}
                    </div>
                </div>


                {/* Hotel roomType */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        style={{ height: "48px" }}
                        id="location"
                        placeholder="Room Type"
                        {...register("roomType", {
                            required: {
                                value: true,
                                message: "roomType is required"
                            }
                        })}
                    />

                    <div className="text-danger">
                        {formState.errors?.roomType?.message}
                    </div>
                </div>


                {/* room price */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        style={{ height: "48px" }}
                        id="city"
                        placeholder="price/per night"
                        {...register("price", {
                            required: {
                                value: true,
                                message: "price is required"
                            }
                        })}
                    />

                    <div className="text-danger">
                        {formState.errors?.price?.message}
                    </div>
                </div>


                {/* room capacity  */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        style={{ height: "48px" }}
                        id="pincode"
                        placeholder="capacity"
                        {...register("capacity", {
                            required: {
                                value: true,
                                message: "capacity is required"
                            }})}
                    />
                    <div className="text-danger">
                        {formState.errors?.capacity?.message}
                    </div>
                </div>

                <div className="mb-4">
                    <input className="form-control" type="file" id="formFile"
                        {...register("roomImage", {
                            required: { value: true, message: "roomImage is required" }
                        })} />
                    <div className="text-danger">{formState.errors?.roomImage?.message}</div>
                </div>


                {/* Submit Button */}
                <div>
                    <button
                        type="submit" className="btn btn-primary w-100" style={{ height: "48px", fontSize: "17px" }}
                    > Add Room</button>
                </div>
            </form>
        </div>
    )
}
