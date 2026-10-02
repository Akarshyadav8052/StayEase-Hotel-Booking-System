import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, replace, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Hotel() {
  const { register, handleSubmit, formState } = useForm();
  let navigateTo = useNavigate()
  let loggedInUser = JSON.parse(localStorage.getItem("user"));
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

    let response = await fetch("http://localhost:8080/api/v1/hotelowner/hotels",
      {
        method: "POST",
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

  //fetch all hotels
  let [hotels, sethotels] = useState(null)
  console.log(hotels);
  async function fetchAllHotels() {
    let response = await fetch(`http://localhost:8080/api/v1/get/hotels/${loggedInUser.id}`)
    let responseObject = await response.json()
    sethotels(responseObject.data);
  }

  useEffect(() => {
    fetchAllHotels()
  }, []);
  return (
    <div>
      <h3 className="text-center mb-4">Add Hotel</h3>

      <form className="mx-auto"
        style={{ width: "400px" }}
        onSubmit={handleSubmit(collectFormData)}
      >

        {/* Hotel Name */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            style={{ height: "48px" }}
            id="name"
            placeholder="Hotel Name"
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
            placeholder="Location Name"
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
            placeholder="City Name"
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
            placeholder="Pincode Number"
            {...register("pincode", {
              required: {
                value: true,
                message: "Pincode is required"
              },
              minLength: {
                value: 6,
                message: "Pincode must be 6 digits"
              },
              maxLength: {
                value: 6,
                message: "Pincode must be 6 digits"
              }
            })}
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
            type="submit" className="btn btn-primary w-100" style={{ height: "48px", fontSize: "17px" }}
          > Add Hotel</button>
        </div>
      </form>
    </div>
  )
}
