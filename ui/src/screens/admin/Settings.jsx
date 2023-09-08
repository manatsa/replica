import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {useRef} from "react";
import {getLogin} from "../../auth/check.login";

const Settings = () => {
    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    if(!token || isExpired ){
        navigate("/")
    }else if(!logins?.privileges?.includes('ADMIN') && (!logins['userName']?.toLowerCase()==='super')){
        showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
        window.history.back();
    }


    return(
        <>
            <Toast ref={toast} position={'center'} />
            <div>Settings</div>
        </>
    )

}

export default  Settings;