'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { Form } from '@/components/ui/form';
import {
    useCirculationData,
    useCirculationParameterDetails,
    useSaveCirculationParameter,
    useToggleCirculationParameterStatus
} from '@/hooks/library/useCirculationParameter';
import {
    type CirculationParameterFormValues,
    type CirculationParameterGridData,
    type CirculationParameterPayload,
    type ICategoryItem,
    type IClassItem,
    type IDepartmentItem,
    type IEmployeeGroupItem,
    type IGuestItem,
    circulationParameterSchema
} from '@/types/library/transactions/circulationParameter';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CirculationParameterForm } from './_components/CirculationParameterForm';
import { createCirculationParameterColumns } from './_components/columns';
import { ToggleCirculationParameterDialog } from './_components/toggle-dialog';

// Deep unwrapper for API responses
function resolveDetails(res: any): any {
    if (!res) return {};
    let d = res;
    while (d && typeof d === 'object' && !Array.isArray(d)) {
        if (
            d.allCirculationData ||
            d.allCirculationList ||
            d.classlist ||
            d.classList ||
            d.categorylist ||
            d.categoryList ||
            d.emplist ||
            d.empList ||
            d.fillclass ||
            d.fillClass ||
            d.max_Issue_Items !== undefined ||
            d.Max_Issue_Items !== undefined
        ) {
            return d;
        }
        if (d.data && typeof d.data === 'object' && !Array.isArray(d.data)) {
            d = d.data;
        } else if (d.result && typeof d.result === 'object' && !Array.isArray(d.result)) {
            d = d.result;
        } else {
            break;
        }
    }
    return d || {};
}

// Case-insensitive field reader
function getField<T = any>(obj: any, ...fieldNames: string[]): T | undefined {
    if (!obj || typeof obj !== 'object') return undefined;
    for (const name of fieldNames) {
        if (obj[name] !== undefined && obj[name] !== null) return obj[name];
    }
    const lowerNames = fieldNames.map((n) => n.toLowerCase());
    for (const key of Object.keys(obj)) {
        if (lowerNames.includes(key.toLowerCase()) && obj[key] !== undefined && obj[key] !== null) {
            return obj[key];
        }
    }
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
        for (const name of fieldNames) {
            if (obj.data[name] !== undefined && obj.data[name] !== null) return obj.data[name];
        }
        for (const key of Object.keys(obj.data)) {
            if (lowerNames.includes(key.toLowerCase()) && obj.data[key] !== undefined && obj.data[key] !== null) {
                return obj.data[key];
            }
        }
    }
    return undefined;
}

// Helper function to safely extract list from array, $values wrapper, or data wrapper
function extractList(list: any): any[] {
    if (!list) return [];
    if (Array.isArray(list)) return list;
    if (list && typeof list === 'object') {
        if (Array.isArray(list.$values)) return list.$values;
        if (Array.isArray(list.data)) return list.data;
        if (Array.isArray(list.values)) return list.values;
        if (Array.isArray(list.items)) return list.items;
        if (Array.isArray(list.result)) return list.result;
        const values = Object.values(list).filter(
            (item) => item && typeof item === 'object' && !('$id' in item && Object.keys(item).length === 1)
        );
        if (values.length > 0 && values.every((v) => typeof v === 'object')) {
            return values;
        }
    }
    return [];
}

export default function CirculationParameterPage() {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [toggleRow, setToggleRow] = useState<CirculationParameterGridData | null>(null);
    const [dynamicGridData, setDynamicGridData] = useState<CirculationParameterGridData[] | null>(null);
    const [categoryListState, setCategoryListState] = useState<ICategoryItem[]>([]);

    const defaultFormValues: CirculationParameterFormValues = {
        id: undefined,
        bookParameterFlag: 'BP',
        issuerType: 'STUDENT',
        status: true,
        bookType: undefined,
        categoryId: undefined,
        categoryName: undefined,
        classId: undefined,
        employeeGroupId: undefined,
        departmentId: undefined,
        guestId: undefined,
        maxIssueItems: undefined,
        maxIssueDays: undefined,
        maxRenewals: undefined
    };

    // Form initialization
    const form = useForm<CirculationParameterFormValues>({
        resolver: zodResolver(circulationParameterSchema),
        defaultValues: defaultFormValues
    });

    const bookParameterFlag = form.watch('bookParameterFlag');
    const issuerType = form.watch('issuerType');

    // Hooks
    const { data: apiResponse, isLoading: isDetailsLoading, refetch: refetchDetails } = useCirculationParameterDetails();
    const categoryMutation = useCirculationData();
    const saveMutation = useSaveCirculationParameter();
    const toggleStatusMutation = useToggleCirculationParameterStatus();

    // Extracting raw data from API response safely
    const details = useMemo(() => resolveDetails(apiResponse), [apiResponse]);

    // Master lists extracted dynamically from onload API response
    const initialCategoryList: ICategoryItem[] = useMemo(() => {
        return extractList(getField(details, 'categorylist', 'categoryList', 'categories', 'fillcategory', 'fillCategory'));
    }, [details]);

    const classList: IClassItem[] = useMemo(() => {
        return extractList(
            getField(details, 'fillclass', 'fillClass', 'Fillclass', 'classlist', 'classList', 'Classlist', 'classes', 'fillstudent')
        );
    }, [details]);

    const employeeGroupList: IEmployeeGroupItem[] = useMemo(() => {
        return extractList(
            getField(details, 'emplist', 'empList', 'group_list', 'employeeGroupList', 'stafflist', 'fillemp', 'fillEmployeeGroup')
        );
    }, [details]);

    const departmentList: IDepartmentItem[] = useMemo(() => {
        return extractList(getField(details, 'departmentlist', 'departmentList', 'filldepartment', 'filldept', 'deptlist', 'dept_list', 'fillDepartment'));
    }, [details]);

    const guestList: IGuestItem[] = useMemo(() => {
        return extractList(getField(details, 'guestlist', 'guestList', 'fillguest', 'guest_list', 'fillGuest'));
    }, [details]);

    const bookTypeList = useMemo(() => {
        return extractList(getField(details, 'booktypelist', 'bookTypeList', 'booktypes', 'bookTypes'));
    }, [details]);

    // Synchronize initial category list to state
    useEffect(() => {
        if (initialCategoryList.length > 0) {
            setCategoryListState(initialCategoryList);
        }
    }, [initialCategoryList]);

    // Fetch dynamic categories when Non-Book Parameter is selected
    const fetchNonBookCategories = useCallback(() => {
        const values = form.getValues();
        const payload = {
            MI_Id: details?.mI_Id || details?.MI_Id || 0,
            mI_Id: details?.mI_Id || details?.MI_Id || 0,
            LMB_BookTypeflag: 'NBP',
            flgtype: 'Non-Book',
            schclgflag: values.issuerType || 'STUDENT',
            asmcl_id: values.classId || 0,
            HRMGT_Id: values.employeeGroupId || 0,
            HRMD_Id: values.departmentId || 0,
            Guest_Id: values.guestId || 0
        };

        categoryMutation.mutate(payload, {
            onSuccess: (res: any) => {
                const innerRes = resolveDetails(res);
                const dynamicCat = extractList(
                    getField(innerRes, 'categorylist', 'categoryList', 'categories', 'fillcategory')
                );

                if (dynamicCat.length > 0) {
                    setCategoryListState(dynamicCat);
                }
            }
        });
    }, [categoryMutation, details, form]);

    useEffect(() => {
        if (bookParameterFlag === 'NBP') {
            fetchNonBookCategories();
        }
    }, [bookParameterFlag, fetchNonBookCategories]);

    // Name lookup maps for table enrichment
    const classMap = useMemo(() => new Map(classList.map((c: any) => [c.asmcL_Id ?? c.asmcl_id ?? c.ASMCL_Id, c.asmcL_ClassName ?? c.className])), [classList]);
    const employeeGroupMap = useMemo(
        () => new Map(employeeGroupList.map((e: any) => [e.hrmgT_Id ?? e.hrmgt_id ?? e.HRMGT_Id, e.hrmgT_EmployeeGroupType ?? e.groupName])),
        [employeeGroupList]
    );
    const departmentMap = useMemo(
        () => new Map(departmentList.map((d: any) => [d.hrmD_Id ?? d.hrmd_id ?? d.HRMD_Id, d.hrmD_DepartmentName ?? d.departmentName])),
        [departmentList]
    );
    const guestMap = useMemo(
        () => new Map(guestList.map((g: any) => [g.guest_Id ?? g.guest_id ?? g.guestId, g.guest_Name ?? g.guestName])),
        [guestList]
    );
    const categoryMap = useMemo(
        () => new Map(categoryListState.map((c: any) => [c.lmC_Id ?? c.lmc_id ?? c.LMC_Id, c.lmC_CategoryName ?? c.categoryName])),
        [categoryListState]
    );

    // Extract and enrich grid data dynamically from response
    const gridData: CirculationParameterGridData[] = useMemo(() => {
        if (dynamicGridData && dynamicGridData.length > 0) {
            return dynamicGridData;
        }

        const parentLbcpaId = Number(getField(details, 'LBCPA_Id', 'lbcpA_Id', 'lbcpa_Id') ?? 0);
        const parentLnbcpaId = Number(getField(details, 'LNBCPA_Id', 'lnbcpA_Id', 'lnbcpa_Id') ?? 0);
        const defaultItems = Number(getField(details, 'max_Issue_Items', 'max_issue_items', 'Max_Issue_Items', 'lbcpaS_NoOfItems') ?? 3);
        const defaultDays = Number(getField(details, 'max_Issue_Days', 'max_issue_days', 'Max_Issue_Days', 'lbcpaS_IssueDays') ?? 8);
        const defaultRenewals = Number(getField(details, 'max_No_Renewals', 'max_no_renewals', 'Max_No_Renewals', 'lbcpaS_NoOfRenewals') ?? 3);

        const currentIssuer = (issuerType || 'STUDENT').toUpperCase();
        const isNbp = bookParameterFlag === 'NBP';

        // 1. First priority: Check allCirculationData returned from onload API
        const allCircList = extractList(
            getField(details, 'allCirculationData', 'allCirculationList', 'allcirculationdata', 'circulation_list', 'circulationList', 'alldata', 'griddata', 'saveddata')
        );

        if (allCircList.length > 0) {
            const matchingRows = allCircList.filter((row: any) => {
                const rowIssuer = (row.lbcpA_Flg || row.issuertype1 || row.schclgflag || (row.type_Id ? currentIssuer : '')).toUpperCase();
                const matchesIssuer = !rowIssuer || rowIssuer === currentIssuer;

                const rowIsNbp =
                    row.BOOKFLAG === 'NBP' ||
                    row.lmB_BookTypeflag === 'NBP' ||
                    row.lbcpA_IssueRefFlg === 'Non-Book' ||
                    (row.lmC_CategoryName && !row.lmB_BookType && !['Issue', 'Reference', 'Both', 'Book'].includes(row.lmC_CategoryName));

                const matchesBookFlag = isNbp ? rowIsNbp : !rowIsNbp;
                return matchesIssuer && matchesBookFlag;
            });

            const rowsToMap = matchingRows.length > 0 ? matchingRows : allCircList.filter((row: any) => {
                const rowIssuer = (row.lbcpA_Flg || row.issuertype1 || row.schclgflag || '').toUpperCase();
                return !rowIssuer || rowIssuer === currentIssuer;
            });

            if (rowsToMap.length > 0) {
                return rowsToMap.map((row: any) => {
                    const rowIssuer = (row.lbcpA_Flg || row.issuertype1 || row.schclgflag || currentIssuer).toUpperCase();
                    const classId = Number(row.asmcL_Id || row.asmcl_id || (rowIssuer === 'STUDENT' ? row.type_Id : undefined) || 0);
                    const empId = Number(row.hrmgT_Id || row.hrmgt_id || (rowIssuer === 'STAFF' ? row.type_Id : undefined) || 0);
                    const deptId = Number(row.hrmD_Id || row.hrmd_id || (rowIssuer === 'DEPARTMENT' ? row.type_Id : undefined) || 0);
                    const guestId = Number(row.guest_Id || row.guest_id || (rowIssuer === 'GUEST' ? row.type_Id : undefined) || 0);
                    const catId = Number(row.lmC_Id || row.lmc_id || (isNbp ? row.type_Id : undefined) || 0);

                    const className = row.asmcL_ClassName || (classId ? classMap.get(classId) : undefined) || (rowIssuer === 'STUDENT' ? row.type_Name : undefined);
                    const empGroupName = row.hrmgT_EmployeeGroupType || (empId ? employeeGroupMap.get(empId) : undefined) || (rowIssuer === 'STAFF' ? row.type_Name : undefined);
                    const deptName = row.hrmD_DepartmentName || (deptId ? departmentMap.get(deptId) : undefined) || (rowIssuer === 'DEPARTMENT' ? row.type_Name : undefined);
                    const guestName = row.guest_Name || (guestId ? guestMap.get(guestId) : undefined) || (rowIssuer === 'GUEST' ? row.type_Name : undefined);
                    const catName = row.lmC_CategoryName || (catId ? categoryMap.get(catId) : undefined) || (isNbp ? row.type_Name : undefined);

                    const rowActiveFlag =
                        row.param_ActiveFlg ??
                        row.lbcpaS_ActiveFlg ??
                        row.lbcpaE_ActiveFlg ??
                        row.lbcpaD_ActiveFlg ??
                        row.lbcpaG_ActiveFlg ??
                        row.lnbcpaS_ActiveFlg ??
                        row.circ_ActiveFlag ??
                        row.lbcpA_ActiveFlg ??
                        row.lbcpa_ActiveFlg ??
                        row.lnbcpa_ActiveFlg ??
                        row.lmC_ActiveFlag ??
                        row.activeFlag ??
                        true;

                    const paramId = Number(row.param_Id || row.parmeter_Id || row.Parmeter_Id || row.lbcpaS_Id || row.LBCPAS_Id || row.circ_Id || 0);
                    const lbcpaId = Number(row.lbcpA_Id || row.LBCPA_Id || row.lbcpa_Id || parentLbcpaId);
                    const lnbcpaId = Number(row.lnbcpA_Id || row.LNBCPA_Id || row.lnbcpa_Id || parentLnbcpaId);

                    const maxItems = Number(row.param_NoOfItems ?? row.lbcpaS_NoOfItems ?? row.max_Issue_Items ?? defaultItems);
                    const maxDays = Number(row.param_IssueDays ?? row.lbcpaS_IssueDays ?? row.max_Issue_Days ?? defaultDays);
                    const maxRenew = Number(row.param_NoOfRenewals ?? row.lbcpaS_NoOfRenewals ?? row.max_No_Renewals ?? defaultRenewals);

                    const resolvedBookType = row.lbcpA_IssueRefFlg || row.lmB_BookType || row.catgname || (isNbp ? catName : 'Issue');

                    return {
                        ...row,
                        LBCPA_Id: lbcpaId,
                        lbcpA_Id: lbcpaId,
                        LNBCPA_Id: lnbcpaId,
                        lnbcpA_Id: lnbcpaId,
                        param_Id: paramId,
                        Parmeter_Id: paramId,
                        parmeter_Id: paramId,
                        lbcpaS_Id: paramId,
                        LBCPAS_Id: paramId,
                        type_Id: row.type_Id || classId || empId || deptId || guestId || catId,
                        type_Name: row.type_Name || className || empGroupName || deptName || guestName || catName,
                        asmcL_Id: classId || undefined,
                        asmcL_ClassName: className,
                        hrmgT_Id: empId || undefined,
                        hrmgT_EmployeeGroupType: empGroupName,
                        hrmD_Id: deptId || undefined,
                        hrmD_DepartmentName: deptName,
                        guest_Id: guestId || undefined,
                        guest_Name: guestName,
                        lmC_Id: catId || undefined,
                        lmC_CategoryName: catName,
                        lmB_BookType: resolvedBookType,
                        lbcpA_IssueRefFlg: resolvedBookType,
                        catgname: resolvedBookType,
                        BOOKFLAG: isNbp ? 'NBP' : 'BP',
                        lmB_BookTypeflag: isNbp ? 'NBP' : 'BP',
                        schclgflag: rowIssuer,
                        issuertype1: rowIssuer,
                        lbcpA_Flg: rowIssuer,
                        max_Issue_Items: maxItems,
                        max_Issue_Days: maxDays,
                        max_No_Renewals: maxRenew,
                        lbcpaS_NoOfItems: maxItems,
                        lbcpaS_IssueDays: maxDays,
                        lbcpaS_NoOfRenewals: maxRenew,
                        param_NoOfItems: maxItems,
                        param_IssueDays: maxDays,
                        param_NoOfRenewals: maxRenew,
                        circ_ActiveFlag: rowActiveFlag,
                        lbcpaS_ActiveFlg: rowActiveFlag,
                        param_ActiveFlg: rowActiveFlag,
                        lbcpA_ActiveFlg: rowActiveFlag
                    };
                });
            }
        }

        // 2. Check tab-specific saved circulation parameter lists
        let savedList: any[] = [];
        if (currentIssuer === 'STUDENT') {
            savedList = extractList(getField(details, 'classlist', 'classList', 'fillstudent', 'student_list', 'lbcpaS_list'));
        } else if (currentIssuer === 'STAFF') {
            savedList = extractList(getField(details, 'emplist', 'empList', 'fillemp', 'lbcpaE_list', 'staff_list'));
        } else if (currentIssuer === 'DEPARTMENT') {
            savedList = extractList(getField(details, 'departmentlist', 'departmentList', 'filldepartment', 'filldept', 'dept_list', 'lbcpaD_list'));
        } else if (currentIssuer === 'GUEST') {
            savedList = extractList(getField(details, 'guestlist', 'guestList', 'fillguest', 'guest_list', 'lbcpaG_list'));
        }

        if (savedList.length > 0) {
            return savedList.map((row: any) => {
                const classId = Number(row.asmcL_Id || row.asmcl_id || row.ASMCL_Id || 0);
                const empId = Number(row.hrmgT_Id || row.hrmgt_id || row.HRMGT_Id || 0);
                const deptId = Number(row.hrmD_Id || row.hrmd_id || row.HRMD_Id || 0);
                const catId = Number(row.lmC_Id || row.lmc_id || row.LMC_Id || 0);
                const guestId = Number(row.guest_Id || row.guest_id || 0);

                const lbcpaSId = row.lbcpaS_Id || row.LBCPAS_Id || row.lbcpas_Id;
                const rowActiveFlag =
                    row.param_ActiveFlg ??
                    row.lbcpaS_ActiveFlg ??
                    row.lbcpaE_ActiveFlg ??
                    row.lbcpaD_ActiveFlg ??
                    row.lbcpaG_ActiveFlg ??
                    row.lnbcpaS_ActiveFlg ??
                    row.circ_ActiveFlag ??
                    row.lbcpA_ActiveFlg ??
                    row.lbcpa_ActiveFlg ??
                    row.lmC_ActiveFlag ??
                    row.activeFlag ??
                    true;

                const paramId = Number(row.param_Id || lbcpaSId || row.parmeter_Id || row.Parmeter_Id || row.circ_Id || 0);

                const maxItems = Number(row.param_NoOfItems ?? row.lbcpaS_NoOfItems ?? row.max_Issue_Items ?? defaultItems);
                const maxDays = Number(row.param_IssueDays ?? row.lbcpaS_IssueDays ?? row.max_Issue_Days ?? defaultDays);
                const maxRenew = Number(row.param_NoOfRenewals ?? row.lbcpaS_NoOfRenewals ?? row.max_No_Renewals ?? defaultRenewals);

                const className = row.asmcL_ClassName || (classId ? classMap.get(classId) : undefined);
                const empGroupName = row.hrmgT_EmployeeGroupType || (empId ? employeeGroupMap.get(empId) : undefined);
                const deptName = row.hrmD_DepartmentName || (deptId ? departmentMap.get(deptId) : undefined);
                const guestName = row.guest_Name || (guestId ? guestMap.get(guestId) : undefined);
                const catName = row.lmC_CategoryName || (catId ? categoryMap.get(catId) : undefined);

                const resolvedBookType = row.lbcpA_IssueRefFlg || row.lmB_BookType || row.catgname || (isNbp ? catName : 'Issue');

                return {
                    ...row,
                    LBCPA_Id: row.LBCPA_Id ?? row.lbcpA_Id ?? parentLbcpaId,
                    lbcpA_Id: row.lbcpA_Id ?? row.LBCPA_Id ?? parentLbcpaId,
                    param_Id: paramId,
                    circ_ActiveFlag: rowActiveFlag,
                    lbcpaS_ActiveFlg: rowActiveFlag,
                    param_ActiveFlg: rowActiveFlag,
                    lbcpA_ActiveFlg: rowActiveFlag,
                    type_Id: classId || empId || deptId || catId || guestId || row.type_Id,
                    type_Name: row.type_Name || className || empGroupName || deptName || guestName || catName,
                    asmcL_Id: classId || undefined,
                    asmcL_ClassName: className,
                    hrmgT_Id: empId || undefined,
                    hrmgT_EmployeeGroupType: empGroupName,
                    hrmD_Id: deptId || undefined,
                    hrmD_DepartmentName: deptName,
                    guest_Id: guestId || undefined,
                    guest_Name: guestName,
                    lmC_Id: catId || undefined,
                    lmC_CategoryName: catName,
                    lmB_BookType: resolvedBookType,
                    lbcpA_IssueRefFlg: resolvedBookType,
                    catgname: resolvedBookType,
                    BOOKFLAG: isNbp ? 'NBP' : 'BP',
                    lmB_BookTypeflag: isNbp ? 'NBP' : 'BP',
                    schclgflag: currentIssuer,
                    issuertype1: currentIssuer,
                    lbcpA_Flg: currentIssuer,
                    max_Issue_Items: maxItems,
                    max_Issue_Days: maxDays,
                    max_No_Renewals: maxRenew,
                    lbcpaS_NoOfItems: maxItems,
                    lbcpaS_IssueDays: maxDays,
                    lbcpaS_NoOfRenewals: maxRenew,
                    param_NoOfItems: maxItems,
                    param_IssueDays: maxDays,
                    param_NoOfRenewals: maxRenew
                };
            });
        }

        // 3. Fallback: Render master list from onload response for selected tab
        if (currentIssuer === 'STAFF' && employeeGroupList.length > 0) {
            return employeeGroupList.map((emp: any) => {
                const empId = Number(emp.hrmgT_Id ?? emp.hrmgt_id ?? emp.HRMGT_Id ?? 0);
                const empName = emp.hrmgT_EmployeeGroupType ?? emp.groupName;
                return {
                    hrmgT_Id: empId,
                    hrmgT_EmployeeGroupType: empName,
                    type_Id: empId,
                    type_Name: empName,
                    schclgflag: 'STAFF',
                    issuertype1: 'STAFF',
                    lbcpA_Flg: 'STAFF',
                    lmB_BookTypeflag: bookParameterFlag,
                    BOOKFLAG: bookParameterFlag,
                    lmB_BookType: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    lbcpA_IssueRefFlg: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    catgname: bookParameterFlag === 'BP' ? 'Issue' : (categoryListState[0]?.lmC_CategoryName || 'Non-Book'),
                    lmC_CategoryName: bookParameterFlag === 'NBP' ? (categoryListState[0]?.lmC_CategoryName || 'Non-Book') : undefined,
                    max_Issue_Items: defaultItems,
                    max_Issue_Days: defaultDays,
                    max_No_Renewals: defaultRenewals,
                    param_NoOfItems: defaultItems,
                    param_IssueDays: defaultDays,
                    param_NoOfRenewals: defaultRenewals,
                    circ_ActiveFlag: emp.hrmgT_ActiveFlag ?? true,
                    param_ActiveFlg: emp.hrmgT_ActiveFlag ?? true
                };
            });
        }

        if (currentIssuer === 'STUDENT' && classList.length > 0) {
            return classList.map((cls: any) => {
                const classId = Number(cls.asmcL_Id ?? cls.asmcl_id ?? cls.ASMCL_Id ?? 0);
                const className = cls.asmcL_ClassName ?? cls.className;
                return {
                    asmcL_Id: classId,
                    asmcL_ClassName: className,
                    type_Id: classId,
                    type_Name: className,
                    schclgflag: 'STUDENT',
                    issuertype1: 'STUDENT',
                    lbcpA_Flg: 'STUDENT',
                    lmB_BookTypeflag: bookParameterFlag,
                    BOOKFLAG: bookParameterFlag,
                    lmB_BookType: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    lbcpA_IssueRefFlg: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    catgname: bookParameterFlag === 'BP' ? 'Issue' : (categoryListState[0]?.lmC_CategoryName || 'Non-Book'),
                    lmC_CategoryName: bookParameterFlag === 'NBP' ? (categoryListState[0]?.lmC_CategoryName || 'Non-Book') : undefined,
                    max_Issue_Items: defaultItems,
                    max_Issue_Days: defaultDays,
                    max_No_Renewals: defaultRenewals,
                    param_NoOfItems: defaultItems,
                    param_IssueDays: defaultDays,
                    param_NoOfRenewals: defaultRenewals,
                    circ_ActiveFlag: cls.asmcL_ActiveFlag ?? true,
                    param_ActiveFlg: cls.asmcL_ActiveFlag ?? true
                };
            });
        }

        if (currentIssuer === 'DEPARTMENT' && departmentList.length > 0) {
            return departmentList.map((dept: any) => {
                const deptId = Number(dept.hrmD_Id ?? dept.hrmd_id ?? dept.HRMD_Id ?? 0);
                const deptName = dept.hrmD_DepartmentName ?? dept.departmentName;
                return {
                    hrmD_Id: deptId,
                    hrmD_DepartmentName: deptName,
                    type_Id: deptId,
                    type_Name: deptName,
                    schclgflag: 'DEPARTMENT',
                    issuertype1: 'DEPARTMENT',
                    lbcpA_Flg: 'DEPARTMENT',
                    lmB_BookTypeflag: bookParameterFlag,
                    BOOKFLAG: bookParameterFlag,
                    lmB_BookType: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    lbcpA_IssueRefFlg: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    catgname: bookParameterFlag === 'BP' ? 'Issue' : (categoryListState[0]?.lmC_CategoryName || 'Non-Book'),
                    max_Issue_Items: defaultItems,
                    max_Issue_Days: defaultDays,
                    max_No_Renewals: defaultRenewals,
                    param_NoOfItems: defaultItems,
                    param_IssueDays: defaultDays,
                    param_NoOfRenewals: defaultRenewals,
                    circ_ActiveFlag: dept.hrmD_ActiveFlag ?? true,
                    param_ActiveFlg: dept.hrmD_ActiveFlag ?? true
                };
            });
        }

        if (currentIssuer === 'GUEST' && guestList.length > 0) {
            return guestList.map((guest: any) => {
                const guestId = Number(guest.guest_Id ?? guest.guest_id ?? guest.guestId ?? 0);
                const guestName = guest.guest_Name ?? guest.guestName;
                return {
                    guest_Id: guestId,
                    guest_Name: guestName,
                    type_Id: guestId,
                    type_Name: guestName,
                    schclgflag: 'GUEST',
                    issuertype1: 'GUEST',
                    lbcpA_Flg: 'GUEST',
                    lmB_BookTypeflag: bookParameterFlag,
                    BOOKFLAG: bookParameterFlag,
                    lmB_BookType: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    lbcpA_IssueRefFlg: bookParameterFlag === 'BP' ? 'Issue' : undefined,
                    catgname: bookParameterFlag === 'BP' ? 'Issue' : (categoryListState[0]?.lmC_CategoryName || 'Non-Book'),
                    max_Issue_Items: defaultItems,
                    max_Issue_Days: defaultDays,
                    max_No_Renewals: defaultRenewals,
                    param_NoOfItems: defaultItems,
                    param_IssueDays: defaultDays,
                    param_NoOfRenewals: defaultRenewals,
                    circ_ActiveFlag: true,
                    param_ActiveFlg: true
                };
            });
        }

        if (bookParameterFlag === 'NBP' && categoryListState.length > 0) {
            return categoryListState.map((cat: any) => {
                const catId = Number(cat.lmC_Id ?? cat.lmc_id ?? cat.LMC_Id ?? 0);
                const catName = cat.lmC_CategoryName ?? cat.categoryName;
                return {
                    lmC_Id: catId,
                    lmC_CategoryName: catName,
                    type_Id: catId,
                    type_Name: catName,
                    lmB_BookTypeflag: 'NBP',
                    BOOKFLAG: 'NBP',
                    schclgflag: currentIssuer,
                    issuertype1: currentIssuer,
                    lbcpA_Flg: currentIssuer,
                    catgname: catName,
                    lbcpA_IssueRefFlg: catName,
                    max_Issue_Items: defaultItems,
                    max_Issue_Days: defaultDays,
                    max_No_Renewals: defaultRenewals,
                    param_NoOfItems: defaultItems,
                    param_IssueDays: defaultDays,
                    param_NoOfRenewals: defaultRenewals,
                    circ_ActiveFlag: cat.lmC_ActiveFlag ?? true,
                    param_ActiveFlg: cat.lmC_ActiveFlag ?? true
                };
            });
        }

        return [];
    }, [
        details,
        dynamicGridData,
        issuerType,
        bookParameterFlag,
        classList,
        employeeGroupList,
        departmentList,
        guestList,
        categoryListState,
        classMap,
        employeeGroupMap,
        departmentMap,
        guestMap,
        categoryMap
    ]);

    // Table Columns configuration
    const columns = useMemo(
        () =>
            createCirculationParameterColumns({
                onEdit: (data: any) => {
                    const rowId = Number(data.param_Id ?? data.Parmeter_Id ?? data.parmeter_Id ?? data.lbcpaS_Id ?? data.LBCPAS_Id ?? data.circ_Id ?? data.lnbcpA_Id ?? 0);
                    setEditingId(rowId || null);

                    const isNbp = data.BOOKFLAG === 'NBP' || data.lmB_BookTypeflag === 'NBP';
                    const issuer = (data.lbcpA_Flg || data.issuertype1 || data.schclgflag || issuerType || 'STUDENT').toUpperCase();

                    form.reset({
                        id: rowId,
                        bookParameterFlag: isNbp ? 'NBP' : 'BP',
                        issuerType: issuer,
                        maxIssueItems: Number(data.max_Issue_Items ?? data.param_NoOfItems ?? 3),
                        maxIssueDays: Number(data.max_Issue_Days ?? data.param_IssueDays ?? 8),
                        maxRenewals: Number(data.max_No_Renewals ?? data.param_NoOfRenewals ?? 3),
                        status: data.circ_ActiveFlag ?? data.param_ActiveFlg ?? true,
                        bookType: !isNbp ? (data.lbcpA_IssueRefFlg || 'Issue') : undefined,
                        categoryId: isNbp ? (data.lmC_Id ?? data.type_Id) : undefined,
                        categoryName: isNbp ? data.lmC_CategoryName : undefined,
                        classId: issuer === 'STUDENT' ? (data.asmcL_Id ?? data.type_Id) : undefined,
                        employeeGroupId: issuer === 'STAFF' ? (data.hrmgT_Id ?? data.type_Id) : undefined,
                        departmentId: issuer === 'DEPARTMENT' ? (data.hrmD_Id ?? data.type_Id) : undefined,
                        guestId: issuer === 'GUEST' ? (data.guest_Id ?? data.type_Id) : undefined
                    });

                    if (typeof window !== 'undefined') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                },
                onToggleStatus: (data: any) => {
                    setToggleRow(data);
                }
            }),
        [form, issuerType]
    );

    // Confirm Toggle status handler
    const handleConfirmToggle = (data: CirculationParameterGridData) => {
        const isNbp = data.BOOKFLAG === 'NBP' || data.lmB_BookTypeflag === 'NBP';
        const issuer = (data.lbcpA_Flg || data.issuertype1 || data.schclgflag || issuerType || 'STUDENT').toUpperCase();

        const lbcpaId = isNbp
            ? 0
            : Number(data.LBCPA_Id ?? data.lbcpA_Id ?? data.lbcpa_Id ?? details?.LBCPA_Id ?? details?.lbcpA_Id ?? 0);

        const lnbcpaId = isNbp
            ? Number(data.LNBCPA_Id ?? data.lnbcpA_Id ?? data.lnbcpa_Id ?? details?.LNBCPA_Id ?? details?.lnbcpA_Id ?? 0)
            : 0;

        const resolvedParmeterId = Number(
            data.param_Id ??
            data.Parmeter_Id ??
            data.parmeter_Id ??
            data.lbcpaS_Id ??
            data.LBCPAS_Id ??
            data.lbcpaE_Id ??
            data.LBCPAE_Id ??
            data.lbcpaD_Id ??
            data.LBCPAD_Id ??
            data.lbcpaG_Id ??
            data.LBCPAG_Id ??
            data.lnbcpaS_Id ??
            data.LNBCPAS_Id ??
            data.circ_Id ??
            0
        );

        const schoolCollegeFlag =
            data.MI_SchoolCollegeFlag ||
            data.mI_SchoolCollegeFlag ||
            details?.mI_SchoolCollegeFlag ||
            details?.MI_SchoolCollegeFlag ||
            'S';

        const currentActiveStatus =
            data.param_ActiveFlg ??
            data.circ_ActiveFlag ??
            data.lbcpaS_ActiveFlg ??
            data.lbcpa_ActiveFlg ??
            data.lbcpA_ActiveFlg ??
            data.lnbcpa_ActiveFlg ??
            true;

        toggleStatusMutation.mutate(
            {
                LBCPA_Id: Number(lbcpaId),
                LNBCPA_Id: Number(lnbcpaId),
                Parmeter_Id: Number(resolvedParmeterId),
                BOOKFLAG: isNbp ? 'NBP' : 'BP',
                issuertype1: issuer,
                MI_SchoolCollegeFlag: schoolCollegeFlag,
                currentActiveStatus
            },
            {
                onSuccess: () => {
                    setToggleRow(null);
                    refetchDetails();
                },
                onError: () => {
                    setToggleRow(null);
                }
            }
        );
    };

    // Form submission handler
    const onSubmit = async (values: CirculationParameterFormValues) => {
        const isNbp = values.bookParameterFlag === 'NBP';
        const catgName = isNbp
            ? (values.categoryName || categoryListState.find((c: any) => (c.lmC_Id ?? c.lmc_id) === values.categoryId)?.lmC_CategoryName || 'Non-Book')
            : (values.bookType || 'Issue');

        const payload: CirculationParameterPayload = {
            lbcpa_Id: Number(editingId || 0),
            asmcl_Id: values.issuerType === 'STUDENT' ? Number(values.classId || 0) : 0,
            lmc_Id: isNbp ? Number(values.categoryId || 0) : 0,
            hrmgt_Id: values.issuerType === 'STAFF' ? Number(values.employeeGroupId || 0) : 0,
            hrmd_Id: values.issuerType === 'DEPARTMENT' ? Number(values.departmentId || 0) : 0,
            guest_Id: values.issuerType === 'GUEST' ? Number(values.guestId || 0) : 0,
            max_Issue_Items: Number(values.maxIssueItems || 0),
            max_Issue_Days: Number(values.maxIssueDays || 0),
            max_No_Renewals: Number(values.maxRenewals || 0),
            issuertype1: values.issuerType || 'STUDENT',
            catgname: catgName,
            bookflag: isNbp ? 'NBP' : 'BP',
            lbcpa_ExcludeHolidayFlg: true,
            ivrmul_Id: Number(details?.ivrmuL_Id || details?.IVRMUL_Id || 1),
            mi_Id: Number(details?.mI_Id || details?.MI_Id || 1)
        };

        saveMutation.mutate(payload, {
            onSuccess: () => {
                form.reset(defaultFormValues);
                setEditingId(null);
                refetchDetails();
            }
        });
    };

    const handleCancel = () => {
        form.reset(defaultFormValues);
        setEditingId(null);
    };

    return (
        <div className='container mx-auto space-y-6 py-6'>
            <FormProvider {...form}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='overflow-hidden rounded-lg border border-t-4 border-t-orange-400 bg-white shadow-sm'>
                            <div className='bg-[#4251b1] px-4 py-2 font-semibold text-sm text-white'>CIRCULATION PARAMETER</div>
                            <div className='p-6'>
                                <CirculationParameterForm
                                    categoryList={categoryListState}
                                    bookTypeList={bookTypeList}
                                    classList={classList}
                                    departmentList={departmentList}
                                    employeeGroupList={employeeGroupList}
                                    guestList={guestList}
                                />
                                <div className='mt-8 flex justify-center gap-4'>
                                    <Button
                                        type='submit'
                                        disabled={saveMutation.isPending}
                                        className='h-8 w-auto min-w-[120px] rounded-sm bg-[#4251b1] px-8 py-1 text-white text-xs shadow-sm hover:bg-[#35418e]'>
                                        {saveMutation.isPending ? (
                                            <Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
                                        ) : (
                                            <Save className='mr-1.5 h-3.5 w-3.5' />
                                        )}
                                        {editingId ? 'UPDATE' : 'SAVE'}
                                    </Button>
                                    <Button
                                        type='button'
                                        onClick={handleCancel}
                                        className='h-8 w-auto min-w-[120px] rounded-sm bg-[#ff5a30] px-8 py-1 text-white text-xs shadow-sm hover:bg-[#e64d26]'>
                                        <XCircle className='mr-1.5 h-3.5 w-3.5' />
                                        CANCEL
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </FormProvider>

            <div className='overflow-hidden rounded-lg border border-t-4 border-t-orange-400 bg-white shadow-sm'>
                <div className='bg-[#4251b1] px-4 py-2 font-semibold text-sm text-white'>CIRCULATION PARAMETER LIST</div>
                <div className='p-6'>
                    <GenericDataTable columns={columns as any} data={gridData} isLoading={isDetailsLoading} />
                </div>
            </div>

            {/* Toggle Status Confirmation Dialog */}
            <ToggleCirculationParameterDialog
                isOpen={!!toggleRow}
                rowData={toggleRow}
                isLoading={toggleStatusMutation.isPending}
                onClose={() => setToggleRow(null)}
                onConfirm={handleConfirmToggle}
            />
        </div>
    );
}
