import React from 'react'
import AdminNavbar from './AdminNavbar'
import { Outlet } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div>
      <AdminNavbar/>
      Welcom admin
      <Outlet/>
      
    </div>
  )
}
