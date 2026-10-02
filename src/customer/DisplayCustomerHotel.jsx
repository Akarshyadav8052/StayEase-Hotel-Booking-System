import React from 'react'
import FilterNavbar from './FilterNavbar'

export default function DisplayCustomerHotel(props) {
  let hotels=props.hotelArrays
  return (
    <div className='container'>
        <FilterNavbar filteredHotelFunction={props.filteredHotelFunction}/>
        <div className="row">
          {
            hotels.map((hotel)=>{
              return(
                <div className="col-3">
                  <div className="card mb-2" style={{width:"15rem"}}>
                    <img src={`http://localhost:8080/api/v1/images/${hotel.imageName}`}  className="card-img-top ms-auto me-auto p-2" alt="..." style={{height:"200px", width:"200px"}}/>
                    <div className="card-body">
                      <h5 className="card-title text-capitalize text-center">{hotel.name}</h5>
                      <div className='d-flex justify-content-between mb-2'>
                        <span className='bg-primary text-light ps-2 pe-2 rounded'>{hotel.location}</span>
                        <span className='bg-warning  ps-2 pe-2 rounded'>{hotel.city}</span>
                      </div>
                      <button className="btn btn-secondary w-100">View Details</button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
}
