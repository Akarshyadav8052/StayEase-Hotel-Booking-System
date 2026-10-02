import React from 'react'
import HotelOwnerNavbar from './HotelOwnerNavbar'
import { Outlet } from 'react-router-dom'

export default function HotelOwnerDashboard() {
  let loggedInUser=JSON.parse(localStorage.getItem("user"))
  return (
    <div>
      <HotelOwnerNavbar/>
      Welcome {loggedInUser.username}
      <Outlet/>
    </div>
  )
}
