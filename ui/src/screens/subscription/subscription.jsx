import React, {useEffect, useRef, useState} from 'react';
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import showToast from "../../notifications/showToast";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import {ContextMenu} from "primereact/contextmenu";
import {Toolbar} from "primereact/toolbar";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Typography} from "@mui/material";
import {doFetch} from "../../query/doFetch.js";
import {getLogin} from "../../auth/check.login";
import {PrimaryColor, SecondaryColor} from "../../components/Constants.jsx";
import EditSubscriptionDialog from "./edit.subscription.dialog.jsx";

const Subscription =  () => {


    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewSubscriptionDialog, setOpenNewSubscriptionDialog] = useState(false);
    const [openViewSubscriptionDialog, setOpenViewSubscriptionDialog] = useState(false);
    const [subscriptions, setSubscriptions]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        userName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        period: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        startDate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        endDate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        valid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    });


    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    useEffect((e)=>{
        if(!token || isExpired ){
            navigate("/")
        }else {
            if(!logins['privileges']?.includes('ADMIN') ){
                showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
                window.history.back()
            }
        }
    },[])



    const {data, error, isError, isLoading }=doFetch('/api/subscriptions/',token,['get','All','subscription']);

    useEffect(()=>{
        let subs=data?.map(d=>{
            const valid =(new Date(d?.endDate) >= new Date())?.toString();
            return {...d,createdBy:d?.createdBy?.userName,userName:d?.subscriber?.userName, name:d?.subscriber?.firstName+' '+d?.subscriber?.lastName, valid,startDate: new Date(d?.startDate)?.toLocaleString(), endDate: new Date(d?.endDate)?.toLocaleString()};
        })
        setSubscriptions(subs)
    },[data])

    const cols = [
        { field: 'name', header: 'FULL NAME' },
        { field: 'userName', header: 'SUBSCRIBER ' },
        { field: 'period', header: 'PERIOD' },
        { field: 'startDate', header:'START DATE'},
        { field: 'endDate', header:'END DATE'},
        { field: 'active', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'RECEIPT DATE' },
        { field: 'createdBy', header: 'RECEIPTED BY' },
        { field: 'valid', header: 'VALIDITY' },

    ];

    const viewSubscription = () => {
        setOpenViewSubscriptionDialog(true)
    };

    const editSubscription = () => {
        setOpenNewSubscriptionDialog(true)
    };

    const deleteSubscription = () => {
        toast.current.show({ severity: 'info', summary: 'subscription deleted', detail: selectedSubscription.name });
    };

    const openNew=()=>{
        setOpenNewSubscriptionDialog(true);
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className={'flex flex-row justify-content-between'}>
                <h2 className="m-0">Subscriptions List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" variant={'standard'}/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewSubscription() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editSubscription() },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteSubscription() }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, subscriptions);
                doc.save('subscriptions.pdf');
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="" rounded icon="pi pi-plus" style={{backgroundColor: SecondaryColor}} onClick={openNew}/>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div style={{width:'100%', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <Button type="button" label={'CSV'} icon="pi pi-download " severity="success" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                &nbsp;&nbsp;
                <Button type="button" label={'PDF'} icon="pi pi-download" severity="danger" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>)
    };

    const refresh=(data)=>{
        let subs=data?.map(d=>{
            return {...d,createdBy:d?.createdBy?.userName,userName:d?.subscriber?.userName, name:d?.subscriber?.firstName+' '+d?.subscriber?.lastName, valid: (new Date() <= d?.endDate), startDate: new Date(d?.startDate)?.toLocaleString(), endDate: new Date(d?.endDate)?.toLocaleString()};
        })
        setSubscriptions(subs)
    }

    const showSuccessFeedback=()=>{
        showToast(toast,'success','Operation Feedback','Operation completed successfully!')
    }

    const showErrorFeedback=(error)=>{
        showToast(toast,'error','Operation Feedback',error.toString())
    }


    return (
        <>
            <Toast ref={toast} position={'center'} />
            {isLoading && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <div className="card">
                <Tooltip target=".export-buttons>button" position="bottom" />
                <ContextMenu model={menuModel} ref={cm} onHide={()=>null} />
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}/>
                <DataTable ref={dt} value={subscriptions}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['name', 'userName',  'period','startDate', 'endDate']}
                           onContextMenu={(e) => cm.current.show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedSubscription} onContextMenuSelectionChange={(e) => setSelectedSubscription(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index} sortable={true} field={col?.field} header={col?.header} />
                    })
                    }

                </DataTable>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:PrimaryColor, paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={PrimaryColor}>
                            {selectedSubscription && selectedSubscription?.id ? selectedSubscription?.name:"New Subscription"}
                        </Typography>
                    </div>
                }} visible={openNewSubscriptionDialog} style={{ width: '70vw' }} onHide={() => {
                    setSelectedSubscription(null)
                    setOpenNewSubscriptionDialog(false)
                }}>
                    <EditSubscriptionDialog selectedSubscription={selectedSubscription} setEditSubscriptionDialogVisible={setOpenNewSubscriptionDialog} openNewUserDialog={openNewSubscriptionDialog}
                                    token={token} setSubscriptionsData={refresh} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback} setSelectedSubscription={setSelectedSubscription} />
                </Dialog>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:PrimaryColor, paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={PrimaryColor}>
                            {'VIEW SUBSCRIPTION :: '+selectedSubscription?.name}
                        </Typography>
                    </div>
                }} visible={openViewSubscriptionDialog} style={{ width: '60vw' }} onHide={() => setOpenViewSubscriptionDialog(false)}>
                   <div className={'grid'}>
                       <div className="col-6 sm:col-6">Subscription Name</div>
                       <div className="col-6 sm:col-6">{selectedSubscription?.name}</div>

                       <div className="col-6 sm:col-6">Subscription Active</div>
                       <div className="col-6 sm:col-6">{selectedSubscription?.active?.toString()}</div>

                       <div className="col-6 sm:col-6">Date Created</div>
                       <div className="col-6 sm:col-6">{selectedSubscription?.dateCreated}</div>

                       <div className="col-6 sm:col-6">Created By</div>
                       <div className="col-6 sm:col-6">{selectedSubscription?.createdBy?.userName?.toString()}</div>
                   </div>
                </Dialog>

            </div>
        </>
    )
}

export default Subscription;
