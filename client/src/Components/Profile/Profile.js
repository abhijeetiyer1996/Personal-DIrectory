import classes from "./Profile.module.css";
import  {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {VscTrash,VscCloudDownload,VscFolder} from "react-icons/vsc";
import {RiLogoutCircleLine} from "react-icons/ri"
import axios from 'axios';
import Download from "../Download/Download";
import Error from "../Error/Error";


const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        id:'',
        name:'',
        email:'',
        date:'',
        files:[]
    });
    const [panel, openPanel] = useState(false);
    const [errorMessage, setErrorMessage] = useState([])
    const [currentFile, setCurrentFile] = useState({});
    const checkToken = async() => {
        if(localStorage.getItem('token')){
            const config = {
                headers:{'x-auth-token': localStorage.getItem('token')}
            }
            try{
                const res =  await axios.get('/login',config);
                if(res.data.user){
                    setUserData(res.data.user);
                }
                else 
                    navigate('/login')
                setTimeout(()=>{setErrorMessage([])},5000)
            }
            catch(err){console.log(err)}
                
        }
        else
            navigate('/login');
    }

    useEffect(()=>checkToken(),[]);
    const updateFiles = async(e) =>{
        e.preventDefault();
        const file = e.target.files[0];
        try{
            let body = new FormData();
            body.append('file',file);
            const res = await axios.patch(`/uploads/${userData._id}`, body)
            if(res.data.errors){
                res.data.errors.forEach((err)=>{
                    setErrorMessage([...errorMessage,err]);
                })
            }
            checkToken()
            body = "";
        }
        catch(err){
            setErrorMessage([...errorMessage],err);
        }
    }
    const deleteFile= async(id) =>{
        try{
            const res = await axios.delete(`/uploads/${userData._id}/${id}`);
            if(res.data.errors){
                res.data.errors.forEach((err)=>{
                    setErrorMessage([...errorMessage,err]);
                })
            }
            checkToken();
        }
        catch(err){
            console.log(err)
        }     
    }
    const callPanel=(file)=>{
        setCurrentFile(file);
        openPanel(!panel)
    }

    const logout =() =>{
        localStorage.removeItem("token");
        checkToken();
    }

    return  <div className={classes.form}>
            
            <button className={classes.acBtn} onClick={logout}><RiLogoutCircleLine /></button>
               {
                   (errorMessage.length!==0) ? errorMessage.map((msg)=>{
                    return  <Error message={msg} />
                   }) : "" 
               }
                <h1 className={classes.header}>Hi {userData.name}</h1>
                <div className={classes.container}>
                    <form onSubmit={e=>updateFiles(e)}>
                        <input type="file" className={classes.fileInput} onChange={e=>updateFiles(e)} required/>
                    </form>
                    <div className={classes.wrapper}>
                        {
                            (userData.files.length === 0) ? <div className={classes.fileRow}>No Files Found</div> :
                            (userData.files.map((file)=>{
                                let fileInfo = JSON.parse(file);
                                return  <div key={fileInfo.fileId} className={classes.row}> 
                                            <div  className={classes.control}>
                                                <div className={classes.fileTitle}>
                                                    <span className={classes.fileIcon}><VscFolder /></span>
                                                    <span className={classes.fileName}>/{fileInfo.fileName}</span>
                                                    <span className={classes.code}>(#{fileInfo.fileId})</span>
                                                </div>
                                                <div className={classes.actionBtns}>
                                                    <button className={classes.acBtn} download={fileInfo.path} onClick={()=>callPanel(fileInfo)}><VscCloudDownload /></button>
                                                    <button type="button" className={classes.acBtn} onClick={(e)=>{deleteFile(fileInfo.fileId)}}><VscTrash /></button>
                                                </div>
                                                {(panel)? (<Download userId={userData._id} display={()=>callPanel({})} file={currentFile}/>):""}
                                            </div> 
                                           
                                        </div>
                            }))
                        }
                    </div>
                </div>
            </div>
}
export default Profile;