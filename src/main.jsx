import { createRoot } from 'react-dom/client'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css'
import { RouterProvider } from 'react-router-dom'
import myRoutes from './routes/AppRoutes.jsx'
import{ToastContainer, Zoom} from 'react-toastify'

createRoot(document.getElementById('root')).render(
    <>
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Zoom}
        />
        <RouterProvider router={myRoutes} />
    </>

)
