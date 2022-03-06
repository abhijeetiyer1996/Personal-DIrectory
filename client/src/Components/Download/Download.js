import {useState} from 'react';
import classes from "./Download.module.css";
import {VscClose} from "react-icons/vsc";

import axios from "axios"
const Download = ({userId,file,display}) =>{

    // console.log(file)
    const [fileCode, setFileCode] = useState("");
    const [disable, setDisable] = useState("disabled");
    const downloadFile = async()=>{
        const res = await axios.get(`/uploads/${userId}/${file.fileName}`,{responseType: 'blob'})
        const url = await window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.fileName);
        document.body.appendChild(link);
        link.click();   
    }
    const checkDisable=(e)=>{

        e.preventDefault(e);
        if(file.fileId === e.target.value)
        { 
            setDisable(null)
            setFileCode(e.target.value);
        }
        else{
            
            setDisable("disabled");
        }
    }
    return (<div className={classes.container}>
                <div className={classes.header}>
                    <a className={classes.closeBtn} onClick={display}><VscClose /></a>    
                    <div className={classes.title}>Download File </div>
                </div>
                <div className={classes.bodyContainer}>
                    <div className={classes.confirm}>
                        <label>Enter the file code to Confirm Download ({file.fileId})</label>
                        <input type="text" placeholder="File Code" vlaue={fileCode} onChange={(e)=>checkDisable(e)}/>
                        <button className={classes.btn} onClick={(e)=>downloadFile(e)} disabled={disable}>Confirm</button>
                    </div>
                </div>
                
            </div>)
}
export default Download; 