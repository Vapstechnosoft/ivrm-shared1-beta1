
export interface IInvRSalesLoadData {
    // Initial load usually just gets sales numbers or similar if needed, 
    // but in Angular loaddata() fetches get_salesno, but mainrdochange also fetches things.
    // We'll define types primarily.
    salesList?: IInvRSalesEntity[];
}

export interface IInvRSalesEntity {
    // Common fields for various dropdowns/lists
    id: number;
    name: string;

    // Specific fields from Angular
    invmsL_SalesNo?: string;
    invmsL_Id?: number;

    invmI_Id?: number;
    invmI_ItemName?: string;

    amsT_Id?: number;
    studentname?: string;
    amsT_AdmNo?: string;

    hrmE_Id?: number;
    employeename?: string;

    invmC_Id?: number;
    invmC_CustomerName?: string;

    asmcL_Id?: number;
    asmcL_ClassName?: string;

    asmS_Id?: number;
    asmC_SectionName?: string;

    // Checkbox state
    checked?: boolean;
}

export interface IInvRSalesReportData {
    // Existing fields
    rowNumber?: number;
    invmsL_SalesNo?: string;
    invmsL_SalesDate?: string;
    invmI_ItemName?: string;
    invtsL_SalesQty?: number;
    invtsL_SalesPrice?: number;
    invtsL_DiscountAmt?: number;
    invtsL_TaxAmt?: number;
    invtsL_Amount?: number;

    membername?: string; // Student or Staff Name
    amsT_AdmNo?: string;

    // Overall/Specific fields
    saleQty?: number;
    salePrice?: number;
    saleDiscount?: number;
    saleTax?: number;
    saleAmount?: number;

    // Keys from response (lowercase)
    invmsl_SalesNo?: string;
    invmsl_SalesDate?: string;

    // New API Fields
    item_Name?: string;
    sales_Date?: string;
    sales_Qty?: number;
    sales_Price?: number;
    discount_Amt?: number;
    tax_Amt?: number;
    total_Amount?: number;
    invmsL_Id?: number;
    invmI_Id?: number;

    // Keys from User Response (Overall + Item)
    invmi_Id?: number;
    invmi_ItemName?: string;
    memberId?: number;
    memberName?: string;
    invtsl_SalesQty?: number;
    invtsl_SalesPrice?: number;
    invtsl_DiscountAmt?: number;
    invtsl_TaxAmt?: number;
    invtsl_Amount?: number;
}

export interface IInvRSalesPayload {
    typeflag: string; // All, Overall, Detailed
    optionflag?: string; // Item, Student, Staff, Customer, Saleno
    individualflag?: string; // C, CS (for student) or boolean/string in angular
    startdate?: string;
    enddate?: string;
    bw_dates: boolean;

    // Arrays for multi-selects
    salesArray?: IInvRSalesEntity[];
    salenoarray?: IInvRSalesEntity[];
    itemArray?: IInvRSalesEntity[];
    clsarray?: IInvRSalesEntity[];
    secarray?: IInvRSalesEntity[];
    studentArray?: IInvRSalesEntity[];

    // ID for single selects
    studentid?: number | string;
    hrme_id?: number | string;
    invmc_id?: number | string;

    // Form specific keys (mapped to api keys in server action)
    singleStudentId?: number;
    singleStaffId?: number;
    singleCustomerId?: number;
    classId?: string;
    sectionId?: string;

    // Flags for Tax/Discount columns (handled in frontend mostly for display, but payload might need them if server filters)
    // Angular sends " HRM_id: 0" etc.
}
