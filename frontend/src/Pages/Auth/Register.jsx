import { useState,useEffect } from "react";
import {Link,useLocation,useNavigate} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";

const Register = () => {

  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register,{isLoading}] = useRegisterMutation();
  const {userInfo} = useSelector(state => state.auth);

  const search = useLocation();
  const sp = new URLSearchParams(search.search);
  const redirect = sp.get('redirect') || '/';


  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  },[navigate,redirect,userInfo]);

  const onSubmitHandler = async(e) => {
    e.preventDefault();

    if(password !== confirmPassword){
      throw new Error('Password does not match');
    }else{
      try {
        const res = await register({username,email,password}).unwrap();
        dispatch(setCredentials({...res}));
        navigate(redirect);
        toast.success('User Successfully Registered');
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message);

      }


    }

  }

  
  



  return (
    <div className="pl-[10rem] flex flex-wrap">
        <section className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>

          <form onSubmit= {onSubmitHandler} className="w-[40rem] container">
            <div className="my-[2rem]">
              <label 
              htmlFor="name" 
              className="block text-sm font-medium text-white"
              >Name</label>
              <input 
              type="text" 
              id= "name"
              className ="mt-1 p-2 w-full border rounded"
              value ={username}
              onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label 
              htmlFor="email" 
              className="block text-sm font-medium text-white"
              >Email</label>
              <input 
              type="text" 
              id= "email"
              className ="mt-1 p-2 w-full border rounded"
              value ={email}
              onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label 
              htmlFor="password" 
              className="block text-sm font-medium text-white"
              >Password</label>
              <input 
              type="password" 
              id= "password"
              className ="mt-1 p-2 w-full border rounded"
              value ={password}
              onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="my-[2rem]">
              <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-white"
              >Confirm Password</label>
              <input 
              type="password" 
              id= "confirmPassword"
              className ="mt-1 p-2 w-full border rounded"
              value ={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <button disabled={isLoading}
            className="bg-pink-500 text-white px-4 py-2 cursor-pointer rounded font-semibold"
            >
                {isLoading ? "Registering...." : "Register"}
            </button>
            {isLoading && <Loader/>}
          </form>

          <div className="mt-4">
            <p className="text-white">
              Already Log in ? {" "} 
              <Link 
              to = {redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline">Log in</Link>
            </p>
          </div>
        </section>

    </div>
    
  )
}

export default Register