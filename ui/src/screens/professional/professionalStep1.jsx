import React from 'react';
import {Field} from "formik";
import AppFormSelectField from "../../components/form/AppFormSelectField.jsx";
import AppForm from "../../components/form/AppForm.jsx";
import AppFormTextField from "../../components/form/AppFormTextField.jsx";
import {doFetch} from "../../query/doFetch.js";
import {TITLEOPTIONS} from "../../components/Constants.jsx";

const ProfessionalStep1 =({initValues, validationSchema, onNextStep, onBack, token})=>{

    const adminMutation=doFetch(`/api/users/`,token,['get','users']);
    const data=adminMutation?.data;
    const admins=data?.map(d=>{
        return {...d,printName:d?.firstName+' '+d?.lastName +' as :: '+d?.userName}

    })

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
                    <Field name={'title'} as={AppFormSelectField} label={'Title'} options={TITLEOPTIONS} />

                    <Field name={'firstName'} as={AppFormTextField} label={'First Name'} />

                    <Field name={'lastName'} as={AppFormTextField} label={'Last Name'} />

                    <Field name={'admin'} as={AppFormSelectField} options={admins || []} optionValue={'id'} optionLabel={'printName'} label={'Account Admin'} />

                </AppForm>
            </div>
        </>
    )
}

export default ProfessionalStep1;