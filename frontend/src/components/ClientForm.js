import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import '../stylesheets/styles.css'
import Spinner from '../images/spinner.gif';
import Button from 'react-bootstrap/Button';

export default class ClientForm extends Component {
    constructor(props){
        super(props);
        if(props.token==""){
            window.location.pathname="";
        }
    }
    
    state={
        imgPath:"/../../images/placeholder.jpg",
        backendImgPath:null,
        spinner:false,
        spinner2:false,
        client:{
            name:"",
            phone:"+91 ",
            email:"",
            address:"",
            profession:""
        }
    }

    preventUpdate=(e)=>{
        //console.log(e.targe);
        if(e.keyCode=='37' && e.target.value.length==4){
            e.preventDefault();
        }
    }

    updateInfo=({target},e)=>{
        if(target.id=="phone"){
            var len=target.value.length;
            if(len<4){
                target.value+=" ";
            }
            if(target.value.substring(0,4)!="+91 "){target.value="+91 ";}
            
            if(target.value[len-1]>='0' && 
            target.value[len-1]<='9' ||
            target.value[len-1]==' ' || 
            target.value[len-1]=='+'){
                //nothing
            }else{
                target.value=target.value.substring(0,len-1);
            }
        }
        this.setState({
            ...this.state,
            client:{
                ...this.state.client,
                [target.id]:target.value
            }
        })
    }
    submit=()=>{
        var image=this.state.backendImgPath;
        this.setState({...this.state,spinner2:true})
        axios.post(process.env.REACT_APP_BACKEND+'/clientForm',
                {...this.state.client,image},
                {headers:{"x-auth":this.props.token}}
            ).then(({data})=>{
            this.setState({...this.state,spinner2:false});
            console.log(JSON.stringify(data,null,2));
            alert(data.message);    
            document.getElementsByClassName('name')[0].value="";
            document.getElementsByClassName('email')[0].value="";
            document.getElementsByClassName('mobile')[0].value="+91 ";
            document.getElementsByClassName('address')[0].value="";
            document.getElementsByClassName('profession')[0].value="";
        },err=>{
            this.setState({...this.state,spinner2:false});
            alert("Provide all the necessary details correctly");
        })
    }
    imageUpload=(e)=>{
        e.preventDefault();
        var fd=new FormData();
        var imgUrl=document.getElementById("imageUpload").files[0];
        fd.append('photo',imgUrl);
        if(imgUrl==undefined){alert("Please provide image with JPEG or PNG format");return;}
        this.setState({...this.state,spinner:true});
        axios.post(process.env.REACT_APP_BACKEND+'/upload',fd,{headers:{'content-type': 'multipart/form-data',}})
        .then(({data})=>{
            this.setState({...this.state,spinner:false});
            alert(data.message);
            console.log(data.path);
            this.setState({...this.state,backendImgPath:data.path})
        }).catch((err)=>{
            this.setState({...this.state,spinner:false});
            alert("Please provide image with JPEG or PNG format")
        })
    }
    
    preview=(e)=>{
        var imgPath=window.URL.createObjectURL(e.target.files[0]);
        console.log(imgPath);
        this.setState({...this.state,imgPath})
    }

  render() {
    return (
    <>
      <Jumbotron fluid style={{width:'80vw',transform:'translateX(20vw)',background:'transparent'}}>
        <Container>
            <h1>Client information form</h1>
            <Form className="text-left">
                <Form.Group>
                    <Form.Label>Client Image</Form.Label> <br/>
                    <img src={this.state.imgPath} alt="Placeholder" style={{width:"85px",height:"100px"}}/>
                    <form onSubmit={this.imageUpload} enctype="multipart/form-data" >
                        <input type="file" accept="image/*" name="photo" id="imageUpload" onChange={this.preview}/><br/>
                        <input type="submit" value="Upload Image" class="btn-sm btn-primary"/>
                        <img src={Spinner} hidden={!this.state.spinner} id="singleclientSpinner"/><br/>
                    </form>
                </Form.Group>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required="true" type="text" placeholder="Full Name" className="w-50 p-3 name"
                    controlId="formBasicName" value={this.state.client.name} id="name" onChange={this.updateInfo}/>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control controlId="formBasicEmail" required="true" type="text" placeholder="name@example.com" className="w-50 p-3 email" 
                    value={this.state.client.email} id="email" onChange={this.updateInfo}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPhone">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control required="true" type="text" maxLength="14" placeholder="ex. +91 9999999999" className="w-50 p-3 mobile" 
                    controlId="formBasicPhone" value={this.state.client.phone} id="phone" onKeyDown={this.preventUpdate} onChange={(e)=>{this.updateInfo(e,e)}}/>
                    <Form.Text className="text-muted">
                        Mobile Number format : [Country Calling Code] [10 digit mobile number]
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicAddress">
                    <Form.Label>House Address</Form.Label>
                    <Form.Control required="true" type="text" placeholder="Complete house address" className="w-50 p-3 address"
                    controlId="formBasicAddress" value={this.state.client.address} id="address" onChange={this.updateInfo}/>
                </Form.Group>
                <Form.Group controlId="formBasicProfession">
                    <Form.Label>Profession</Form.Label>
                    <Form.Control required="true" type="text" placeholder="ex. Businessman/Freelancer/... " className="w-50 p-3 profession"
                    controlId="formBasicProfession" value={this.state.client.profession} id="profession" onChange={this.updateInfo}/>
                </Form.Group>
                
                <Button variant="primary" onClick={this.submit}>Submit</Button>
                <img src={Spinner} hidden={!this.state.spinner2} id="singleclientSpinner"/>
            </Form>
        </Container>
      </Jumbotron>
      </>
    )
  }
}
