import React from 'react'
import CustomerNavbar from './CustomerNavbar'
import { Outlet } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <CustomerNavbar/>
      <Outlet/>
    </div>
  )
}
