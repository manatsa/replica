import React, {useState} from 'react';
import {Field} from "formik";
import AppForm from "../../components/form/AppForm.jsx";
import AppFormFilesUploader from "../../components/form/AppFormFilesUploader.jsx";

const ProfessionalStep4 =({initValues, validationSchema, onNextStep, onBack, token})=>{


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

                    <Field id={'picture'}  name={'picture'} as={AppFormFilesUploader} accept={'image/*'}  />

                </AppForm>
            </div>
        </>
    )
}

export default ProfessionalStep4;