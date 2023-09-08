import React from 'react';
import AppMenu from "./AppMenu";
import Box from "@mui/material/Box";
import AppFooterBar from "./AppFooterBar.jsx";

const Layout =({children})=>{

    return (
           <>
               <div style={{width:'100%'}} className={'grid flex justify-content-center align-items-start'}>
                   <div className={'col-12 flex justify-content-center'}>
                        <AppMenu />
                   </div>
                   <div style={{width:'100%'}} className={'flex justify-content-center align-self-start align-items-start'} >
                       <div className={'w-full align-items-start'}>
                           {children}
                       </div>
                   </div>
                   <div className={'col-12 flex justify-content-center'}>
                       <AppFooterBar />
                   </div>
               </div>

           </>

    )
}

export default Layout;