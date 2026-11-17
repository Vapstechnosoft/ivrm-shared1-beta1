import { FEES_QUERY_KEYS } from '@/constants/query-keys';
import { getClassDropDown } from '@/server/fees/reports/daily_fee_collection_report';
import {
    FeesTermDropDownForReports,
    getAcademicYeardropdown,
    getFeesBusRoutesDropDown,
    getFeesCustomGroupDropDown,
    getFeesDefaulterReportClassList,
    getFeesDefaulterReportSectionList,
    getFeesGroupDropDown,
    getFeesTermDropDown,
    mastersettinglist
} from '@/server/fees/reports/fee_DefaulterReport';
import { getFeesconcessionOnLoadReport } from '@/server/fees/reports/fee_concession_report';
import {
    getFeeInstallmentReportBusRouteDropdown,
    getFeeInstallmentReportCategoryDropdown,
    getFeeInstallmentReportGropDropdown,
    getFeeInstallmentReportHeadDropdown,
    getFeeInstallmentReportTermDropdown
} from '@/server/fees/reports/fee_installment_report';
import { getfeeMonths } from '@/server/fees/reports/fee_monthendReport';
import { getFeeReceiptLogo } from '@/server/fees/reports/fee_receipt_report';
import { getFeesInstallmentDropDown, getFeesTranasctionInstallmentDropDown } from '@/server/fees/reports/fee_yearlyCollectionReport';
import {
    getFeesTermDropDownforStudentTermWiseReport,
    getFeesTermWiseReportClassList,
    getFeesTermWiseReportSectionList,
    gettermwiseAcademicYeardropdown
} from '@/server/fees/reports/feestudenttermwisepaidReport';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFeeDefaulterReport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_DEFAULTER_REPORT],
            queryFn: async () => getAcademicYeardropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_DEFAULTER_REPORT]
            });
        }
    };
};

export const useFeeGroupDefaulterreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_GROUP_DEFAULTER],
            queryFn: async () => getFeesGroupDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_GROUP_DEFAULTER]
            });
        }
    };
};

export const useFeeTermDefaulterreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_TERM_DEFAULTER],
            queryFn: async () => getFeesTermDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_TERM_DEFAULTER]
            });
        }
    };
};

export const useFeeTermDropDownDataForReports = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_TERM_DROPDOWNDATA_REPORTS],
            queryFn: async () => FeesTermDropDownForReports(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_TERM_DROPDOWNDATA_REPORTS]
            });
        }
    };
};

export const useFeeBusRouteDefaulterreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_BUS_ROUTES_DEFAULTER],
            queryFn: async () => getFeesBusRoutesDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_BUS_ROUTES_DEFAULTER]
            });
        }
    };
};

export const useFeeCustomGroupDefaulterreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CUSTOM_GROUP_DEFAULTER],
            queryFn: async () => getFeesCustomGroupDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CUSTOM_GROUP_DEFAULTER]
            });
        }
    };
};

export const useFeeClassListDefaulterreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CLASS_LIST_DEFAULTER],
            queryFn: async () => getFeesDefaulterReportClassList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CLASS_LIST_DEFAULTER]
            });
        }
    };
};

export const useFeeSectionListDefaulterreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_SECTION_LIST_DEFAULTER],
            queryFn: async () => getFeesDefaulterReportSectionList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_SECTION_LIST_DEFAULTER]
            });
        }
    };
};

export const useClassDropdownDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_REPORT_HEAD_DROPDOWN],
            queryFn: async () => getClassDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_REPORT_HEAD_DROPDOWN]
            });
        }
    };
};

export const useFeeInstallmentYearlyfeecollectionreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEES_REPORT_INSTLLMENT_DROPDOWN_YEARLYREPORT],
            queryFn: async () => getFeesInstallmentDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEES_REPORT_INSTLLMENT_DROPDOWN_YEARLYREPORT]
            });
        }
    };
};

export const useFeeTransInstallmentYearlyfeecollectionreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEES_REPORT_TRANSACTION_INSTLLMENT_DROPDOWN_YEARLYREPORT],
            queryFn: async () => getFeesTranasctionInstallmentDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEES_REPORT_TRANSACTION_INSTLLMENT_DROPDOWN_YEARLYREPORT]
            });
        }
    };
};

export const useMonthsDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MONTHEND_REPORT_MONTHS_DROPDOWN],
            queryFn: async () => getfeeMonths(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MONTHEND_REPORT_MONTHS_DROPDOWN]
            });
        }
    };
};

// export const feeReceiptReportHeadDROPDOWN = () => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.FEE_FEE_RECEIPT_REPORT_HEAD_DROPDOWN],
//             queryFn: async () => getFeeReceiptReportHeadDropdown(),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.FEE_FEE_RECEIPT_REPORT_HEAD_DROPDOWN]
//             });
//         }
//     };
// };

export const useFeeInstallmentreporttermDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_TERM_DROPDOWN],
            queryFn: async () => getFeeInstallmentReportTermDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_TERM_DROPDOWN]
            });
        }
    };
};

export const useFeeInstallmentreportCategoryDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_CATEGORY_DROPDOWN],
            queryFn: async () => getFeeInstallmentReportCategoryDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useFeeInstallmentreportGroupDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_GROUP_DROPDOWN],
            queryFn: async () => getFeeInstallmentReportGropDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_GROUP_DROPDOWN]
            });
        }
    };
};

export const useFeeInstallmentreportBusRouteDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_BUSROUTE_DROPDOWN],
            queryFn: async () => getFeeInstallmentReportBusRouteDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_BUSROUTE_DROPDOWN]
            });
        }
    };
};

export const useFeeInstallmentreportHeadDropdown = (academicYears: number, groupid: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_HEAD_DROPDOWN],
            queryFn: async () => getFeeInstallmentReportHeadDropdown(academicYears, groupid),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLEMNTREPORT_HEAD_DROPDOWN]
            });
        }
    };
};

export const useFeeStudentTermWisePaidReportAcademic = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_ACADEMIC_YEAR_DROP],
            queryFn: async () => gettermwiseAcademicYeardropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_ACADEMIC_YEAR_DROP]
            });
        }
    };
};

export const useFeeStudentTermWisePaidReportClassdrop = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_CLASS_YEAR_DROP],
            queryFn: async () => getFeesTermWiseReportClassList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_CLASS_YEAR_DROP]
            });
        }
    };
};

export const useFeeStudentTermWisePaidReportSectionDrop = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_SECTION_YEAR_DROP],
            queryFn: async () => getFeesTermWiseReportSectionList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_SECTION_YEAR_DROP]
            });
        }
    };
};

export const useFeeTermforStudentTermWiseReport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_TERM_LIST],
            queryFn: async () => getFeesTermDropDownforStudentTermWiseReport(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TERM_WISE_PAID_TERM_LIST]
            });
        }
    };
};

export const feeReceiptLogo = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_FEE_RECEIPT_REPORT_LOGO],
            queryFn: async () => getFeeReceiptLogo(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_FEE_RECEIPT_REPORT_LOGO]
            });
        }
    };
};

export const usemastersettinglist = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.MASTER_SETTING_LIST],
            queryFn: async () => mastersettinglist(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.MASTER_SETTING_LIST]
            });
        }
    };
};

export const useFeeConCessionOnLoadreport = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_ON_LOAD],
            queryFn: async () => getFeesconcessionOnLoadReport(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_ON_LOAD]
            });
        }
    };
};
