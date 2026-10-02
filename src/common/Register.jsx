import React from 'react'
import { useForm } from 'react-hook-form'
import { replace,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Register() {
  const { register, handleSubmit, formState } = useForm()
  let navigateTo=useNavigate()
  async function collectFormData(formData) {
    console.log(formData);
    let response = await fetch("http://localhost:8080/api/v1/register",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    )

    let responseObject=await response.json()
    if(response.ok){
      // console.log(responseObject.massage);
      toast.success(responseObject.massage)
      navigateTo("/login",replace);
    }

    else{
      // console.log("Registration failed!");
      toast.error(responseObject.massage);
      
    }
  }
  return (

    <div className="d-flex justify-content-center mt-4 register-bg">
      <form className="w-25 border border-2 p-4 rounded-5 shadow-lg bg-light" onSubmit={handleSubmit(collectFormData)}>
        <h1 className="text-center ">
          Register
        </h1>
        <hr className="border-dotted border-success" />

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            <i className="bi bi-person-fill"></i> Username
          </label>
          <input type="text" className="form-control rounded-pill" id="username"
            {...register("username",
              {
                required: { value: true, message: "username is required" },
                minLength: { value: 3, message: "min 3 characters required" },
                maxLength: { value: 10, message: "max 10 characters allowed" }
              }
            )} />
          <div className="text-danger small">{formState.errors?.username?.message}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            <i className="bi bi-lock-fill"></i> Password
          </label>
          <input type="password" className="form-control rounded-pill" id="password"
            {...register("password",
              {
                required: { value: true, message: "password is required" },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                  message: "Include letters, numbers & special characters"
                }
              }
            )} />
          <div className="text-danger small">{formState.errors?.password?.message}</div>
        </div>

        <div className="mb-3 mt-4">
          <label className="form-label">
            <i className="bi bi-basket-fill"></i> Select Role
          </label>
          <select className="form-select rounded-pill" {...register("role", {
            required: {
              value: true,
              message: "role is required"
            }
          })}>
            <option value="">Select Role</option>
            <option value="CUSTOMER">Customer</option>
            <option value="HOTELOWNER">HotelOwner</option>
          </select>
          <div className="text-danger small">{formState.errors?.role?.message}</div>
        </div>

        <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold submit-btn">
          Submit
        </button>
      </form>
    </div>
  )
}
