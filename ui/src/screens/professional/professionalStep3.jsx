import React, {useState} from 'react';
import {doFetch} from "../../query/doFetch.js";
import {Field} from "formik";
import {Dropdown} from "primereact/dropdown";
import AppFormTextArea from "../../components/form/AppFormTextArea.jsx";
import AppFormTextField from "../../components/form/AppFormTextField.jsx";
import AppForm from "../../components/form/AppForm.jsx";
import AppFormSelectField from "../../components/form/AppFormSelectField.jsx";

const ProfessionalStep3 =({initValues, validationSchema, onNextStep, onBack, token})=>{

    const [industry, setIndustry] = useState(null)
    const industryMutation=doFetch('/api/industry/',token,['get','industry']);
    const categoryMutation=doFetch(industry?`/api/category/industry/${industry}`:'/api/category/',token,['get',industry,'industry']);

    return (
        <>
            <div className={'grid'}>
                <AppForm
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    onSubmit={onNextStep}
                    onBack={onBack}
                >

                    <Field  name={'qualifications'} as={AppFormTextArea} label={'Qualifications'} />

                    <Field  name={'experience'} as={AppFormTextArea} label={'Experience'} />

                    <Field  name={'tags'} as={AppFormTextField} label={'Tags'} placeholder={'Comma(,) Separated Tags'} />

                    <div className={'col-12 p-3'}>
                        <span className="p-float-label">
                        <Dropdown options={industryMutation?.data||[]} value={industry} optionValue={'id'} optionLabel={'name'} onChange={e=>{
                            setIndustry(e.value)
                        }} style={{width:'100%', marginTop:5, marginBottom:5}} />
                            <label>Select Industry</label>
                        </span>
                    </div>

                    <Field name={'category'} as={AppFormSelectField} options={categoryMutation?.data || []} optionValue={'id'} optionLabel={'name'} label={'Category'} />


                </AppForm>
            </div>
        </>
    )
}

export default ProfessionalStep3;