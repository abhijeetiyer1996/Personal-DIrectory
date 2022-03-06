import classes from "./Error.module.css";

const Error = ({message}) =>{
    return( <div className={classes.warning}>
                <div className={classes.message}>{message}</div>
            </div>)
}
export default Error;