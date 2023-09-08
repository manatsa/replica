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
import EditIndustryDialog from "./edit.industry.dialog.jsx";
import {SecondaryColor} from "../../components/Constants.jsx";

const Industry =  () => {


    const {token, login}=getLogin();
    const {isExpired} =useJwt(token);
    const navigate=useNavigate();
    const toast= useRef(null);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [openNewIndustryDialog, setOpenNewIndustryDialog] = useState(false);
    const [openViewIndustryDialog, setOpenViewIndustryDialog] = useState(false);
    const [industries, setIndustries]=useState([]);
    const dt = useRef(null);
    const cm = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        description: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    });

    const logins=login && login!=='undefined' ? JSON.parse(login) : null;

    useEffect((e)=>{
        if(!token || isExpired ){
            navigate("/")
        }else {
            if(!logins['privileges']?.includes('ADMIN')){
                showToast(toast,'error','Error 401: Access Denied','You do not have access to this resource!');
                window.history.back();
            }
        }
    },[])



    const {data, error, isError, isLoading }=doFetch('/api/industry/',token,['get','industry']);

    useEffect(()=>{
        let inds=data?.map(d=>{
            return {...d,userName:d?.createdBy?.userName};
        })
        setIndustries(inds)
    },[data])

    const cols = [
        { field: 'name', header: 'INDUSTRY NAME' },
        { field: 'description', header: 'INDUSTRY DESCRIPTION' },
        { field: 'active', header: 'ACTIVE' },
        { field: 'dateCreated', header: 'DATE CREATED' },
        { field: 'userName', header: 'CREATED BY' },

    ];

    const viewIndustry = () => {
        setOpenViewIndustryDialog(true)
    };

    const editIndustry = () => {
        setOpenNewIndustryDialog(true)
    };

    const deleteIndustry = () => {
        toast.current.show({ severity: 'info', summary: 'industry deleted', detail: selectedIndustry.name });
    };

    const openNew=()=>{
        setOpenNewIndustryDialog(true);
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
                <h2 className="m-0">Industries List</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" variant={'standard'}/>
                </span>
            </div>
        );
    };

    const menuModel = [
        { label: 'View', icon: 'pi pi-fw pi-hourglass', command: () => viewIndustry() },
        { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editIndustry() },
        { label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteIndustry() }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, industries);
                doc.save('industries.pdf');
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
        console.log(data)
        setIndustries(data);
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
                <DataTable ref={dt} value={industries}  tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} header={renderHeader}
                           filters={filters} filterDisplay="menu" globalFilterFields={['name', 'description']}
                           onContextMenu={(e) => cm.current.show(e.originalEvent)} stripedRows={true}
                           rowsPerPageOptions={[5,10, 25, 50]} dataKey="id" resizableColumns showGridlines
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           contextMenuSelection={selectedIndustry} onContextMenuSelectionChange={(e) => setSelectedIndustry(e.value)}>
                    {cols?.map((col,index)=>{
                        return <Column key={index}  field={col?.field} header={col?.header} sortable={true} />
                    })
                    }

                </DataTable>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {selectedIndustry && selectedIndustry?.id ? selectedIndustry?.name:"New Industry"}
                        </Typography>
                    </div>
                }} visible={openNewIndustryDialog} style={{ width: '70vw' }} onHide={() => setOpenNewIndustryDialog(false)}>
                    <EditIndustryDialog selectedIndustry={selectedIndustry} setEditIndustryDialogVisible={setOpenNewIndustryDialog} openNewUserDialog={openNewIndustryDialog}
                                    token={token} setIndustrysData={refresh} showSuccessFeedback={showSuccessFeedback} showErrorFeedback={showErrorFeedback}/>
                </Dialog>

                <Dialog header={()=>{
                    return <div style={{textDecoration:'underline', textDecorationColor:'forestgreen', paddingLeft:20, paddingRight:10}}>
                        <Typography component="h1" variant="h3" color={'green'}>
                            {'VIEW INDUSTRY :: '+selectedIndustry?.name}
                        </Typography>
                    </div>
                }} visible={openViewIndustryDialog} style={{ width: '60vw' }} onHide={() => setOpenViewIndustryDialog(false)}>
                   <div className={'grid'}>
                       <div className="col-6 sm:col-6">Industry Name</div>
                       <div className="col-6 sm:col-6">{selectedIndustry?.name}</div>

                       <div className="col-6 sm:col-6">Industry Description</div>
                       <div className="col-6 sm:col-6">{selectedIndustry?.description}</div>

                       <div className="col-6 sm:col-6">Industry Active</div>
                       <div className="col-6 sm:col-6">{selectedIndustry?.active?.toString()}</div>

                       <div className="col-6 sm:col-6">Date Created</div>
                       <div className="col-6 sm:col-6">{selectedIndustry?.dateCreated}</div>

                       <div className="col-6 sm:col-6">Created By</div>
                       <div className="col-6 sm:col-6">{selectedIndustry?.createdBy?.userName?.toString()}</div>
                   </div>
                </Dialog>

            </div>
        </>
    )
}

export default Industry;
