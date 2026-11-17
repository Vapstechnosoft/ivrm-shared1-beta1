import { z } from 'zod';

export const sportTopperListSchema = z.object({
    type: z.enum(['House', 'CS']),
    asmaY_Id: z.coerce.number().min(1, 'Select Academic Year'),

    // Common fields
    spccmH_Id: z.array(z.coerce.number()).optional(),
    spccmE_Id: z.array(z.coerce.number()).optional(), // Event
    spccmscC_Id: z.array(z.coerce.number()).optional(), // Sports

    // CS specific
    asmcL_Id: z.coerce.number().optional(),
    asmS_Id: z.array(z.coerce.number()).optional(),
}).refine((data) => {
    if (data.type === 'House') {
        return data.spccmH_Id && data.spccmH_Id.length > 0;
    }
    // In CS mode, House selection might be optional or required depending on user requirement. 
    // The legacy code shows House selection in CS mode too inside showdetails payload. 
    // The user request shows "selectedhouselist" in CS payload.
    // However, the HTML shows "ng-show='Type=='House''" for house dropdown? 
    // WAIT. Re-reading HTML:
    // <div class="col-sm-6"> ... <div class="form-group"> <label ...>House Name : ...
    // It DOES NOT have ng-show="Type=='House'". It seems visible for BOTH.
    // BUT, earlier in HTML, there was commented out code: 
    // <!--<div class="col-sm-6"> ... <select ... ng-model="SPCCMH_Id" ...> ... </div>-->
    // The active one is:
    // <div class="col-sm-6"> <div class="form-group"> ... <div class="multiselect ..."> ...
    // This div does NOT have ng-show. So it is visible always.
    return data.spccmH_Id && data.spccmH_Id.length > 0;
}, {
    message: 'Select at least one House',
    path: ['spccmH_Id'],
}).refine((data) => {
    if (data.type === 'CS') {
        return !!data.asmcL_Id;
    }
    return true;
}, {
    message: 'Select Class',
    path: ['asmcL_Id'],
}).refine((data) => {
    if (data.type === 'CS') {
        return data.asmS_Id && data.asmS_Id.length > 0;
    }
    return true;
}, {
    message: 'Select at least one Section',
    path: ['asmS_Id'],
}).refine((data) => {
    return data.spccmE_Id && data.spccmE_Id.length > 0;
}, {
    message: 'Select at least one Event',
    path: ['spccmE_Id'],
});
// Sports selection seems optional in terms of "Select Sports" dropdown (multiselect).
// Wait, is it required? 
// In HTML: <div class="col-sm-6"> ... Sports Name ... 
// It doesn't have required attribute explicitly on the multiselect input checkbox logic visible in snippet,
// but usually filter reports require at least some selection.
// Let's make it optional for now effectively unless mandated, but good practice is to allow All or specific.
// Actually, let's look at legacy "isOptionsRequiredevent" equivalent for sports?
// It was commented out in JS: //$scope.isOptionsRequiredevent = ... 
// So maybe optional.

export type SportTopperListFormData = z.infer<typeof sportTopperListSchema>;
