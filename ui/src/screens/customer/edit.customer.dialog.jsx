import * as React from "react";
import * as Yup from "yup";
import {useState} from "react";
import ProductStep1 from "./mutiform/productStep1.jsx";
import ProductStep2 from "./mutiform/productStep2.jsx";
import ProductStep3 from "./mutiform/productStep3.jsx";
import {useMutation} from "@tanstack/react-query";
import doUpdate from "../../query/doUpdate.js";
import ProductStep4 from "./mutiform/productStep4.jsx";
import MultiStepForm from "../../components/MultiStepForm.jsx";

export default function EditCustomerDialog({showErrorFeedback, showSuccessFeedback, selectedProduct, token, refreshProducts, setOpenNewProductDialog}) {











    return (
        <MultiStepForm
            steps={steps}
            stepLabels={stepLabels}
            initialValues={initialValues}
            validationSchema={productValidationSchema}
            mergedValues={mergedValues}
            setMergedValues={setMergedValues}
            onSubmit={submit}
            token={token}
            isLoading={isLoading}
        />
    );
}
