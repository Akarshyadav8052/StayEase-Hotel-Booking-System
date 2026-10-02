import { createBrowserRouter } from "react-router-dom";
import Home from "../customer/Home";
import Register from "../common/Register";
import Login from "../common/Login";
import adminRoutes from "./AdminRoutes";
import HotelOwnerRoutes from "./HotelOwnerRoutes";
import FetchCustomerHotel from "../customer/FetchCustomerHotel";

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
                }

            ]

        },
        ...adminRoutes,
        ...HotelOwnerRoutes
    ]
)
export default myRoutes;
