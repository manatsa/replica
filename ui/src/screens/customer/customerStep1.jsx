import React from 'react';
import AppForm from "../../components/form/AppForm.jsx";
import AppFormTextArea from "../../components/form/AppFormTextArea.jsx";
import {Field} from "formik";
import AppFormInputNumber from "../../components/form/AppFormInputNumber.jsx";
import AppFormSelectField from "../../components/form/AppFormSelectField.jsx";
import {TITLEOPTIONS} from "../../components/Constants.jsx";
import AppFormTextField from "../../components/form/AppFormTextField.jsx";

const CustomerStep1 =({initValues, validationSchema, onNextStep, onBack, token})=>{

    return (
        <>
            <div className={'grid md:p-10'}>
                <AppForm
                    onSubmit={onNextStep}
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    isFirstStep={true}
                    onBack={onBack}
                >

                    <Field name={'title'} as={AppFormSelectField} options={TITLEOPTIONS} label={'Customer Title'} />

                    <Field  name={'firstName'} as={AppFormTextField} label={'Customer First Name'} />

                    <Field  name={'lastName'} as={AppFormTextField}  label={'Customer Last Name'}  />

                </AppForm>
            </div>
        </>
    )
}

export default CustomerStep1;