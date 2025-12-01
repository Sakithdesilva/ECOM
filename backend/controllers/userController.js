 import User from "../models/userModels.js";
 import asyncHadler from "../middlewares/asyncHandler.js"
 import bcrypt from "bcryptjs"
 import createToken from "../utils/createToken.js"


 const createUser = asyncHadler(async(req,res) => {
    const {username,email,password} = req.body;

     if(!username || !email || !password){
      throw new Error('Please Fill All the inputs');

     }

     const userExist = await User.findOne({email});
     if(userExist) res.status(400).send("User Already Exist");

     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password,salt);


     const newUser = new User({username,email,password:hashedPassword});

     try {
        await newUser.save();
        createToken(res,newUser._id);


        res.status(201).json({
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin
        })
     } catch (error) {
      res.status(400);
      throw new Error("Invalid User data");

     }


 });


 const loginUser = asyncHadler(async(req,res) =>  {
    const {email,password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
      const isValidPassword = await bcrypt.compare(password,existingUser.password);

      if(isValidPassword){
        createToken(res,existingUser._id);
        res.status(201).json({
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin
        })
        return;

      }else{
        res.status(400);
        throw new Error('Incorrect Password');

      }
    }else{
      res.status(400);
      throw new Error('Create User before login');

    }
 })

 const logoutCurrentUser = asyncHadler(async(req,res) => {
    res.cookie('jwt','',{
      httpOnly: true,
      expires: new Date(0)
    })
     res.status(200).json({message:"Logged Out Successfully"});

  
  });

const getAllUsers = asyncHadler(async(req,res) => {
  const users = await User.find({}).select("-password");
  res.send(users);

});


const getCurrentUserProfile = asyncHadler(async(req,res) => {
  const user = await User.findById(req.user._id);

  if(user){
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }else{
    res.status(404);
    throw new Error('User not found');

  }
})

const updateCurrentUserProfile = asyncHadler(async(req,res) => {
  const user = await User.findById(req.user._id);

  if(user){
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    
    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password,salt);
      user.password = hashedPassword;

    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  }else{
    res.status(404);
    throw new Error('User not found');

  }
});

const deleteUserById = asyncHadler(async(req,res) => {
  const user = await User.findById(req.params.id);

  if(user){
    if(user.isAdmin){
      res.status(400);
      throw new Error('Admin User cannot be deleted');

    }
    await User.deleteOne({_id:user._id});
    res.json({message:'User deleted'});

  }else{
    res.status(404).send("User not found");

  }
});

const getUserById = asyncHadler(async(req,res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user){
       res.json(user);

    }else{
      res.status(404);
      throw new Error('User not found');

    }


});


const updateUserById = asyncHadler(async(req,res) => {
  const user = await User.findById(req.params.id);

  if(user){
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email:updatedUser.email,
      isAdmin: updatedUser.isAdmin
    });

    
  }else{
    res.status(404);
    throw new Error("User not found");
    
  }

  
})



 export {createUser,loginUser,logoutCurrentUser,getAllUsers,getCurrentUserProfile,updateCurrentUserProfile,deleteUserById,getUserById,updateUserById};
  
