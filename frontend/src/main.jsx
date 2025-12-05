import './index.css'
import { createRoot } from 'react-dom/client'
import {Route,createRoutesFromElements,RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store.js"
 
import App from './App.jsx';
import Login from './Pages/Auth/Login.jsx';
import Register from './Pages/Auth/Register.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Profile from './Pages/Users/Profile.jsx';
import AdminRoutes from './Pages/Admin/AdminRoutes.jsx';
import UserList from './Pages/Admin/UserList.jsx';
import CategoryList from './Pages/Admin/CategoryList.jsx';
import ProductList from './Pages/Admin/ProductList.jsx';
import ProductUpdate from './Pages/Admin/ProductUpdate.jsx';
import AllProducts from './Pages/Admin/AllProducts.jsx';



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route path="/login" element={<Login/>}/>
            <Route  path='/register' element={<Register/>}/>

            <Route path="" element={<PrivateRoute/>}>
                <Route path="/profile"  element={<Profile/>}/>
            </Route>

            <Route path="/admin" element={<AdminRoutes/>}>
                <Route path="/admin/userlist" element = {<UserList/>}/>
                <Route path="/admin/categorylist" element={<CategoryList/>}/>
                <Route path = "/admin/productlist" element={<ProductList/>}/>
                <Route path = "/admin/product/update/:id" element={<ProductUpdate/>}/>
                <Route path = "/admin/allproducts" element={<AllProducts/>}/>
            </Route>

        </Route>
    )
)

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router= {router}/>
    </Provider>
   
    
)
