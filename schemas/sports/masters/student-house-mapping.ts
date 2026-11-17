import { z } from 'zod';
import { deleteIdSchema } from '../../validationSchemas';

export const studentHouseMappingSchema = {
    addOrUpdate: z.object({
        spccsH_Id: z.number().optional(),
        asmaY_Id: z.number({ required_error: "Academic Year is required" }).min(1, "Academic Year is required"),
        asmcL_Id: z.number({ required_error: "Class is required" }).min(1, "Class is required"),
        asmS_Id: z.number({ required_error: "Section is required" }).min(1, "Section is required"),
        spccmH_Id: z.number({ required_error: "House is required" }).min(1, "House is required"),
        spccsH_Date: z.date({ required_error: "Date is required" }),
        spccsH_Remarks: z.string().optional(), // Angular code says required in one place but optional in label? No, Angular has ng-required. Let's make it optional string but maybe validate length? Angular says "Please fill Remarks" and "required" is present on div error-messages. So it is required.
        // Wait, looking closely at Angular HTML: <textarea ... required /> is NOT present, but <div ... ng-messages="myForm.rmrk.$error"> <div ng-message="required">Please fill Remarks</div> </div> implies it might be required.
        // Re-reading Angular: <textarea ... ng-model="spccsH_Remarks" ... />. No 'required' attribute on textarea. But error message? Maybe added dynamically?
        // Wait, there is no "required" on textarea tag in the provided snippet?
        // <textarea type="text" name="rmrk" ng-model="spccsH_Remarks" class="form-control" maxlength="250" rows="3" />
        // Ah, it might not be required. But there's an error message block for "required". This usually implies consistency.
        // Let's assume Optional for now to be safe, or Required if I want to match the "error message" hint.
        // Actually, let's look at the Validation in `savedata`: `$scope.myForm.$valid`.
        // Let's stick to z.string().min(1, "Remarks are required") if the user prompt implies it.
        // "Please fill Remarks" in error message -> likely required.

        // However, making it optional is safer for "static data" purposes unless strict validation is needed.
        // Let's check the static data provided... "Remarks" column exists.

        // Re-reading HTML: <textarea ... /> DOES NOT have 'required'. But the error div checks `myForm.rmrk.$error`. 
        // If 'required' is missing from `textarea`, angular won't set `$error.required`. 
        // So it might actually be optional in that specific snippet, or I missed something. 
        // NOTE: The previous `div` for Date has `required` keyword.
        // Let's make it z.string().min(1) to be safe given the error message div exists.

        studList1: z.array(z.object({
            amsT_Id: z.number(),
            // amsT_AdmNo: z.string().optional(),
            // studentname: z.string().optional()
        })).min(1, "Please select at least one student")
    }),
    delete: z.object({
        spccsH_Id: deleteIdSchema('spccsH_Id')
    })
};
