import React, {createRef, useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import { Button } from 'primereact/button';
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Fab, Typography} from "@mui/material";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login";
import EditProductDialog from "./edit.product.dialog.jsx";
import {Tag} from "primereact/tag";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {SpeedDial} from "primereact/speeddial";
import {Fieldset} from "primereact/fieldset";
import {OverlayPanel} from "primereact/overlaypanel";
import Box from "@mui/material/Box";
import {ScrollPanel} from "primereact/scrollpanel";
import './product.css';
import {otherColor, PrimaryColor, SecondaryColor} from "../../components/Constants.jsx";
import {Message} from "primereact/message";
import {Tooltip} from "primereact/tooltip";
import {classNames} from "primereact/utils";
import {Badge} from "primereact/badge";
import {Accordion, AccordionTab} from "primereact/accordion";
import * as yup from "yup";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import CustomerStep1 from "../customer/customerStep1.jsx";
import CustomerStep2 from "../customer/customerStep2.jsx";
import CustomerStep3 from "../customer/customerStep3.jsx";
import MultiStepForm from "../../components/MultiStepForm.jsx";
import {PaynowPayment} from "paynow-react/src";


const Product =  () => {

    const {token, login}=getLogin();
    const toast= useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openNewProductDialog, setOpenNewProductDialog] = useState(false);
    const [openViewProductDialog, setOpenViewProductDialog] = useState(false);
    const [products, setProducts]=useState([]);
    const [filteredProducts, setFilteredProducts]=useState([]);
    const [layout, setLayout] = useState('grid');
    const [rows, setRows] = useState(6);
    const [searchValue, setSearchValue] = useState('');
    const [showMessage, setShowMessage] = useState(true);
    const [showQuantity, setShowQuantity] = useState(false);
    const [quantity, setQuantity] = useState('')
    const [showCartItems, setShowCartItems] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [getUserInfo, setGetUserInfo] = useState(false);
    const [mergedValues, setMergedValues] = useState({});
    const [ paid, setPaid] = useState(false);


    const productDataOverlayRef=createRef();
    const [selectedCategories, setCategories] = useState([])
    const [cartItems, setCartItems] = useState([]);

    const productLocation = useLocation();
    const paramArr = productLocation['search']?.split('?');
    let productRefreshParam=null;
    if(paramArr && paramArr?.length>0){
        productRefreshParam=paramArr[1]?.split('=')[1];
    }

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    const customerInitialValues=[
        {
            title: '',
            firstName: '',
            lastName: '',
        },
        {
            address: '',
            address2: '',
            email: '',
            phone: '',
            phone2: '',
        },
        {
            deliver:'Yes',
            register: 'Yes',
            deliveryDate: null,
            payment: false,
        }
    ]

    const customerValidationSchema=[
            yup.object().shape({
                title: yup.string().required("Please select your title."),
                firstName: yup.string().required("Please enter your first name."),
                lastName: yup.string().required("Please enter your last name."),
            }),
        yup.object().shape({
            address: yup.string().required("Please enter your residential address"),
            address2: yup.string(),
            email: yup.string().email().optional(),
            phone: yup.string().required("Please enter your mobile number."),
        }),
        yup.object().shape({
            deliver: yup.string().optional(),
            register: yup.string().optional(),
            deliveryDate: yup.date().optional().typeError('Please input a valid date'),
            payment: yup.boolean().optional()
        })
        ]

    const customerStepLabels=[
        {label:'General Info'},
        {label:'Contact Info'},
        {label:'Other Info'}
    ]

    let {data, error, isError, isLoading }=doFetch('/api/products/',token,['get',productRefreshParam,'product']);
    let industryMutation =doFetch('/api/industry/',token,['get','industry']);
    let categoryMutation =doFetch('/api/category/',token,['get','category']);
    let subscriptionMutation =doFetch(`/api/subscriptions/active/${logins?.id?logins?.id:'x'}`,token,['get',logins?.id,'subscription']);
    let subsMutation =doFetch(`/api/subscriptions/active/all`,token,['get','active','subscription']);

    const customerMutation=useMutation({
        mutationFn: data=>doUpdate('api/customers/',token, data?.id, data?.info),
        onError: error => showErrorFeedback(error),
        onSuccess: (data, variables, context) => {

            showSuccessFeedback();
            setIsSaving(false)
            setShowCartItems(false);
            setGetUserInfo(false);
            setCartItems([])
        }
    })


    const customerSteps=[ CustomerStep1, CustomerStep2, CustomerStep3 ]

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
        let prods=data?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name, owner:d?.owner?.userName, industry:d?.category?.industry?.name, ownerName: d?.owner?.firstName+' '+d?.owner?.lastName};
        })

        let paidUps=prods?.filter(p=>{
            if(p?.owner) {
                return subsMutation?.data?.map(sub => sub?.subscriber?.userName)?.includes(p?.owner);
            }else{
                return
            }
        })

        if(logins?.roles?.includes('ADMIN')){
            setFilteredProducts(prods);
        }else{
            setFilteredProducts(paidUps);
        }
        setProducts(prods)
    },[data])

    const onCloseHandler = data => {
        console.log(data);
        setPaid(false);
    };

    const onCustomerSubmit= (values)=>{
        let payment=values['payment'];
        console.log('PAYMENT::',payment)
        let info={customer:values,payment, orders:cartItems?.map(cartItem=>{
            return {productID: cartItem?.product?.id, quantity:cartItem?.quantity}
            })};
        console.log(info)
        setIsSaving(true)
        customerMutation.mutate({id:values['id'], info:info});
    }

    const viewProduct = () => {
        setOpenViewProductDialog(true)
    };

    const editProduct = () => {
        setOpenNewProductDialog(true)
    };

    const deleteProduct = () => {
        toast.current.show({ severity: 'info', summary: 'product deleted', detail: selectedProduct.name });
    };

    const openNew=()=>{
        setOpenNewProductDialog(true);
    }

    const productRefresh=(data)=>{
        let prods=data?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name, industry:d?.category?.name, ownerName: d?.owner?.firstName+' '+d?.owner?.lastName};
        })
        let paidUps=prods?.filter(p=>{
            if(p?.owner) {
                return subsMutation?.data?.map(sub => sub?.subscriber?.id)?.includes(p?.owner?.id);
            }else{
                return
            }
        })

        if(logins?.roles?.includes('ADMIN')){
            setFilteredProducts(prods);
        }else{
            setFilteredProducts(paidUps);
        }
        setProducts(data)
    }

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }

    const productListItems = (product) => {

        const op = createRef();
        const isProductAdmin= ((logins!==null) && ((product?.owner?.userName?.toLowerCase()===logins?.userName?.toLowerCase()) || logins?.roles?.includes('ADMIN')));

        const productHeader=(
            <div className={'flex flex-row surface-200 border-round border-0 p-2'} onClick={e=>{
                setSelectedProduct(product);
                viewProduct();
            }} style={{cursor:"pointer"}}>
                <i className="pi pi-calculator p-1" style={{ color: SecondaryColor }}></i>
                <div className="text-2xl font-bold p-1" style={{color: SecondaryColor}}>{product.name}</div>

            </div>
        )

        return (
            <div className="col-12" key={product?.id} >
                <Fieldset legend={productHeader}>
                    <div className="flex col-12 flex-row sx:flex-column justify-content-between " >
                        <img className="w-4 shadow-2 border-round col-12 h-12rem" alt={product.name}
                             src={`data:image/bmp;base64,${product?.picture}`} onClick={e=>op?.current?.toggle(e)}
                            // onMouseLeave={e=>op?.current?.toggle(e)} onMouseEnter={e=>op?.current?.toggle(e)}
                        />
                        <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                <p className="text-xl font-italic font-light text-500">{product.description}</p>
                                {/*<Rating value={product.rating} readOnly cancel={false}></Rating>*/}
                                <div className={'col-12 flex flex-row'}>
                                    {
                                        product.tags?.split(',').map(tag=>{
                                            return(
                                                <div className="flex flex-row">
                                                    <Tag className={'m-1'} key={`tag-grid-${tag}`} value={tag} style={{backgroundColor: SecondaryColor, color: 'white'}}></Tag>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.category}</span>
                                </span>
                                </div>
                            </div>
                            <div className="flex flex-row sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span className="text-2xl font-semibold text-orange-700">${product.price?.toFixed(2)}</span>
                                <span className="text-l text-blue-800">{`By:: ${product?.ownerName}`}</span>
                                <div className="flex flex-1 flex-row p-5 gap-5">
                                    {isProductAdmin && <Button icon="pi pi-plus p-4" className="p-button-rounded"  severity={'secondary'}
                                                               onClick={event => {
                                                                   setSelectedProduct(product);
                                                                   openNew();
                                                               }} /> }
                                    <Button tooltip={'View product details'} icon="pi pi-eye p-4" className="p-button-rounded" style={{backgroundColor: PrimaryColor}}
                                            onClick={event => {
                                                setSelectedProduct(product);
                                                viewProduct();
                                            }} />
                                    {isProductAdmin && <Button icon="pi pi-pencil p-4" className="p-button-rounded" severity={'danger'}
                                                               onClick={event => {
                                                                   setSelectedProduct(product);
                                                                   editProduct();
                                                               }} /> }
                                    <Button tooltip={'Add to shopping basket'} icon="pi pi-shopping-cart" className="p-app-tooltip p-button-rounded p-button-outlined cart" severity={'success'} onClick={()=>{
                                        setSelectedProduct(product);
                                        setShowQuantity(true);
                                    }}></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fieldset>

                <OverlayPanel ref={op}>
                    <img className="w-full shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${product?.picture}`} alt={product.name} />
                </OverlayPanel>
            </div>
        );
    };

    const productGridItems = (product) => {
        const op = createRef();

        const isProductAdmin= ((logins!==null) && ((product?.owner?.userName?.toLowerCase()===logins?.userName?.toLowerCase()) || logins?.roles?.includes('ADMIN')));

        const items =
            [
                {
                    label: 'Edit Product',
                    icon: 'pi pi-pencil',
                    classname: 'secondary',
                    command: () => {
                        setSelectedProduct(product);
                        editProduct()
                    }
                },
                {
                    label: 'Deactivate Product',
                    icon: 'pi pi-times',
                    classname: 'danger',
                    command: () => {
                        setSelectedProduct(product);
                        deleteProduct()
                    }
                },
                {
                    label: 'View Product',
                    icon: 'pi pi-eye',
                    command: () => {
                        setSelectedProduct(product);
                        viewProduct()
                    }
                }
            ];

        const productHeader=(
            <div className={'flex flex-row surface-300 border-round border-0 p-1'} onClick={e=>{
                setSelectedProduct(product);
                viewProduct();
            }} style={{cursor:"pointer"}}>
                <i className="pi pi-calculator p-1" style={{ color: 'forestgreen' }}></i>
                <div className="text-2xl font-bold p-1" style={{color: SecondaryColor}}> {product.name}</div>
            </div>
        )
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product?.id} >
                <Fieldset className="p-2 border-1 surface-border surface-card border-round" title={product?.description} legend={productHeader}>
                    <p className="text-sm font-italic text-blue-600 p-0 m-0 mb-1">{product.description}</p>
                    <div className="flex flex-column align-items-center gap-1">
                        <img className="w-9 shadow-2 border-round col-12 h-7rem" alt={product.name}
                             src={`data:image/bmp;base64,${product?.picture}`} onClick={e=>op?.current?.toggle(e)}
                             // onMouseLeave={e=>op?.current?.toggle(e)} onMouseEnter={e=>op?.current?.toggle(e)}
                        />

                        <div className="flex flex-wrap align-items-center justify-content-between gap-1">
                            <div className="flex align-items-center justify-content-between">
                                <span className="text-xl font-semibold text-orange-700">${product.price?.toFixed(2)}</span>
                                <span className="text-l text-blue-800">&nbsp;{` ${product?.ownerName}`}</span>
                            </div>
                            <div>
                                <span className="font-bold text-2xl p-1">{product?.industry}</span>
                                <div className="flex flex-row">
                                    <i className={'pi pi-tag p-1'} style={{color:'forestgreen'}} />
                                    <span className="font-semibold p-1">{product.category}</span>
                                </div>
                            </div>

                        </div>
                        <div className={'col-12 flex flex-row'}>
                            {
                                product.tags?.split(',').map(tag=>{
                                    return(
                                        <div className="flex flex-row">
                                            <Tag className={'m-1'} key={`tag-grid-${tag}`} value={tag} style={{backgroundColor: SecondaryColor, color: 'white'}}></Tag>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <OverlayPanel ref={op}>
                        <img className="w-full shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${product?.picture}`} alt={product.name} />
                    </OverlayPanel>


                        <div style={{position: 'relative'}} className={'mt-2 flex flex-row justify-content-around align-items-end'}>

                            <Button icon="pi pi-eye" tooltip={'View product details'} className="p-app-tooltip p-button-rounded" onClick={()=>{
                                setSelectedProduct(product);
                                setOpenViewProductDialog(true)
                            }} style={{backgroundColor: PrimaryColor}}></Button>

                            <div className={'flex flex-row pr-5 justify-content-center surface-400'} style={{position: 'relative'}}>
                                <Tooltip target=".p-app-tooltip" position="left" />
                                {isProductAdmin &&
                                    <SpeedDial model={items} key={'speedBtn' + product?.name} direction="up"
                                               style={{right: 0, bottom: 0, padding: 0, margin: 0}}
                                               buttonClassName="p-app-tooltip p-button-outlined" showIcon="pi pi-ellipsis-v"
                                               hideIcon="pi pi-times"/>
                                }
                            </div>

                            <Button tooltip={'Add to shopping basket'} icon="pi pi-shopping-cart" className="p-app-tooltip p-button-rounded p-button-outlined cart" severity={'success'} onClick={()=>{
                                setSelectedProduct(product);
                                setShowQuantity(true);
                            }}></Button>
                    </div>

                </Fieldset>

            </div>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === 'list'){
            setRows(4);
            return productListItems(product);
        }
        else if (layout === 'grid') {
            setRows(6)
            return productGridItems(product);
        }
    };

    const itemSearch=(value)=>{
        setSearchValue(value)
        let ps=[...products];
        let filteredProducts=ps.filter(p=>p?.name?.toLowerCase()?.includes(event.target.value?.toLowerCase())|| p?.description?.includes(event.target.value))
        setFilteredProducts(filteredProducts);
    }

    const productHeader = () => {
        return (
            <div  >
                <Box sx={{mt:11}} className={'xl:hidden lg:hidden md:hidden'}></Box>
                <div className="flex flex-grow-1 justify-content-around my-3 ">
                    <div className="flex flex-wrap gap-1 md:gap-6">
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

                    {/*<i className="custom-target-icon pi pi-shopping-cart text-blue-800 p-overlay-badge text-green-500"
                       data-pr-tooltip="My Order"
                       data-pr-position="right"
                       data-pr-at="right+5 top"
                       data-pr-my="left center-2"
                       onClick={()=>setShowCartItems(true)}
                       style={{fontSize: '2rem', cursor: 'pointer'}}>
                        <Badge severity="success" value={cartItems?.length} data-pr-tooltip={'My Order'} ></Badge>
                    </i>

                    <i className="custom-target-icon pi pi-check-circle text-blue-800 p-overlay-badge text-green-500"
                       data-pr-tooltip="Check Out"
                       data-pr-position="right"
                       data-pr-at="right+5 top"
                       data-pr-my="left center-2"
                       onClick={()=>alert('checking out')}
                       style={{fontSize: '3rem', cursor: 'pointer'}}>
                    </i>*/}

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
            productDataOverlayRef?.current?.toggle(e);
        }else{
            setCategories([])
        }
    }

    const onSelectCategory=(e,category)=>{

        let prodList=data?.filter(p=>{
            return p?.category?.id===category?.id
        })
        let prods=prodList?.map(d=>{
            return {...d,userName:d?.createdBy?.userName,category:d?.category?.name, owner:d?.owner?.userName, industry:d?.category?.industry?.name};
        })

        setFilteredProducts(prods);
        productDataOverlayRef?.current?.toggle(e);

    }

    const cartTotal=cartItems?.reduce((total, order) =>total+(order?.product?.price * order?.quantity), 0)

    const subscriptionInactiveMessageContent = (
        <div className="flex align-items-center justify-content-evenly flex-auto " style={{backgroundColor:'transparent'}}>
            <div className="ml-2 flex flex-auto text-red-600 " >
                Please note that you have no active subscription. Please reach out to admin to renew your subscription.
            </div>
            <Button onClick={()=>setShowMessage(false)} icon={'pi pi-times'} rounded={true} raised={true} outlined={true}/>
        </div>
    );

    return (
        <>
            <Toast ref={toast} position={'center'} />
            <Tooltip target=".custom-target-icon" />
            <Tooltip target=".p-app-tooltip .speeddial-bottom-right .p-speeddial-action" position="left" />
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
                                                    return <div className={'col-12'}><Button style={{backgroundColor:otherColor}} className={'col-12 text-sm'} label={industry?.name} onClick={()=>{

                                                        let paidUps=products?.filter(p=>{
                                                            if(p?.owner) {
                                                                return subsMutation?.data?.map(sub => sub?.subscriber?.id)?.includes(p?.owner?.id);
                                                            }else{
                                                                return
                                                            }
                                                        })


                                                        if(logins?.roles?.includes('ADMIN') || !logins){
                                                            let filteredProds=products?.filter(p=>{
                                                                return p.industry?.toLowerCase()===industry?.name?.toLowerCase();
                                                            })
                                                            setFilteredProducts(filteredProds);
                                                        }else{
                                                            let filteredPaidUps=paidUps?.filter(p=>{
                                                                return p.industry?.toLowerCase()===industry?.name?.toLowerCase();
                                                            })
                                                            setFilteredProducts(filteredPaidUps);
                                                        }
                                                    }
                                                    } onMouseEnter={(e) =>onSelectIndustry(e,industry)} /></div>
                                                })
                                            }
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </div>
                            <div className={'col-7  md:col-10'}>
                                <DataView  value={filteredProducts} itemTemplate={itemTemplate} layout={layout} header={productHeader()} rows={rows} paginator={true} />
                            </div>
                        </div>
                        <OverlayPanel ref={productDataOverlayRef} showCloseIcon={true} draggable={true} className={"flex flex-auto"}>
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



            <div className={'flex justify-content-end'} style={{zIndex:10000, position:"fixed", bottom:100, right: 50}} onClick={()=>setShowCartItems(true)}>
                {cartItems?.length>0 &&
                    <div className={'flex flex-column justify-content-center'}>
                    <i className="custom-target-icon pi pi-shopping-cart text-blue-800 p-overlay-badge text-green-500 mb-1"
                       data-pr-tooltip="My Order"
                       data-pr-position="right"
                       data-pr-at="right+5 top"
                       data-pr-my="left center-2"
                       style={{fontSize: '2rem', cursor: 'pointer'}}>
                        <Badge severity="success" value={cartItems?.length} data-pr-tooltip={'My Order'} ></Badge>
                    </i>
                    <i className="custom-target-icon pi pi-check-circle text-blue-800 p-overlay-badge text-green-500"
                       data-pr-tooltip="Check Out"
                       data-pr-position="right"
                       data-pr-at="right+5 top"
                       data-pr-my="left center-2"
                       style={{fontSize: '4rem', cursor: 'pointer'}}>
                    </i>
                </div>
                }
            </div>

            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:'dodgerblue', paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h3" color={'green'}>
                        {selectedProduct && selectedProduct?.id ? selectedProduct?.name:"New Product"}
                    </Typography>
                </div>
            }} visible={openNewProductDialog} style={{ width: '60vw' }} sx={{width:'100%'}} onHide={() => setOpenNewProductDialog(false)}>

                <EditProductDialog
                    token={token}
                    refreshProducts={productRefresh}
                    selectedProduct={selectedProduct}
                    showErrorFeedback={showErrorFeedback}
                    showSuccessFeedback={showSuccessFeedback}
                    setOpenNewProductDialog={setOpenNewProductDialog}/>
            </Dialog>

            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h4" color={'green'}>
                        {'VIEW PRODUCT :: '+selectedProduct?.name+ ' - '} <small>{selectedProduct?.description}</small>
                    </Typography>
                </div>
            }} visible={openViewProductDialog} style={{ width: '75vw' }} onHide={() => setOpenViewProductDialog(false)}>
                <div className={'flex sx:flex-column md:justify-content-between col-12'}>
                    <div className="col-6">
                        <img className="w-9 shadow-2 border-round col-12 h-full" src={`data:image/bmp;base64,${selectedProduct?.picture}`} alt={selectedProduct?.name} />
                    </div>
                    <div className="col-6 surface-100">
                        <div className="grid col-8">
                            <div className="col-6 sm:col-6">Name</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.name}</div>

                            <div className="col-6 sm:col-6">Description</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.description}</div>

                            <div className="col-6 sm:col-6">Active</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.active?.toString()}</div>

                            <div className="col-6 sm:col-6">Owner</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.owner}</div>

                            <div className="col-6 sm:col-6">Price</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.price}</div>

                            <div className="col-6 sm:col-6">Tags</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.tags}</div>

                            <div className="col-6 sm:col-6">Effect Date</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.effectiveDate?.toLocaleString()?.split('T')[0]}</div>

                            <div className="col-6 sm:col-6">Promotions</div>
                            <div className="col-6 sm:col-6"><Button label={'Promotions'} onClick={()=>alert('Promotion')} /></div>

                            <div className="col-6 sm:col-6">Date Created</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.dateCreated}</div>

                            <div className="col-6 sm:col-6">Created By</div>
                            <div className="col-6 sm:col-6">{selectedProduct?.createdBy?.userName?.toString()}</div>
                        </div>
                    </div>

                </div>
            </Dialog>

            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:'dodgerblue', paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h3" color={PrimaryColor}>
                        {'NO of ITEMS :: '+selectedProduct && selectedProduct?.id ? selectedProduct?.name:""}
                    </Typography>
                </div>
            }} visible={showQuantity} style={{ width: '50vw' }} sx={{width:'100%'}} onHide={() => setShowQuantity(false)}>
                <div className={'col-12 p-3'}>
                    <span className="p-float-label">
                        <InputText autoFocus={true}  value={quantity} onChange={(e) => {setQuantity(e.target.value);}} keyfilter={'num'}
                                   className={classNames({ 'p-invalid': !quantity || parseFloat(quantity)<=0 })} style={{width:'100%'}}
                        />
                        <label >{`How many items of ${selectedProduct?.name?.toUpperCase()}`}</label>
                    </span>
                </div>
                <div className="col-12 flex flex-auto justify-content-between">
                    <Button label={'Cancel'} icon={'trash'} severity={'danger'} tooltip={'Cancel adding item'} onClick={()=>setShowQuantity(false)}/>
                    <Button label={'Add To Cart'} icon={'plus'} severity={'success'} tooltip={'Add to cart'} onClick={()=>{
                       let order= cartItems?.filter(order=>{
                            return order?.product?.id===selectedProduct?.id
                        })

                        let q=parseFloat(quantity);
                        if(order?.length>0){
                            let newOrder={product: selectedProduct, quantity: (q+ order[0]?.quantity)}
                            let newOrderList=cartItems?.filter(order=>order?.product?.id!==selectedProduct?.id);
                            newOrderList?.push(newOrder);
                            setCartItems(newOrderList);
                        }else {
                            let newCart=[...cartItems]
                                newCart.push({product: selectedProduct, quantity:q});
                            setCartItems(newCart);
                        }
                        setQuantity('')
                        setShowQuantity(false)
                        showToast(toast, 'success','Adding Product To Cart', 'Product has been added sto the cart successfully!')
                    }} />
                </div>
            </Dialog>

            <Dialog header={()=><div
                style={{width:'90%', backgroundColor:PrimaryColor, padding: '20px', borderRadius:20, color:'white', margin: 10}}
            ><div className={'flex justify-content-between'}><span>{`CART ITEMS`}</span><span>{'TOTAL: $'+(cartTotal?.toFixed(2)?.toLocaleString("en-US"))}</span></div></div>}
                    visible={showCartItems} onHide={() => setShowCartItems(false)}
                    style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <Accordion activeIndex={0}>
                    {cartItems?.map(item=>{

                        return(
                            <AccordionTab key={item?.product?.id} style={{width:'100%'}}
                                          header={
                                              <div className={"flex flex-1 justify-content-between"} style={{width:'100%'}}>
                                                  <span className="font-bold" style={{color:PrimaryColor}}><i className="pi pi-star mr-2"/>{' '+item?.product?.name+' x '+item?.quantity }</span>
                                              </div>
                                          }
                            >
                                <div className="grid">
                                    <div className="col-6 md:col-5">
                                        Product Name
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {':: '+item?.product?.name}
                                    </div>
                                    <div className="col-6 md:col-5">
                                        Product Category
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {':: '+item?.product?.category}
                                    </div>
                                    <div className="col-6 md:col-5">
                                        Product Industry
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {':: '+item?.product?.industry}
                                    </div>
                                    <div className="col-6 md:col-5">
                                        Product Price
                                    </div>
                                    <div className="col-6 md:col-5">
                                        {':: $'+item?.product?.price?.toFixed(2)}
                                    </div>


                                    <hr style={{border: `0.5px double ${SecondaryColor}`, width:'100%', margin:0}}/>
                                    <div className="col-12 grid">
                                        <div className="col-6 md:col-5" style={{color:PrimaryColor, fontWeight:"bold"}}>
                                            Product Total
                                        </div>
                                        <div className="col-6 md:col-5" style={{color:PrimaryColor, fontWeight: "bold"}}>
                                            {':: $'+(item?.product?.price * item?.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                    <hr style={{border: `0.5px double ${SecondaryColor}`, width:'100%', margin:0}}/>

                                </div>
                            </AccordionTab>
                        )
                    })

                    }
                </Accordion>
                <div className="col-12 flex flex-auto justify-content-around">
                    <Button label={'Cancel'} icon={'pi pi-trash'} severity={'danger'} tooltip={'Clear Cart'} onClick={()=>{
                        setCartItems([]);
                        showToast(toast, 'success', 'Cart Clearing', 'Your shopping cart was cleared successfully!');

                    }} />
                    <div>
                        <PaynowPayment
                            items={()=>{
                                return cartItems?.map(item=>{
                                    return {title: item?.product?.name,amount: item?.product?.price,quantity: item?.quantity}
                                })
                            }}
                            label="Express checkout"
                            paymentMode="mobile"
                            isOpen={paid}
                            onClose={onCloseHandler}
                        />
                    </div>
                    <Button label={'Checkout'} icon={'pi pi-check-circle'} disabled={cartItems?.length<=0} iconPos={'left'} severity={'success'}
                            tooltip={'Check Out'} onClick={()=>setGetUserInfo(true)} />
                </div>
            </Dialog>

            <Dialog header={()=>{
                return <div style={{textDecoration:'underline', textDecorationColor:SecondaryColor, paddingLeft:20, paddingRight:10}}>
                    <Typography component="h1" variant="h3" color={PrimaryColor}>
                        {"Customer Details"}
                    </Typography>
                </div>
            }} visible={getUserInfo} style={{ width: '60vw' }} sx={{width:'100%'}} onHide={() => setGetUserInfo(false)}>


                <MultiStepForm
                    steps={customerSteps}
                    stepLabels={customerStepLabels}
                    initialValues={customerInitialValues}
                    validationSchema={customerValidationSchema}
                    mergedValues={mergedValues}
                    setMergedValues={setMergedValues}
                    onSubmit={onCustomerSubmit}
                    token={token}
                    isLoading={isSaving}
                />

            </Dialog>


        </>
    )
}



export default Product;
