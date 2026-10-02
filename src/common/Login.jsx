import React from 'react'
import { useForm } from 'react-hook-form'
import { replace, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const { register, handleSubmit, formState } = useForm();
  let navigateTo=useNavigate();
  async function collectFormdata(formData) {
    
    console.log(formData);
    let response = await fetch("http://localhost:8080/api/v1/login",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
    let responseObject = await response.json();
    if (response.ok) {
      // console.log(responseObject.massage);
      localStorage.setItem("user",JSON.stringify(responseObject.data));
      let role=responseObject.data.role;
      console.log(role);
      toast.success(responseObject.massage)
      if(role==="ADMIN")
      {
        navigateTo("/admin",replace)
      }
      else if(role==="HOTELOWNER"){
        navigateTo("/hotel-owner",replace)
      }
      else{
        navigateTo("/",replace)
      }

    }
    else {
      // console.log("login failed!")
      toast.error(responseObject.massage);
    }

  }
  return (
    <div>
      <div className="d-flex justify-content-center mt-5 align-items-center login-bg">
        <form className="w-25 border border-2 p-4 rounded-5 shadow-lg bg-light" onSubmit={handleSubmit(collectFormdata)}>
          <h1 className="text-center"> Login</h1>
          <hr className="border-dotted border-success" />
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              <i className="bi bi-person-fill"></i> Username</label>
            <input type="text" className="form-control rounded-pill" id="username" placeholder="Enter your username"
              {...register("username",
                {
                  required: { value: true, message: "username must required" },
                }
              )}
            />
            <div className='text-danger'>{formState.errors?.username?.message}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <i className="bi bi-lock-fill"></i> Password</label>
            <input type="password" className="form-control rounded-pill" id="password" placeholder="Enter your password"
              {...register("password",
                {
                  required: { value: true, message: "password must required" },
                }
              )} />
            <div className='text-danger'>{formState.errors?.password?.message}</div>
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
