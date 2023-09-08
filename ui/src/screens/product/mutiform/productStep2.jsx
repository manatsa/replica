import React, {useEffect, useState} from 'react';
import AppFormSelectField from "../../../components/form/AppFormSelectField.jsx";
import AppFormTextField from "../../../components/form/AppFormTextField.jsx";
import AppFormCalendar from "../../../components/form/AppFormCalendar.jsx";
import AppForm from "../../../components/form/AppForm.jsx";
import {Field} from "formik";
import {DISCOUNT_TYPES} from "../../../components/Constants.jsx";

const ProductStep2 =({initValues, validationSchema, onNextStep, onBack, token})=>{



    return (
        <>
            <div className={'grid'}>
                <AppForm
                    initialValues={initValues}
                    validationSchema={validationSchema}
                    onSubmit={onNextStep}
                    onBack={onBack}
                >

                    <Field  name={'discountType'} as={AppFormSelectField} options={DISCOUNT_TYPES} label={'Discount Type'} />

                    <Field name={'discount'} as={AppFormTextField} label={'Discount Value'} />

                    <Field name={'coupon'} as={AppFormTextField} label={'Coupon'} />

                    <Field name={'promotionStartDate'} as={AppFormCalendar} label={'Promotion Start Date'} dateFormat={'dd/mm/yy'} />

                    <Field name={'promotionEndDate'} as={AppFormCalendar} label={'Promotion End Date'} dateFormat={'dd/mm/yy'} />

                </AppForm>
            </div>
        </>
    )
}

export default ProductStep2;