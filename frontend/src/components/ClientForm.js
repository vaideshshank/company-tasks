import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

export default class ClientForm extends Component {
    constructor(props){
        super(props);
    }
    state={
        imgPath:"/../../images/placeholder.jpg",
        backendImgPath:null
    }
    submit=()=>{
        var name=document.getElementsByClassName('name')[0].value,
            email=document.getElementsByClassName('email')[0].value,
            phone=document.getElementsByClassName('mobile')[0].value,
            address=document.getElementsByClassName('address')[0].value,
            profession=document.getElementsByClassName('profession')[0].value,
            image=this.state.backendImgPath;
            console.log(image)
        console.log({name,email,phone,address,profession})
        axios.post(process.env.REACT_APP_BACKEND+'/clientForm',
                {name,email,phone,profession,image,address},
                {headers:{"x-auth":this.props.token}}
            ).then(({data})=>{
            console.log(JSON.stringify(data,null,2));
            alert(data.message);    
        },err=>{
            console.log(err);
            alert(err.message)
        })
    }
    imageUpload=(e)=>{
        e.preventDefault();
        var fd=new FormData();
        var imgUrl=document.getElementById("imageUpload").files[0];
        fd.append('photo',imgUrl);
        axios.post(process.env.REACT_APP_BACKEND+'/upload',fd,{headers:{'content-type': 'multipart/form-data',}})
        .then(({data})=>{
            alert(data.message);
            console.log(data.path);
            this.setState({...this.state,backendImgPath:data.path})
        }).catch((err)=>{alert("Please provide image with JPEG or PNG format")})
    }
    
    preview=(e)=>{
        var imgPath=window.URL.createObjectURL(e.target.files[0]);
        console.log(imgPath);
        this.setState({...this.state,imgPath})
    }

  render() {
    return (
    <>
      <Jumbotron fluid>
        <Container>
            <h1>Client information form</h1>
            <Form className="text-left">
                <Form.Group>
                    <Form.Label>Client Image</Form.Label> <br/>
                    <img src={this.state.imgPath} alt="Placeholder" style={{width:"85px",height:"100px"}}/>
                    <form onSubmit={this.imageUpload} enctype="multipart/form-data" >
                        <input type="file" accept="image/*" name="photo" id="imageUpload" onChange={this.preview}/><br/>
                        <input type="submit" value="Upload Image" class="btn-sm btn-primary"/><br/>
                    </form>
                </Form.Group>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Full Name" className="w-50 p-3 name"/>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="text" placeholder="name@example.com" className="w-50 p-3 email" />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPhone">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control type="text" placeholder="ex. +91 9999999999" className="w-50 p-3 mobile" />
                    <Form.Text className="text-muted">
                        Mobile Number format : [Country Calling Code] [10 digit mobile number]
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicAddress">
                    <Form.Label>House Address</Form.Label>
                    <Form.Control type="text" placeholder="Complete house address" className="w-50 p-3 address"/>
                </Form.Group>
                <Form.Group controlId="formBasicProfession">
                    <Form.Label>Profession</Form.Label>
                    <Form.Control type="text" placeholder="ex. Businessman/Freelancer/... " className="w-50 p-3 profession"/>
                </Form.Group>
                
                <Button variant="primary" onClick={this.submit}>Submit</Button>
            </Form>
        </Container>
      </Jumbotron>
      </>
    )
  }
}
