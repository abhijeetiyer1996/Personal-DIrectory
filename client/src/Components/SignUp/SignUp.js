import classes from "./SignUp.module.css";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import Error from "../Error/Error";
import { VscDebugConsole } from "react-icons/vsc";

const axios = require('axios')
const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });
    const [errorMessage, setErrorMessage] = useState([]);
    const {name, email, password, password2} = formData;
    const getData = (e) => setFormData({...formData, [e.target.name]:e.target.value});

    const submitData = async(e) => {
        e.preventDefault();
        if(password !== password2)
            alert("password not matching");
        else{
            const user = {
                name,
                email,
                password
            };
            try{
                const config = {
                    headers:{
                        'Content-Type':'application/json',
                    }
                };
                const body = JSON.stringify(user);
                const res = await axios.post('/register', body, config);
                // console.log(res.data.errors)
                if(res.data.errors.length === 0){
                    console.log("registered successfully")
                    return navigate('/login')
                }else{
                    res.data.errors.forEach((err)=>{
                        setErrorMessage(errorMessage => [...errorMessage,err.msg]);
                    })
                    setTimeout(()=>{
                        setErrorMessage([]);
                    }, 5000)
                }
            }
            catch(err){
                setErrorMessage(err);
            }
        }

    } 
    
    return <div>
            { 
                (errorMessage.length!==0) ? errorMessage.map((msg,index)=>{return <Error key={index} message={msg}/>}) :""
             
            }
            <div className={classes.form}>
                <h1 className={classes.header}>Sign Up</h1>
                <form onSubmit={e=>submitData(e)}>
                    <div className={classes.formControl}>
                        <label className={classes.label}>Name :</label>
                        <input className={classes.input} type="text" placeholder="Name" value={name} onChange={(e)=>getData(e)} name="name" required></input>
                    </div>
                    <div className={classes.formControl}>
                        <label className={classes.label}>Email id :</label>
                        <input className={classes.input} type="text" placeholder="Email Id" value={email} onChange={(e)=>getData(e)} name="email" required></input>
                    </div>
                    <div className={classes.formControl}>
                        <label className={classes.label}>Password :</label>
                        <input className={classes.input} type="password" placeholder="Password" value={password} onChange={(e)=>getData(e)} name="password" required></input>
                    </div>
                    <div className={classes.formControl}>
                        <label className={classes.label}>Password :</label>
                        <input className={classes.input} type="password" placeholder="Confirm Password" value={password2} onChange={(e)=>getData(e)} name="password2" required></input>
                    </div>
                    <div className={classes.btnGroup}>
                        <input type="submit"  className={classes.btn} value="Sign Up"/>
                        <span className={classes.message}>Already have an account ?</span>
                        <Link to="/login" type="button" className={classes.btn}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
}
export default SignUp;