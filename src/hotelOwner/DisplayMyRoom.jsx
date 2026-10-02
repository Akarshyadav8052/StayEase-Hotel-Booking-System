import React, { useState } from 'react'
import { Link, Links } from 'react-router-dom'

export default function DisplayMyRoom(props) {
  let rooms=props.roomArray
  let[roomId,setRoomId]=useState(null)

  return (
    <div className='container'>
        <h3 className='text-center'>My Room</h3>
      {/* {
        products.map(product => {
            return <h1>{product.name}</h1>
        })
      } */}

    <table className="table table-hover table-bordered text-center">
        <thead className='table-primary'>
            <tr>
            <th scope="col">ID</th>
            <th scope="col">Image</th>
            <th scope="col">ROOM NUMBER</th>
            <th scope="col">ROOM TYPE</th>
            <th scope="col">PRICE</th>
            <th scope="col">CAPICITY</th>
            <th scope="col" colSpan={2}>ACTION</th>
            </tr>
        </thead>
        <tbody>
            {
                rooms.map(room => {
                    return (
                        <tr>
                            <th scope="row">{room.id}</th>
                            <td>
                                <img src={`http://localhost:8080/api/v1/images/${room.roomImage}`} 
                                style={{height:"50px", width:"50px"}} className='rounded'/>
                            </td>
                            <td >{room.roomNumber}</td>
                            <td className='text-capitalize'>{room.roomType}</td>
                            <td>{room.price}</td>
                            <td>{room.capacity}</td> 
                            <td>
                                <Link className='btn btn-warning' to={`/hotel-owner/update-product/${room.id}`}>Update</Link>
                            </td>
                            <td>
                                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={()=>{setRoomId(room.id)}}>Delete</button>

                                 {/* modal code  */}
                                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Do You Really Want to Delete?</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-footer"> 
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-danger" onClick={()=>{props.deleteRoomFunction(roomId)}} data-bs-dismiss="modal" >Delete</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )
                })
            }
            
        </tbody>
    </table>
    </div>
  )
}

