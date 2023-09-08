import React,  {useState} from 'react';

import {Tab, Tabs} from "@mui/material";
import {SupervisorAccountOutlined, DescriptionOutlined, Work, FlightTakeoff} from '@mui/icons-material';
import TabPanel from "../components/TabPanel.jsx";
import Product from "./product/product.jsx";
import Professional from "./professional/professional.jsx";
import {PrimaryColor, SecondaryColor} from "../components/Constants.jsx";

const Dashboard =  () => {

    const [activeTab, setActiveTab] =useState(0);

    const switchTabs=(tabIndex)=>{
        setActiveTab(tabIndex)
    }

    return (
        <>
            <div className="grid ">
                <div className="col-12 pt-8 md:pt-0 ">
                    <Tabs value={activeTab} centered={true} focusVisibleClassName={'surface-300'}  variant={'fullWidth'} onChange={(e, value)=>switchTabs(value)} className={'my-0'} sx={{mt:11}} scrollButtons={true} >
                        <Tab className={'bor'} label={"Product List"} iconPosition={'start'} icon={<DescriptionOutlined />}  style={{color:SecondaryColor, borderColor:` ${PrimaryColor}`}}/>
                        {/*<Tab label={"Service Industry"} iconPosition={'start'} icon={<FlightTakeoff />}  style={{color:'dodgerblue'}}/>*/}
                        <Tab label={"Professional Services"} iconPosition={'start'} icon={<SupervisorAccountOutlined />} style={{color: SecondaryColor, borderColor:`${PrimaryColor}`}}/>
                        {/*<Tab label={"Employment Section"} iconPosition={'start'} icon={<Work />} style={{color:'dodgerblue'}}/>*/}
                    </Tabs>
                    <TabPanel value={activeTab} index={0}>
                        <div className={'col-12'}>
                            <Product  />
                        </div>
                    </TabPanel>
                    {/*<TabPanel value={activeTab} index={1} >
                        <div className={'col-12'}>
                            Services Industry
                        </div>
                    </TabPanel>*/}
                    <TabPanel value={activeTab} index={1}>
                        <div className={'col-12 '}>
                           <Professional />
                        </div>
                    </TabPanel>
                    {/*<TabPanel value={activeTab} index={3}>
                        <div className={'col-12'}>
                             Jobs
                        </div>
                    </TabPanel>*/}
                </div>
            </div>





        </>
    )
}



export default Dashboard;
