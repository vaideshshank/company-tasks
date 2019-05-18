const mongoose=require('mongoose');
var {connect,clientModel,userModel,taskModel}=require('./schema');
connect();
clientModel=clientModel();userModel=userModel();taskModel=taskModel();

var saveClient=(req,res)=>{
    var {name,email,phone,address,profession,image}=req.body;
    console.log({name,email,phone,address,profession,image});
    var client=new clientModel({name,email,phone,address,profession,image})
    client.save().then(()=>{
        console.log('CLIENT information saved');
        res.status(200).json({message:"CLIENT information saved"});
    }).catch(err=>{
        console.log(err);
        res.status(400).json({message:"CLIENT info not saved. Server failure."});
    })
}

var saveUser=(req,res)=>{
    var {name,username,password,email}=req.body;
    var user=new userModel({name,email,username,password})
    user.save().then(()=>{
        console.log('USER information saved');
        return user.generateAuthToken();
    }).then(token=>{
        res.status(200).header('x-auth',token).json({message:'USER information saved'});
    })
    .catch(err=>{
        console.log(err);
        res.status(400).json({message:"USER info not saved. Server failure."});
    })
}

var getClients=(req,res)=>{
    clientModel.find({},"_id name email").then((data)=>{
        res.status(200).json(data);
    })
}

var singleClient=(req,res)=>{
    var {id}=req.params;
    clientModel.findOne({_id:id}).then(data=>{
        res.status(200).json(data);
    })
}

module.exports={saveClient,saveUser,getClients,singleClient};