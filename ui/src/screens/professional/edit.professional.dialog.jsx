import React from "react";
import * as Yup from "yup";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import MultiStepForm from "../../components/MultiStepForm.jsx";
import ProfessionalStep1 from "./professionalStep1.jsx";
import ProfessionalStep2 from "./professionalStep2.jsx";
import ProfessionalStep3 from "./professionalStep3.jsx";
import ProfessionalStep4 from "./professionalStep4.jsx";
import doUpdate from "../../query/doUpdate.js";

const EditProfessionalDialog=({showErrorFeedback, showSuccessFeedback, selectedProfessional, token, refreshProfessionals, setOpenNewProfessionalDialog})=> {

    const [mergedValues, setMergedValues] = useState(selectedProfessional||{});
    const [isLoading, setIsLoading] = useState(false)
    const initialValues=
        [
        {
            title:mergedValues['title']||{},
            firstName:mergedValues['firstName'] || '',
            lastName: mergedValues['lastName'] || '',
            admin: mergedValues['admin']|| ''
        },
        {
            address: mergedValues['address'] || '',
            address2: mergedValues['address2'] || '',
            phone: mergedValues['phone'] || '',
            phone2: mergedValues['phone2'] || '',
            tel: mergedValues['tel'] || '',
            email:mergedValues['email'] || '',
        },
        {
            qualifications: mergedValues['qualifications'] || '',
            experience: mergedValues['experience'] || '',
            tags: mergedValues['tags'] || '',
            category: mergedValues['category'] || ''
        },
        {
            picture: mergedValues['pictures'] || ''
        }
    ];

    const validationSchema=[
        Yup.object().shape({
            firstName: Yup.string().required('Please enter first name'),
            lastName: Yup.string().required("Please enter last name"),
            title: Yup.string().required('Please select title of the professional.'),
            admin: Yup.string().required('Please select admin of the professional\'s account.'),
        }),
        Yup.object().shape({
            address: Yup.string().required("Please enter address."),
            phone:Yup.string().required("Please enter the phone number."),
            address2: Yup.string().optional(),
            phone2: Yup.string().optional(),
            tel: Yup.string().optional(),
            email: Yup.string().email('Please enter a valid email address.').typeError('Your email is in bad shape.').optional(),

        }),
        Yup.object().shape({
            experience: Yup.string().optional(),
            qualifications: Yup.string().required('Please enter professional qualifications.'),
            tags: Yup.string().required('Please enter at least one tag.'),
            category: Yup.string().required("Please select category.")
        }),
        Yup.object().shape({
            picture: Yup.string().optional()
        })
    ]

    const stepLabels=[
        {label:'General Info'},
        {label:'Contact Info'},
        {label:'Qualifications'},
        {label:'Image Upload'}
    ]

    const steps=[ ProfessionalStep1, ProfessionalStep2, ProfessionalStep3, ProfessionalStep4 ]

    const professionalMutation=useMutation({
        mutationFn: data=>doUpdate('api/professionals/',token, data?.id, data?.professional),
        onError: error => showErrorFeedback(error),
        onSuccess: (data, variables, context) => {
            refreshProfessionals(data);
            setOpenNewProfessionalDialog(false)
            setIsLoading(false)
            showSuccessFeedback();
        }
    })

    const submit=values=>{
        setIsLoading(true)
        const professional={...values};
        professionalMutation.mutate({id:values?.id||'',professional})
        setMergedValues(initialValues)
    }

    return (
        <MultiStepForm
            steps={steps}
            stepLabels={stepLabels}
            initialValues={initialValues}
            validationSchema={validationSchema}
            mergedValues={mergedValues}
            setMergedValues={setMergedValues}
            onSubmit={submit}
            token={token}
            isLoading={isLoading}
        />
    );
}

export default EditProfessionalDialog;
