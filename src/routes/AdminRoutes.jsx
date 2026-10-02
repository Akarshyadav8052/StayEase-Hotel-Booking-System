import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import { Children } from "react";
import HotelRequest from "../admin/HotelRequest";

const adminRoutes=
    [
        {
            path:"/admin",
            element: <AdminDashboard/>,
            children: 
            [
                {
                    path:"/admin/hotel-requests",
                    element:<HotelRequest/>
                }
            ]
        }   
    ]
export default adminRoutes;