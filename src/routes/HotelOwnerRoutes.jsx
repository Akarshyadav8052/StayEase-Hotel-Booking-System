import { createBrowserRouter } from "react-router-dom";
import HotelOwnerDashboard from "../hotelOwner/HotelOwnerDashboard";
import Hotel from "../hotelOwner/Hotel";
import FetchMyHotels from "../hotelOwner/FetchMyHotels";
import UpdateHotel from "../hotelOwner/UpdateHotel";
import RoomAdd from "../hotelOwner/RoomAdd";
import MyHotels from "../hotelOwner/MyHotel";
import FetchMyRoom from "../hotelOwner/FetchMyRoom";

const HotelOwnerRoutes =
    [
        {
            path: "/hotel-owner",
            element: <HotelOwnerDashboard />,
            children:
                [
                    {
                        path: "/hotel-owner/add-hotel",
                        element: <Hotel />
                    },
                    {
                        path: "/hotel-owner/my-hotel",
                        element: <MyHotels/>
                    },
                    {
                        index: true,
                        element: <FetchMyHotels />,
                    },
                    {
                        path:"/hotel-owner/update-product/:hotelId",
                        element:<UpdateHotel/>
                    },
                    {
                        path:"/hotel-owner/add-room/:hotelId",
                        element:<RoomAdd/>
                    },
                    {
                        path: "/hotel-owner/rooms/:hotelId",
                        element: <FetchMyRoom/>
            }
                ]

        }
    ]

export default HotelOwnerRoutes;