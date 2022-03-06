import classes from "./Login.module.css";
import  {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import axios from 'axios';
import Error from "../Error/Error";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email:'',
        password:''
    });
    const [errorMessage, setErrorMessage] = useState([]);
    const {email, password} = formData;
    const getData = (e) => setFormData({...formData, [e.target.name]:e.target.value})
    const submitData = async(e) => {
        e.preventDefault();
            const user = {
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
                    const res = await axios.post('/login', body, config);
                    // console.log(res);
                    if(res.data.token){
                        setFormData({email:'',password:''})
                        localStorage.setItem("token", res.data.token);
                        navigate('/profile');
                    }
                    else{
                        if(res.data.errors.length !== 0){
                            res.data.errors.forEach((err)=>{
                                setErrorMessage([...errorMessage, err.msg])
                            });
                            setTimeout(()=>{setErrorMessage([])},5000)
                        }
                    }
            }
            catch(err){
                setErrorMessage([...errorMessage, err.msg])
            }
        } 
    return  <div>
                {(errorMessage.length !== 0) ? errorMessage.map((msg,index)=>{return <Error message={msg} key={index}/>}):""}
                <div className={classes.form}>
                    <h1 className={classes.header}>LOGIN</h1>
                    <form onSubmit={e =>submitData(e)}>
                        <div className={classes.formControl}>
                            <label className={classes.label}>Email Id: </label>
                            <input className={classes.input} type="text" placeholder="Email Id" value={email} onChange={(e)=>getData(e)} name="email" required></input>
                        </div>
                        <div className={classes.formControl}>
                            <label className={classes.label} email="password">Password: </label>
                            <input className={classes.input} type="password" placeholder="Password" value={password} onChange={(e)=>getData(e)} name="password" required></input>
                        </div>
                        <div className={classes.btnGroup}>
                            <input type="submit" className={classes.btn} value="Login"/>
                            <span className={classes.message}>Don't have an account ?</span>
                            <Link to="/signup" type="button" className={classes.btn}>Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>

}
export default Login;