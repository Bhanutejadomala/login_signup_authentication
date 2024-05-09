const port = 7000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors=require('cors')

app.use(express.json());
app.use(cors());

//connecting database with mongodb
mongoose.connect("mongodb://localhost:27017/loginSignup")

//api creation
app.get("/", (req, res) => {
    res.send("express is running")
})



//schema for creating user model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//creating endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with the same email address"})
    }
   
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
       
    })

    await user.save();

    const data={
        user:{
            id:user.id
        }
    }

    const token =jwt.sign(data,'secret_key');
    res.json({success:true,token}) 
})

//creating endpoint for user login

app.post('/login',async (req,res)=>{
    console.log(req.body)
    let user = await Users.findOne({email:req.body.email});
    console.log(user)
    if (user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data={
                user:{
                    id:user._id
                }
            }
            const token =jwt.sign(data,'secret_key');
            console.log(token)
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,error:"Wrong Email Id"});
    }

})


// creating middleware to fetch user
  const fetchUser = async (req,res,next)=>{
    const token =req.header('auth-token');
     if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
     }
     else{
        try{
            const data=jwt.verify(token,"secret_key");
            req.user=data.user;
            next();
        }catch(error){
            res.status(401).send({errors:" invalid token"})
        }
     }
  }

  app.get('/userdetails', fetchUser, async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        throw new Error('User not found');
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(404).send(error.message);
    }
  });



app.listen(port, (error) => {
    if (!error) {
        console.log("server is running on port " + port)
    }
    else {
        console.log("error :" + error)
    }
})