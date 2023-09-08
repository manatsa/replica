import React from 'react';
import {Field} from "formik";
import AppForm from "../../components/form/AppForm.jsx";
import AppFormTextField from "../../components/form/AppFormTextField.jsx";
import AppFormTextArea from "../../components/form/AppFormTextArea.jsx";

const ProfessionalStep2 =({initValues, validationSchema, onNextStep, onBack, token})=>{

    return (
        <>
            <div className={'grid md:p-10'}>
                <AppForm
                    onSubmit={onNextStep}
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    onBack={onBack}
                >

                    <Field  name={'address'} as={AppFormTextArea} label={'Physical Address'} />

                    <Field  name={'address2'} as={AppFormTextArea} label={'Physical Address 2'} />

                    <Field name={'email'} as={AppFormTextField} label={'Email Address'} />

                    <Field name={'phone'} as={AppFormTextField} label={'Mobile Number'} />

                    <Field name={'phone2'} as={AppFormTextField} label={'Mobile Number 2'} />

                    <Field name={'tel'} as={AppFormTextField} label={'Office Tel'} />

                </AppForm>
            </div>
        </>
    )
}

export default ProfessionalStep2;