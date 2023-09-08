import React, {createRef, useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import { Button } from 'primereact/button';
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login";
import {Tag} from "primereact/tag";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {SpeedDial} from "primereact/speeddial";
import {Fieldset} from "primereact/fieldset";
import {OverlayPanel} from "primereact/overlaypanel";
import Box from "@mui/material/Box";
import {ScrollPanel} from "primereact/scrollpanel";
import EditProfessionalDialog from "../professional/edit.professional.dialog.jsx";
import {otherColor, PrimaryColor, SecondaryColor} from "../../components/Constants.jsx";
import './professional.css';
import {Message} from "primereact/message";
import {Tooltip} from "primereact/tooltip";


const Product =  () => {

    const {token, login}=getLogin();
    const toast= useRef(null);
    const [openNewProfessionalDialog, setOpenNewProfessionalDialog] = useState(false);
    const [openViewProfessionalDialog, setOpenViewProfessionalDialog] = useState(false);
    const [professionals, setProfessionals] = useState();
    const [filteredProfessionals, setFilteredProfessionals]=useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [rows, setRows] = useState(6);
    const [searchValue, setSearchValue] = useState('');
    const [showMessage, setShowMessage] = useState(true);

    const professionalDataOverlayRef=createRef();

    const [selectedCategories, setCategories] = useState([])

    const professionalLocation = useLocation();
    const paramArr = professionalLocation['search']?.split('?');
    let professionalRefreshParam=null;
    if(paramArr && paramArr?.length>0){
        professionalRefreshParam=paramArr[1]?.split('=')[1];
    }

    let {data, error, isError, isLoading }=doFetch('/api/professionals/',token,['get',professionalRefreshParam,'professional']);
    let industryMutation =doFetch('/api/industry/',token,['get','industry']);
    let categoryMutation =doFetch('/api/category/',token,['get','category']);


    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    let subscriptionMutation =doFetch(`/api/subscriptions/active/${logins?.id?logins?.id:'x'}`,token,['get',logins?.id,'subscription']);
    let subsMutation =doFetch(`/api/subscriptions/active/all`,token,['get','active','subscription']);


    useEffect(()=>{
        if(token && logins && logins?.userName?.length>0  && subscriptionMutation?.data?.length>0){
            setShowMessage(false)
        }else if(((token && logins?.userName?.length>0)  && (subscriptionMutation?.data?.length <= 0) && !logins?.roles?.includes('ADMIN'))){
            setShowMessage(true)
        }else{
            setShowMessage(false)
        }
    },[subscriptionMutation?.data])

    useEffect(()=>{
        let profs=data?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name,industry:d?.category?.industry?.name};
        })


        let paidUps=profs?.filter(p=>{
            if(p?.administrator) {
                return subsMutation?.data?.map(sub => sub?.subscriber?.id)?.includes(p?.administrator?.id);
            }else{
                return
            }
        })

        if(logins?.roles?.includes('ADMIN')){
            setFilteredProfessionals(profs);
        }else{
            setFilteredProfessionals(paidUps);
        }
        setProfessionals(data)

    },[])


    const viewProfessional = () => {
        setOpenViewProfessionalDialog(true)
    };

    const editProfessional = () => {
        setOpenNewProfessionalDialog(true)
    };

    const deleteProfessional = () => {
        toast.current.show({ severity: 'info', summary: 'professional deleted', detail: selectedProfessional.name });
    };

    const openNew=()=>{
        setOpenNewProfessionalDialog(true);
    }

    const professionalRefresh=(data)=>{
        let profs=data?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name, industry:d?.category?.name};
        })

        let paidUps=profs?.filter(p=>{
            if(p?.administrator) {
                return subsMutation?.data?.map(sub => sub?.subscriber?.id)?.includes(p?.administrator?.id);
            }else{
                return
            }
        })
        if(logins?.roles?.includes('ADMIN')){
            setFilteredProfessionals(profs);
        }else{
            setFilteredProfessionals(paidUps);
        }
        setProfessionals(data)
    }

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }

    const professionalListItems = (professional) => {

        const op = createRef();
        const isProductAdmin= ((logins!==null) && ((professional?.owner?.userName?.toLowerCase()===logins?.userName?.toLowerCase()) || logins?.roles?.includes('ADMIN')));


        const professionalHeader=(
            <div className={'flex flex-row surface-200 border-round border-0 p-2'}
                 onClick={e=>{
                     setSelectedProfessional(professional);
                     viewProfessional();
                 }} style={{cursor:"pointer"}}>
                <i className="pi pi-calculator p-1" style={{ color: 'forestgreen' }}></i>
                <div className="text-2xl font-bold p-1 text-green-800">{professional?.title+' '+professional.firstName+' '+professional?.lastName}</div>

            </div>
        )

        return (
            <div className="col-12 my-3" key={professional?.id} >
                <Fieldset legend={professionalHeader} style={{width:'100%'}}>
                    <div className="flex col-12 flex-row sx:flex-column justify-content-between " >
                        <img className="w-4 shadow-2 border-round col-12 h-14rem" alt={professional.name}
                             src={`data:image/bmp;base64,${professional?.picture}`} onClick={e=>op?.current?.toggle(e)}
                        />
                        <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                <p className="text-sm font-italic text-blue-600">{professional.address}</p>
                                {professional?.address2 && <p className="text-sm font-italic text-blue-600">{professional.address}</p>}
                                <p className="text-sm font-italic text-blue-600">{'Mobile Numbers: '+professional.phone}{professional?.phone2 && ','+professional?.phone2}</p>
                                <p className="text-sm font-italic text-blue-600">Tel: {professional?.tel}</p>
                                <div className={'col-12 flex flex-row'}>
                                    {
                                        professional.tags?.split(',').map(tag=>{
                                            return(
                                                <Tag className={'m-1'} key={`tag-list-${tag}`} value={tag} style={{backgroundColor: SecondaryColor}}></Tag>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{professional.category}{isProductAdmin & <a href={'#'}>{professional?.administrator?.name}</a> }</span>
                                </span>
                                </div>
                            </div>
                            <div className="flex flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <div className="flex flex-1 flex-column md:flex-row p-5 gap-5">
                                    <Button  tooltip={'View professional details'} className=" p-button-rounded" style={{backgroundColor:PrimaryColor}} icon={'pi pi-arrows-alt'}
                                            onClick={e => {
                                                setSelectedProfessional(professional);
                                                viewProfessional();
                                            }} />
                                    {isProductAdmin && <Button icon="pi pi-pencil p-4" className="p-button-rounded"
                                                               onClick={event => {
                                                                   setSelectedProfessional(professional);
                                                                   editProfessional();
                                                               }} style={{backgroundColor: SecondaryColor}} /> }
                                    <Button tooltip={'Add to shopping basket'} icon="pi pi-shopping-cart" className="p-button-rounded" severity={'success'}></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <OverlayPanel ref={op}>
                    <img className="w-full shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${professional?.picture}`} alt={professional.name} />
                </OverlayPanel>
            </div>
        );
    };

    const professionalGridItems = (professional) => {
        const op = createRef();

        const isProductAdmin=(logins?.roles?.includes('ADMIN'));

        const items =
            [
            {
                label: 'Edit Product',
                icon: 'pi pi-pencil',
                classname: 'secondary',
                command: () => {
                    setSelectedProfessional(professional);
                    editProfessional()
                }
            },
            {
                label: 'Deactivate Product',
                icon: 'pi pi-times',
                classname: 'danger',
                command: () => {
                    setSelectedProfessional(professional);
                    deleteProfessional()
                }
            },
            {
                label: 'View Product',
                icon: 'pi pi-arrows-alt',
                command: () => {
                    setSelectedProfessional(professional);
                    viewProfessional()
                }
            }
        ];

        const professionalHeader= (
                <div className={'flex flex-row surface-200 border-round border-0 p-1'}
                     onClick={e=>{
                         setSelectedProfessional(professional);
                         viewProfessional();
                     }} style={{cursor:"pointer"}}>
                    <i className="pi pi-calculator p-1" style={{ color: 'forestgreen' }}></i>
                    <div className="text-2xl font-bold p-1 text-green-800">{professional?.title+' '+professional.firstName+' '+professional?.lastName}</div>

                </div>
        )
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 my-3" key={professional?.id} >
                <Fieldset className="p-1 border-2 surface-border surface-card border-round" legend={professionalHeader}>
                    <p className="text-sm font-italic text-blue-500">{professional.address}</p>
                    {professional?.address2 && <p className="text-sm font-italic text-blue-600">{professional.address}</p>}
                    <p className="text-sm font-italic text-blue-500">{'Mobile Numbers: '+professional.phone}{professional?.phone2 && ','+professional?.phone2}</p>
                    <p className="text-sm font-italic text-blue-400"><a target={'_blank'} href={`mailto:${professional?.email}`}> Email: {professional?.email}</a></p>
                    <p className="text-sm font-italic text-blue-500">Tel: {professional?.tel}</p>
                    <div className="flex flex-column align-items-center">
                        <img className="w-11 shadow-2 border-round col-12 h-16rem" alt={professional.lastName}
                             src={`data:image/bmp;base64,${professional?.picture}`} onClick={e=>op?.current?.toggle(e)}
                        />

                        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div>
                                <span className="font-bold text-2xl p-1">{professional?.industry}</span>
                                <div className="flex flex-row">
                                    <i className={'pi pi-tag p-1'} style={{color:'forestgreen'}} />
                                    <span className="font-semibold p-1">{professional.category}</span>
                                </div>
                            </div>

                        </div>
                        <div className={'col-12 flex flex-row'}>
                            {
                                professional.tags?.split(',').map(tag=>{
                                    return(
                                        <div className="flex flex-row">
                                            <Tag className={'m-1'} key={`tag-grid-${tag}`} value={tag} style={{backgroundColor: SecondaryColor}}></Tag>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <OverlayPanel ref={op}>
                        <img className="w-full shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${professional?.picture}`} alt={professional.name} />
                    </OverlayPanel>


                        <div style={{position: 'relative'}} className={'mt-2 flex flex-row justify-content-around align-items-end'}>

                            <Button tooltip={'View professional details'} style={{backgroundColor: PrimaryColor}} icon="pi pi-arrows-alt" className="p-button-rounded" onClick={()=>{
                                setSelectedProfessional(professional);
                                setOpenViewProfessionalDialog(true)
                            }} severity={'info'}></Button>

                            <div className={'flex flex-row pr-5 justify-content-center '} style={{position: 'relative'}}>
                                {isProductAdmin &&
                                    <SpeedDial model={items} key={'speedBtn' + professional?.name} direction="up"
                                               style={{right: 0, bottom: 0, padding: 0, margin: 0}}
                                               buttonClassName=".speeddial-bottom-right p-button-outlined p-speed-button" showIcon="pi pi-ellipsis-v"
                                               hideIcon="pi pi-times"/>
                                }
                            </div>

                            <Button tooltip={'Add to shopping basket'} icon="pi pi-shopping-cart" className="p-button-rounded p-button-outlined cart" severity={'success'}></Button>
                    </div>

                </Fieldset>

            </div>
        );
    };

    const itemTemplate = (professional, layout) => {
        if (!professional) {
            return;
        }

        if (layout === 'list'){
            setRows(4);
            return professionalListItems(professional);
        }
        else if (layout === 'grid') {
            setRows(6)
            return professionalGridItems(professional);
        }
    };

    const itemSearch=(value)=>{

        setSearchValue(value)
        if(value && value!='') {
            let filteredProfessionalz = filteredProfessionals.filter(
                p => p?.firstName?.toLowerCase()?.includes(value?.toLowerCase()) || p?.lastName?.toLowerCase()?.includes(value?.toLowerCase()) ||
                    p?.description?.toLowerCase()?.includes(value?.toLowerCase()) || p?.tags?.toLowerCase()?.includes(value?.toLowerCase()) ||
                    p?.title?.toLowerCase()?.includes(value?.toLowerCase()) || p?.qualifications?.toLowerCase()?.includes(value?.toLowerCase()) ||
                    p?.category?.name?.toLowerCase()?.includes(value?.toLowerCase()) || p?.category?.industry?.name?.toLowerCase()?.includes(value?.toLowerCase())
            )
            setFilteredProfessionals(filteredProfessionalz);

        }else{
            setFilteredProfessionals(filteredProfessionals)
        }

    }

    const professionalHeader = () => {
        return (
            <div  >
                <Box sx={{mt:11}} className={'xl:hidden lg:hidden md:hidden'}></Box>
                <div className="flex flex-grow-1 justify-content-around my-0 ">
                    <div className="flex flex-wrap gap-1 md:gap-8">
                        {logins && token && <Button label="" rounded icon="pi pi-plus" style={{backgroundColor: SecondaryColor}} onClick={openNew}/>}
                        <span className="p-input-icon-right">
                            <InputText  value={searchValue} onChange={event => {
                                itemSearch(event.target.value);
                            }} placeholder="Keyword Search" variant={'standard'} className="p-inputtext-sm"/>
                        </span>
                    </div>
                    <div className={'flex flex-row justify-content-around'}>
                        <DataViewLayoutOptions className={'p-2'} layout={layout}  onChange={(e) => {
                            const lay=e.value;
                            if(lay==='grid'){
                                setRows(6)
                            }else{
                                setRows(3)
                            }
                            setLayout(e.value)
                        }} />
                    </div>
                </div>

            </div>
        );
    };

    const onSelectIndustry=(e,industry)=>{
        let cats=categoryMutation?.data?.filter(c=>{
            return c?.industry?.id===industry?.id
        })
        if(cats?.length>0){
            setCategories(cats);
            professionalDataOverlayRef?.current?.toggle(e);
        }else{
            setCategories([])
        }
    }

    const onSelectCategory=(e,category)=>{
        let profList=data?.filter(p=>{
            return p?.category?.id===category?.id
        })
        let profs=profList?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name,industry:d?.category?.industry?.name};
        })
        setFilteredProfessionals(profs);
        professionalDataOverlayRef?.current?.toggle(e);

    }

    const subscriptionInactiveMessageContent = (<div className="flex align-items-center justify-content-evenly flex-auto " style={{backgroundColor:'transparent'}}>
            <div className="ml-2 flex flex-auto text-red-600 " >
                Please note that you have no active subscription. Please reach out to admin to renew your subscription.
            </div>
            <Button onClick={()=>setShowMessage(false)} icon={'pi pi-times'} rounded={true} raised={true} outlined={true}/>
        </div>
    );

    return (
        <>
            <Toast ref={toast} position={'center'} />
            <Tooltip target=".speeddial-bottom-right .p-speeddial-action" position="left" />
            {isLoading && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}


            {showMessage &&
                <div className="card">
                    <Message
                        style={{ border: `solid ${SecondaryColor}`,borderWidth: '0.1px 0.1px 0.1px 10px'}}
                        className="border w-full justify-content-start shadow-8 "
                        title={'Subscription Expired'}
                        severity="warn"
                        content={subscriptionInactiveMessageContent}
                    />
                </div>
            }

            <div className="grid">
                <div className="col col-12">

                    <div className="card flex flex-row">
                        <div className="col-5 md:col-2 pt-5">
                            <div className="flex-auto">
                                <ScrollPanel style={{ width: '100%', maxHeight:800 }} className="custom-scrollbar h-screen">
                                    <div className="card flex flex-column">
                                        {
                                            industryMutation?.data?.map(industry=>{
                                                return <div className={'col-12'}><Button className="col-12 text-sm" style={{backgroundColor:otherColor}}  label={industry?.name} onClick={() => {

                                                    let profs=professionals?.map(d=>{
                                                        return {...d,userName:d?.createdBy?.userName,category:d?.category?.name,industry:d?.category?.industry?.name};
                                                    })
                                                    let paidUps = profs?.filter(p => {
                                                        if (p?.administrator) {
                                                            return subsMutation?.data?.map(sub => sub?.subscriber?.id)?.includes(p?.administrator?.id);
                                                        } else {
                                                            return
                                                        }
                                                    })


                                                    if (logins?.roles?.includes('ADMIN') || !logins) {
                                                        let filteredProfs = profs?.filter(p => {
                                                            return p?.industry?.toLowerCase() === industry?.name?.toLowerCase();
                                                        })

                                                        setFilteredProfessionals(filteredProfs);
                                                    } else {
                                                        let filteredPaidUps = paidUps?.filter(p => {
                                                            return p?.industry?.toLowerCase() === industry?.name?.toLowerCase();
                                                        })
                                                        setFilteredProfessionals(filteredPaidUps);
                                                    }
                                                }
                                                }

                                                onMouseEnter={(e) =>onSelectIndustry(e,industry)} /></div>
                                            })
                                        }
                                    </div>
                                </ScrollPanel>
                            </div>
                        </div>

                        <div className={'col-7   md:col-10'}>
                            <DataView  value={filteredProfessionals} itemTemplate={itemTemplate} layout={layout} header={professionalHeader()} rows={rows} paginator={true}  />
                        </div>
                    </div>
                    <OverlayPanel ref={professionalDataOverlayRef} showCloseIcon={true} draggable={true} className={"flex flex-auto"}>
                        <div className="grid flex justify-content-between">
                            {
                                selectedCategories?.map(cat=>{
                                    return <div className={'col-6'}><Button label={cat?.name} text={true} onClick={e => onSelectCategory(e,cat)} className={"p-2"} /> </div>
                                })
                            }
                        </div>
                    </OverlayPanel>

                </div>
            </div>



            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:'dodgerblue', paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h3" color={'green'}>
                        {selectedProfessional && selectedProfessional?.id ? selectedProfessional?.name:"New Professional"}
                    </Typography>
                </div>
            }} visible={openNewProfessionalDialog} style={{ width: '60vw' }} sx={{width:'100%'}} onHide={() => setOpenNewProfessionalDialog(false)}>

                <EditProfessionalDialog
                    token={token}
                    refreshProfessionals={professionalRefresh}
                    selectedProfessional={selectedProfessional}
                    showErrorFeedback={showErrorFeedback}
                    showSuccessFeedback={showSuccessFeedback}
                    setOpenNewProfessionalDialog={setOpenNewProfessionalDialog}
                />


            </Dialog>

            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h4" color={'green'}>
                        {'VIEW PROFESSIONAL :: '+selectedProfessional?.firstName+ ' - '+selectedProfessional?.lastName}
                    </Typography>
                </div>
            }} visible={openViewProfessionalDialog} style={{ width: '75vw' }} onHide={() => setOpenViewProfessionalDialog(false)}>
                <div className={'flex sx:flex-column md:justify-content-between col-12'}>
                    <div className="col-6">
                        <img className="w-9 shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${selectedProfessional?.picture}`} alt={selectedProfessional?.name} />
                    </div>
                    <div className="col-6 surface-100">
                        <div className="grid col-8">
                            <div className="col-6 sm:col-6">Title</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.title}</div>

                            <div className="col-6 sm:col-6">First Name</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.firstName}</div>

                            <div className="col-6 sm:col-6">Last Name</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.lastName}</div>

                            <div className="col-6 sm:col-6">Active</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.active?.toString()}</div>

                            <div className="col-6 sm:col-6">Address</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.address}</div>

                            <div className="col-6 sm:col-6">Address 2</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.address2}</div>

                            <div className="col-6 sm:col-6">Mobile Number</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.phone}</div>

                            <div className="col-6 sm:col-6">Mobile Number 2</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.phone2}</div>

                            <div className="col-6 sm:col-6">Email Address</div>
                            <div className="col-6 sm:col-6"><a target={'_blank'} href={`mailto:${selectedProfessional?.email}`}>{selectedProfessional?.email}</a></div>

                            <div className="col-6 sm:col-6">Qualifications</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.qualifications}</div>

                            <div className="col-6 sm:col-6">Experience</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.experience}</div>

                            <div className="col-6 sm:col-6">Category</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.category}</div>

                            <div className="col-6 sm:col-6">Industry</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.industry}</div>

                            <div className="col-6 sm:col-6">Created By</div>
                            <div className="col-6 sm:col-6">{selectedProfessional?.createdBy?.userName?.toString()}</div>
                        </div>
                    </div>

                </div>
            </Dialog>

        </>
    )
}



export default Product;
