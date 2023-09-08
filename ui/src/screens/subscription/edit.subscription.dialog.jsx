import React, {useEffect, useRef, useState} from 'react';
import * as yup from 'yup';
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import { classNames } from 'primereact/utils';
import {ProgressSpinner} from "primereact/progressspinner";
import {useMutation} from "@tanstack/react-query";
import {doFetch} from "../../query/doFetch.js";
import doUpdate from "../../query/doUpdate.js";
import AppAutocomplete from "../../components/AppAutocomplete.jsx";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";

const EditSubscriptionDialog=({setEditSubscriptionDialogVisible, selectedSubscription, setSelectedSubscription, token, setSubscriptionsData, showErrorFeedback, showSuccessFeedback})=>{

    const toast=useRef(null);
    const [indicator, setIndicator] = useState(false)
    const {mutate} = useMutation({
        mutationFn:data=>doUpdate('/api/subscriptions/',token,data?.id,data?.subscription),
        onError: error=>{
            setIndicator(false)
            showErrorFeedback(error);
        },
        onMutate: ()=>setIndicator(true),
        onSuccess:(data)=>{
            setIndicator(false)
            setSubscriptionsData(data);
            showSuccessFeedback();
        }
    });

    const Periods=[
        'MONTH',
        'QUARTER',
        'TERM',
        'HALF_YEAR',
        'YEAR'
    ]

    const userMutation=doFetch('/api/users/',token, ['get',selectedSubscription?.id,'users'])

    const initialValues={
        id:selectedSubscription?.id||'',
        subscriber:selectedSubscription?.subscriber||null,
        startDate: Date.parse(selectedSubscription?.startDate)|| null,
        period: selectedSubscription?.period || '',
    }

    const validationSchema=yup.object().shape({
        subscriber: yup.object().shape({
            name: yup.string().required("Please select subscriber name."),
            value: yup.string().required("Please select subscriber name."),
        }).test('Test_Sub','Please select subscriber.',sub => sub?.value?.toString()?.trim()?.length>1),
        startDate: yup.string().nullable(),
        period: yup.string().required("Please select subscription period."),
    })

    const onSubmit= (values)=>{
        const subscription={...values,...{subscriber:values['subscriber']?.value}};
        mutate({id:values['id'],subscription});
        formik.resetForm();
        setEditSubscriptionDialogVisible(false)

    }

    const formik=useFormik({
        initialValues,validationSchema,onSubmit
    })

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (
        <>
            <Toast ref={toast} />
            {indicator && <div className="card flex justify-content-center"> <ProgressSpinner style={{zIndex:1000}}/></div>}
            <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2" >
                <div className={'grid'}>
                    <div className={'col-12'}>
                        <span className="p-float-label">
                            <Dropdown id="period" name="period" value={formik.values['period']} onChange={(e) => {formik.setFieldValue('period', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('period') })} style={{width:'100%'}} options={Periods}
                            />
                            <label htmlFor="period">Subscription Period</label>
                        </span>
                        {getFormErrorMessage('period')}
                    </div>
                    <div className={'col-12'}>
                        <span className="p-float-label">
                            <Calendar id="startDate" dateFormat={'dd/mm/yy'} formatDateTime={''} name="startDate" value={formik.values['startDate']} onChange={(e) => {formik.setFieldValue('startDate', e.target.value);}}
                               className={classNames({ 'p-invalid': isFormFieldInvalid('startDate') })} style={{width:'100%'}} showButtonBar showTime hourFormat="24" showIcon={true}
                            />
                            <label htmlFor="startDate">Subscription Start Date</label>
                        </span>
                        {getFormErrorMessage('startDate')}
                    </div>

                    <div className={'col-12'}>
                        <span className="p-float-label">
                            <AppAutocomplete name={'subscriber'} items={userMutation?.data?.map(u=>{
                                return {name:u.firstName+' '+u?.lastName, value:u?.id}
                            })} formik={formik} multiple={false} placeholder={'Search Subscriber'} dropdown={true} />
                            <label htmlFor="subscriber">Select Subscriber</label>
                        </span>
                        {getFormErrorMessage('subscriber')}
                    </div>

                </div>

                <br/>
                <div className={'flex justify-content-around'}>
                    <Button  severity={'danger'} outlined={true} type="button" label="Close" onClick={()=>{
                        setSelectedSubscription(null);
                        setEditSubscriptionDialogVisible(false);
                    }} />
                    <Button  severity={'warning'} outlined={true} type="button" label="Clear" onClick={()=>{
                        setSelectedSubscription(null);
                        formik.resetForm()
                    }} />
                    <Button  severity={'success'} outlined={true} type="submit" label="Save" />
                </div>
            </form>
        </>
    )
}

export default EditSubscriptionDialog;