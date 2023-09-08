import React from 'react';
import AppForm from "../../components/form/AppForm.jsx";
import {Field} from "formik";
import AppFormRadio from "../../components/form/AppFormRadio.jsx";
import {YES_NO} from "../../components/Constants.jsx";
import AppFormSelectField from "../../components/form/AppFormSelectField.jsx";
import AppFormCalendar from "../../components/form/AppFormCalendar.jsx";
import AppFormCheckbox from "../../components/form/AppFormCheckbox.jsx";

const CustomerStep3 =({initValues, validationSchema, onNextStep, onBack, token})=>{


    return (
        <>
            <div className={'grid'}>
                <AppForm
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    onSubmit={onNextStep}
                    onBack={onBack}
                    isLastStep={true}
                >

                    <Field name={'deliver'} as={AppFormSelectField}  options={YES_NO} label={'Do you want Delivery?'} dropdown={true} />
                    <Field name={'register'} as={AppFormSelectField} options={YES_NO} label={'Register as a customer?'} dropdown={true} />
                    <Field name={'deliveryDate'} as={AppFormCalendar}  label={'Select delivery date'} dateFormat={'dd/mm/yy'} />
                    <Field name={'payment'} as={AppFormCheckbox}  label={'Make Payment'}  />
                </AppForm>
            </div>
        </>
    )
}

export default CustomerStep3;