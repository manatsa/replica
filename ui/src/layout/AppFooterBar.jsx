import React from 'react';
import {Menubar} from "primereact/menubar";
import {useNavigate} from "react-router-dom";
import Logo from '../assets/logo.png';
import {PrimaryColor} from "../components/Constants.jsx";
import  './app.menu.css';

const AppFooterBar = () =>{
const navigate=useNavigate();
const endContent = <>
            <a href={'#'} onClick={()=>navigate("/")}>
                <img alt="logo" src={Logo} height="40" className="mr-2" onClick={()=>navigate("/home")} />
            </a>
            <i className="pi  p-menu-separator mr-2" style={{width:'3vw'}} />
        </>
    const start=<>
        <div className={'gap-6'}><a target={'_blank'} href={'mailto:manatsachinyeruse@gmail.com'}>Powered By @mana</a></div>
        <small >Copyright &copy; 2023. All rights reserved. </small>
    </>



return (
    <div className="card col-12" style={{width:'100%'}}>
        <Menubar  start={start}  end={endContent} style={{border:`0.1px 0.1px solid ${PrimaryColor}`, color: PrimaryColor, margin:'2%'}} />
    </div>
)
}

export default AppFooterBar;


