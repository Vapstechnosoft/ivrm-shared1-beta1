import { z } from 'zod';

export interface ICategoryItem {
    lmC_Id: number;
    mI_Id?: number;
    lmC_CategoryName: string;
    lmC_BNBFlg?: string;
    lmC_ActiveFlag?: boolean;
    lmC_CategoryCode?: string;
    createdDate?: string;
    updatedDate?: string;
}

export interface IEmployeeGroupItem {
    hrmgT_Id: number;
    mI_Id?: number;
    hrmgT_EmployeeGroupType: string;
    hrmgT_Code?: string;
    hrmgT_Order?: number;
    hrmgT_ActiveFlag?: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export interface IClassItem {
    asmcL_Id: number;
    mI_Id?: number;
    asmcL_ClassName: string;
    asmcL_MinAgeYear?: number;
    asmcL_MinAgeMonth?: number;
    asmcL_MinAgeDays?: number;
    asmcL_MaxAgeYear?: number;
    asmcL_MaxAgeMonth?: number;
    asmcL_MaxAgeDays?: number;
    asmcL_Order?: number;
    asmcL_ClassCode?: string;
    asmcL_ActiveFlag?: boolean;
    asmcL_MaxCapacity?: number;
    asmcL_PreadmFlag?: number;
    createdDate?: string;
    updatedDate?: string;
}

export interface IDepartmentItem {
    hrmD_Id: number;
    mI_Id?: number;
    hrmD_DepartmentName: string;
    hrmD_Order?: number;
    hrmD_ActiveFlag?: boolean;
}

export interface IGuestItem {
    guest_Id: number;
    guest_Name: string;
}

export interface ICirculationParameterInitialData {
    data?: any;
    circ_Id?: number;
    mI_Id?: number;
    lmC_Id?: number;
    max_Issue_Items?: number;
    max_Issue_Days?: number;
    max_No_Renewals?: number;
    lbcpaS_NoOfItems?: number;
    lbcpaS_IssueDays?: number;
    lbcpaS_NoOfRenewals?: number;
    circ_ActiveFlag?: boolean;
    categorylist?: ICategoryItem[];
    categoryList?: ICategoryItem[];
    categories?: ICategoryItem[];
    emplist?: IEmployeeGroupItem[];
    empList?: IEmployeeGroupItem[];
    group_list?: IEmployeeGroupItem[];
    employeeGroupList?: IEmployeeGroupItem[];
    stafflist?: IEmployeeGroupItem[];
    classlist?: IClassItem[];
    classList?: IClassItem[];
    classes?: IClassItem[];
    fillclass?: IClassItem[];
    departmentlist?: IDepartmentItem[];
    departmentList?: IDepartmentItem[];
    filldepartment?: IDepartmentItem[];
    deptlist?: IDepartmentItem[];
    guestlist?: IGuestItem[];
    guest_list?: IGuestItem[];
    fillguest?: IGuestItem[];
    guestList?: IGuestItem[];
    booktypelist?: { lmB_BookType: string }[] | string[];
    bookTypeList?: { lmB_BookType: string }[] | string[];
    allCirculationData?: any[];
    alldata?: any[];
    getdetails?: any[];
    circulation_list?: any[];
    circulationList?: any[];
    fillstudent?: any[];
    fillemp?: any[];
    filldata?: any[];
    saveddata?: any[];
    griddata?: any[];
    lbcpA_Id?: number;
    asmcL_Id?: number;
    ivrmuL_Id?: number;
    hrmgT_Id?: number;
    lnbcpA_Id?: number;
    lbcpaS_ActiveFlg?: boolean;
    lbcpaS_list?: any[];
    lbcpa_list?: any[];
    parmeter_Id?: number;
    duplicate?: boolean;
    returnval?: boolean;
    [key: string]: any;
}

export interface IToggleCirculationParameterPayload {
    LBCPA_Id?: number;
    LNBCPA_Id?: number;
    Parmeter_Id?: number;
    BOOKFLAG?: string;
    issuertype1?: string;
    MI_SchoolCollegeFlag?: string;
    MI_Id?: number;
    mI_Id?: number;
    circ_Id?: number;
    lbcpA_Id?: number;
    lnbcpA_Id?: number;
    lbcpaS_Id?: number;
    LMC_Id?: number;
    [key: string]: any;
}

export interface CirculationParameterGridData {
    circ_Id?: number;
    lbcpA_Id?: number;
    LBCPA_Id?: number;
    lnbcpA_Id?: number;
    LNBCPA_Id?: number;
    parmeter_Id?: number;
    Parmeter_Id?: number;
    param_Id?: number;
    lbcpaS_Id?: number;
    LBCPAS_Id?: number;
    lbcpaE_Id?: number;
    LBCPAE_Id?: number;
    lbcpaD_Id?: number;
    LBCPAD_Id?: number;
    lbcpaG_Id?: number;
    LBCPAG_Id?: number;
    lnbcpaS_Id?: number;
    LNBCPAS_Id?: number;
    type_Id?: number;
    type_Name?: string;
    lbcpA_IssueRefFlg?: string;
    lbcpA_Flg?: string;
    param_ActiveFlg?: boolean;
    param_IssueDays?: number;
    param_NoOfItems?: number;
    param_NoOfRenewals?: number;
    lmC_Id?: number;
    LMC_Id?: number;
    mI_Id?: number;
    MI_Id?: number;
    lmC_CategoryName?: string;
    lmB_BookType?: string;
    lmB_BookTypeflag?: string;
    BOOKFLAG?: string;
    flgtype?: string;
    categoryName?: string;
    catgname?: string;
    schclgflag?: string;
    issuertype1?: string;
    MI_SchoolCollegeFlag?: string;
    mI_SchoolCollegeFlag?: string;
    asmcL_Id?: number;
    asmcL_ClassName?: string;
    hrmgT_Id?: number;
    hrmgT_EmployeeGroupType?: string;
    hrmD_Id?: number;
    hrmD_DepartmentName?: string;
    guest_Id?: number;
    guest_Name?: string;
    max_Issue_Items?: number;
    max_Issue_Days?: number;
    max_No_Renewals?: number;
    lbcpaS_NoOfItems?: number;
    lbcpaS_IssueDays?: number;
    lbcpaS_NoOfRenewals?: number;
    lmC_MaxIssueItems?: number;
    lmC_MaxIssueDays?: number;
    lmC_MaxRenewals?: number;
    circ_ActiveFlag?: boolean;
    lbcpaS_ActiveFlg?: boolean;
    lbcpa_ActiveFlg?: boolean;
    lnbcpa_ActiveFlg?: boolean;
    lmC_ActiveFlag?: boolean;
    activeFlag?: boolean;
    [key: string]: any;
}

export interface CirculationParameterPayload {
    lbcpa_Id?: number;
    asmcl_Id?: number;
    lmc_Id?: number;
    hrmgt_Id?: number;
    hrmd_Id?: number;
    guest_Id?: number;
    max_Issue_Items?: number;
    max_Issue_Days?: number;
    max_No_Renewals?: number;
    issuertype1?: string;
    catgname?: string;
    bookflag?: string;
    lbcpa_ExcludeHolidayFlg?: boolean;
    ivrmul_Id?: number;
    mi_Id?: number;
    [key: string]: any;
}

export const circulationParameterSchema = z
    .object({
        id: z.number().optional(),
        bookParameterFlag: z.string().default('BP'),
        issuerType: z.string().default('STUDENT'),

        categoryId: z.number().optional(),
        bookType: z.string().optional(),

        classId: z.number().optional(),
        employeeGroupId: z.number().optional(),
        departmentId: z.number().optional(),
        guestId: z.number().optional(),

        maxIssueItems: z.number().min(0, { message: 'Must be a positive number' }).optional(),
        maxIssueDays: z.number().min(0, { message: 'Must be a positive number' }).optional(),
        maxRenewals: z.number().min(0, { message: 'Must be a positive number' }).optional(),

        nonBookMaxIssueItems: z.number().min(0).optional(),
        nonBookMaxIssueDays: z.number().min(0).optional(),
        nonBookMaxRenewals: z.number().min(0).optional(),

        categoryName: z.string().optional(),
        status: z.boolean().default(true)
    })
    .superRefine((data, ctx) => {
        if (data.bookParameterFlag === 'BP' && !data.bookType) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Book Type',
                path: ['bookType']
            });
        }
        if (data.bookParameterFlag === 'NBP' && !data.categoryId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Category Name',
                path: ['categoryId']
            });
        }

        if (data.issuerType === 'STUDENT' && !data.classId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Class',
                path: ['classId']
            });
        }
        if (data.issuerType === 'STAFF' && !data.employeeGroupId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Employee Group',
                path: ['employeeGroupId']
            });
        }
        if (data.issuerType === 'DEPARTMENT' && !data.departmentId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Department',
                path: ['departmentId']
            });
        }
        if (data.issuerType === 'GUEST' && !data.guestId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Select Guest Name',
                path: ['guestId']
            });
        }
    });

export type CirculationParameterFormValues = z.infer<typeof circulationParameterSchema>;
