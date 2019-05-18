const express=require('express');
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.urlencoded({extended:false}));
const {saveClient,saveUser,getClients,singleClient}=require('./db/model');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

require('dotenv').config();
const port=process.env.PORT;

app.post('/api/clientForm',saveClient);
app.post('/api/userForm',saveUser);
app.get('/api/clients',getClients);
app.get('/api/singleClient/:id',singleClient);

app.listen(port,()=>{
    console.log("Inintialized");
})
