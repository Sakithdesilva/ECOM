import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
 import { setCredentials } from "../../redux/features/auth/authSlice";
 import { Link } from "react-router-dom";
 import { useProfileMutation } from "../../redux/api/usersApiSlice";
 


const Profile = () => {
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');

  const {userInfo} =  useSelector(state => state.auth);

  const [updateProfile,{isLoading: loadingUpdateProfile}] = useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);

  },[userInfo.username,userInfo.email]);

  const dispatch = useDispatch();

  const submitHandler = async(e) => {
    e.preventDefault();

    if(password !== confirmPassword){
      toast.error("password does not match");

    }else{
      try {
        const res = await updateProfile({_id:userInfo._id,username,email,password}).unwrap();
        dispatch(setCredentials({...res}));
        toast.success("Profile Updated Successfully");
        
      } catch (error) {
        console.error(error?.data?.message || error.message);

      }
    }
  }


  return (
    <div className="mt-[7rem] mx-auto p-4 container ">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
        
          <h2 className="text-white font-semibold text-2xl mb-4">
          Update Profile
        </h2>
        <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label
              className="text-white block mb-2"
              >Name</label>
              <input type="text" 
              className="p-2 w-full rounded-sm border" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
              className="text-white block mb-2"
              >Email</label>
              <input type="text" 
              className="p-2 w-full rounded-sm border" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
              className="text-white block mb-2"
              >Passwrod</label>
              <input type="password" 
              className="p-2 w-full rounded-sm border" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
              className="text-white block mb-2"
              >Confirm Password</label>
              <input type="password" 
              className="p-2 w-full rounded-sm border" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button type ="submit" className="bg-pink-500 hover:bg-pink-600  px-4 py-3 rounded cursor-pointer font-semibold">
                  Update Profile
              </button>

              <Link to= '/user-orders' className="bg-pink-500 hover:bg-pink-600 px-4 py-3 rounded font-semibold">My Orders</Link>
            </div>
          </form>

        </div>

        {loadingUpdateProfile && <Loader/>}
        
      </div>
    </div>
  )
}

export default Profile