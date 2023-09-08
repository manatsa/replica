import React from 'react';
import AppFormTextField from "../../components/form/AppFormTextField.jsx";
import AppFormCalendar from "../../components/form/AppFormCalendar.jsx";
import AppForm from "../../components/form/AppForm.jsx";
import {Field} from "formik";
import AppFormTextArea from "../../components/form/AppFormTextArea.jsx";

const CustomerStep2 =({initValues, validationSchema, onNextStep, onBack, token})=>{

    return (
        <>
            <div className={'grid'}>
                <AppForm
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    onSubmit={onNextStep}
                    onBack={onBack}
                >

                    <Field  name={'address'} as={AppFormTextArea} label={'Residential Address'} />

                    <Field name={'address2'} as={AppFormTextArea} label={'Delivery Address'} />

                    <Field name={'email'} as={AppFormTextField} label={'Email Address'} type={'email'} />

                    <Field name={'phone'} as={AppFormTextField} label={'Mobile Number'} />

                    <Field name={'phone2'} as={AppFormTextField} label={'Mobile Number 2'} />

                </AppForm>
            </div>
        </>
    )
}

export default CustomerStep2;