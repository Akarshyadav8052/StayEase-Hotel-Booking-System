import { createBrowserRouter } from "react-router-dom";
import Home from "../customer/Home";
import Register from "../common/Register";
import Login from "../common/Login";
import adminRoutes from "./AdminRoutes";
import HotelOwnerRoutes from "./HotelOwnerRoutes";
import FetchCustomerHotel from "../customer/FetchCustomerHotel";
import CustomerHotelDetails from "../customer/CustomerHotelDetails";
import Booking from "../customer/Booking";
import CustomerReminders from "../customer/CustomerReminders";

const myRoutes = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />,
            children: [

                {
                    path: "/register",
                    element: <Register />
                },
                {
                    path: "/login",
                    element: <Login />
                },
                {
                    index:true,
                    element:<FetchCustomerHotel/>
                },
                {
                    path:"/customer/hotel-details/:hotelId",
                    element:<CustomerHotelDetails/>
                },
                {
                    path:"/customer/my-bookings",
                    element:<Booking/>
                },
                {
                    path:"/customer/reminders",
                    element:<CustomerReminders/>
                }

            ]

        },
        ...adminRoutes,
        ...HotelOwnerRoutes
    ]
)
export default myRoutes;
