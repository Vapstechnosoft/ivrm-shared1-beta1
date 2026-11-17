import { ADMISSION_QUERY_KEYS, FEES_QUERY_KEYS } from '@/constants/query-keys';
import { getMasterClassCategory } from '@/server/fees/masters/class_category';

import { getClassCategory, getMasterClassYearlyCategory } from '@/server/fees/masters/class_yearly_category';

import { getAcademicYearDropdown } from '@/server/fees/masters/class_yearly_category';

import { getFeeTermHeadList, getheadsdropdown, getinstallmentsdropdown, gettermsdropdown } from '@/server/fees/masters/fee-term-heads';
import {
    getpaymentgatewayInstitutionName,
    getpaymentgateway_dropdown,
    getpaymentgatewaydetails
} from '@/server/fees/masters/fee_payment_gateway_details';
import {
    getFeePrevilegeList,
    getGroupsDropdown,
    getHeadDropDown,
    getRolesDropdown,
    getUserNameDropdown
} from '@/server/fees/masters/fee_previlege';
import { getfeehead } from '@/server/fees/masters/feehead';
import { getfeeInstallment, getfeeInstallmentyId } from '@/server/fees/masters/feeinstallment';

import { getMasterConcession } from '@/server/fees/masters/feemasterconcession';
import { getFeeTermList, getmasterFeeTermDropList } from '@/server/fees/masters/feemasterterms';
import { getMasterAllFeeHead, getMasterfeeInstallment, getMasterfeehead } from '@/server/fees/masters/yearly_group_mapping';

import { getGroupListCategory, getMasterYearlyCategory } from '@/server/fees/masters/fees_yearly_group';

import { getFeeTermHeadDueDateList } from '@/server/fees/masters/fee-term-head-duedate';

import {
    getFeeMasterGroupwiseAutoReceipt,
    getFeeMasterGroupwiseAutoReceiptGroupDropDown
} from '@/server/fees/masters/fee_master_groupwise_auto_receipt';

import {
    getConcessionCategoryGroupHeadMappingDetails,
    getcategorydropdowndropdown,
    getcategorygroupdropdown,
    getcategoryheadsdropdown
} from '@/server/fees/masters/concession_category_head_group_mapping';
import {
    getFeeCompanyGroupMappingCompanyDropdown,
    getFeesGroupDropDown,
    getfeecompanygroupmappingList
} from '@/server/fees/masters/fee_companygroupmapping';
import { getFeeOtherStudent } from '@/server/fees/masters/fee_other_student';
import { getMasterTermsPeriod } from '@/server/fees/masters/fee_terms_period';
import { getInstallmentDropDown, getfeeInstallmentDueDateList } from '@/server/fees/masters/feeinstallmentduedate';
import { getMasterFeeYearlyRebateSettinFacade } from '@/server/fees/masters/feeyearlyrebatesettingfacade';
import { getFineSlab } from '@/server/fees/masters/fineSlab';
import { getFeeGroup, getFeeGroupGrouping, groupgroupingdropdowndata } from '@/server/fees/masters/groupsgrouping';
import { getMasterGroup } from '@/server/fees/masters/master_group';
import { getMasterConcessionDetails, getconcessioncategorydropdown } from '@/server/fees/masters/masterconcessiondetails';
import { getModeOfPayment } from '@/server/fees/masters/modeOfPayment';
import {
    getClassDropDownList,
    getFeeOnlinePaymentHeadGroupTable,
    getGroupNameDropDownList,
    getHeadNameDropDownList,
    getInstitutionDetails,
    getOnlinePaymentHeadGroupInstallment,
    getSubMerchantDropDownList
} from '@/server/fees/masters/online_payment_head_group';
import { getFeeSpecialHeadDropdown, getfeespeecialheadList } from '@/server/fees/masters/specialfeehead';
import {
    getAdmClassCategorydropdown,
    getFeeBusAreadropdown,
    getFeeBusRoutingdropdown,
    getFeeCasteCategorydropdown,
    getFeeClassCategorydropdown,
    getSectionropdown,
    getStudentClassMapping,
    getStudentFeeGroupList,
    getStudentFeeGroupMapping,
    getStudentFeeGroupMappingAcademicYearDropdown,
    getclassdropdown
} from '@/server/fees/masters/student_fee_group_mapping';
import type { ApiSearchparams } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
export const useMasterFeehead = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_HEADS, searchParams ?? {}],
            queryFn: async () => getfeehead(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_HEADS]
            });
        }
    };
};

export const useMasterModeOfPayment = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MODEOFPAYMENT, searchParams ?? {}],
            queryFn: async () => getModeOfPayment(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MODEOFPAYMENT]
            });
        }
    };
};

export const useMasterPaymentgatewaydetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_PAYMENTGATEWAY_DETAILS, searchParams ?? {}],
            queryFn: async () => getpaymentgatewaydetails(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_PAYMENTGATEWAY_DETAILS]
            });
        }
    };
};

export const useMasterFineSlab = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_FINESLAB, searchParams ?? {}],
            queryFn: async () => getFineSlab(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_FINESLAB]
            });
        }
    };
};
//used

//dropdowns
export const useAcademicYearDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.ACADEMIC_DROPDOWN],
            queryFn: async () => getAcademicYearDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.ACADEMIC_DROPDOWN]
            });
        }
    };
};

//used
export const useClassCategoryDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CATEGORY_DROPDOWN],
            queryFn: async () => getClassCategory(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useGroupsDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.GROUPS_DROPDOWN],
            queryFn: async () => getGroupsDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.GROUPS_DROPDOWN]
            });
        }
    };
};

export const useUserNameDropdown = (ivrtmt_Id: number) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.GROUPS_DROPDOWN, ivrtmt_Id],
            queryFn: () => getUserNameDropdown(ivrtmt_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.GROUPS_DROPDOWN, ivrtmt_Id]
            });
        }
    };
};
export const useRolesDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.ROLES_DROPDOWN],
            queryFn: async () => getRolesDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.ROLES_DROPDOWN]
            });
        }
    };
};

export const useMasterClassCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterClassCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [ADMISSION_QUERY_KEYS.MASTER_CLASS_CATEGORY]
            });
        }
    };
};

export const useMasterGetYearlyCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterYearlyCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_CATEGORY]
            })
    };
};

export const useMasterYearlyCategory = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CLASS_YEARLY_CATEGORY, searchParams ?? {}],
            queryFn: async () => getMasterClassYearlyCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CLASS_YEARLY_CATEGORY]
            })
    };
};

export const useMasterFeeGroup = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_GROUP, searchParams ?? {}],
            queryFn: async () => getFeeGroup(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_GROUP]
            });
        }
    };
};

//installment fees

export const useMasterFeeInstallment = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT, searchParams ?? {}],
            queryFn: async () => getfeeInstallment(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT]
            });
        }
    };
};
export const useMasterFeeInstallmentyId = (fmi_id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT, fmi_id],
            queryFn: async () => getfeeInstallmentyId(fmi_id),
            enabled: !!fmi_id,
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT]
            });
        }
    };
};

//group

export const useMasterGroup = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.MASTER_GROUP, searchParams ?? {}],
            queryFn: async () => getMasterGroup(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.MASTER_GROUP]
            });
        }
    };
};

//due date

// export const useMasterFeeInstallmentDueDate = (searchParams?: ApiSearchparams) => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT_DUE_DATE, searchParams ?? {}],
//             queryFn: async () => getfeeInstallmentDueDate(searchParams),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT_DUE_DATE]
//             });
//         }
//     };
// };

export const useMasterFeeInstallmentDueDateList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT_DUE_DATE, searchParams ?? {}],
            queryFn: async () => getfeeInstallmentDueDateList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTALLMENT_DUE_DATE]
            });
        }
    };
};

export const useMasterFeeInstallmentDropDown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSATALLMENT_DROP_DOWN],
            queryFn: async () => getInstallmentDropDown()
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSATALLMENT_DROP_DOWN]
            });
        }
    };
};

export const useMasterFeeYearlyGroup = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_GROUPS, searchParams ?? {}],
            queryFn: async () => getMasterClassYearlyCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_GROUPS]
            });
        }
    };
};

// export const useFeeGroupDropdown = (searchParams?: ApiSearchparams) => {
//     const queryClient = useQueryClient();
//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_GROUPS, searchParams ?? {}],
//             queryFn: async () => getMasterClassYearlyCategory(searchParams),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_GROUPS]
//             });
//         }
//     };
// };

//term

export const useMasterConcession = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_CONCESSION, searchParams ?? {}],
            queryFn: async () => getMasterConcession(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_CONCESSION]
            });
        }
    };
};

export const useMasterTerms = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_TERMS, searchParams ?? {}],
            queryFn: async () => getFeeTermList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_TERMS]
            });
        }
    };
};

export const useMasterTermsDropdowndataOnlinegroupheadmapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_TERMS_DROPDOWN_GROUPHEADMAPPING, searchParams ?? {}],
            queryFn: async () => getmasterFeeTermDropList(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_TERMS_DROPDOWN_GROUPHEADMAPPING]
            });
        }
    };
};

export const useInstituteDropDown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_INSTITUTE_DROPDOWN],
            queryFn: async () => getInstitutionDetails(),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_INSTITUTE_DROPDOWN]
            });
        }
    };
};

export const useMasterTermsHead = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_TERMS_HEAD, searchParams ?? {}],
            queryFn: async () => getFeeTermHeadList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_TERMS_HEAD]
            });
        }
    };
};

export const MASTER_HEADS_DROPDOWN = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.MASTER_HEADS_DROP_DOWN],
            queryFn: async () => getheadsdropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.MASTER_HEADS_DROP_DOWN]
            });
        }
    };
};

export const TERM_DROPDOWN_DATA = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.TERM_DROP_DOWN_DATA],
            queryFn: async () => gettermsdropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.TERM_DROP_DOWN_DATA]
            });
        }
    };
};

export const MASTER_INSTALLMENT_DROPDOWN = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.MASTER_INSTALLMENT_DROPDOWN],
            queryFn: async () => getinstallmentsdropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.MASTER_INSTALLMENT_DROPDOWN]
            });
        }
    };
};

export const useMasterConcessionDetails = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_CONCESSION_DETAILS, searchParams ?? {}],
            queryFn: async () => getMasterConcessionDetails(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_CONCESSION_DETAILS]
            });
        }
    };
};

export const useMasterPaymentgateway_dropdown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_PAYMENTGATEWAY_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getpaymentgateway_dropdown(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_PAYMENTGATEWAY_DROPDOWN]
            });
        }
    };
};

export const useMasterGroupListDropDown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_GROUP_LIST_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getGroupListCategory(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_GROUP_LIST_DROPDOWN]
            });
        }
    };
};

//Group Grouping
export const useMasterFeeGroupDropdown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_GROUP_LIST_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getFeeGroup(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_GROUP_LIST_DROPDOWN]
            });
        }
    };
};

export const useMasterFeeGroupGrouping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_GROUP_GROUPING, searchParams ?? {}],
            queryFn: async () => getFeeGroupGrouping(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_GROUP_GROUPING]
            });
        }
    };
};

export const useFeePrevilegeList = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEES_PRIVILEGE_LIST, searchParams ?? {}],
            queryFn: async () => getFeePrevilegeList(searchParams),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEES_PRIVILEGE_LIST]
            });
        }
    };
};

export const useMasterFeeOnlinePaymentHeadGroupTable = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_TABLE, searchParams ?? {}],
            queryFn: async () => getFeeOnlinePaymentHeadGroupTable(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_TABLE]
            });
        }
    };
};

export const useMasterOnlinePaymentHeadGroup = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP],
            queryFn: async () => getAcademicYearDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP]
            });
        }
    };
};

export const useMasterOnlinePaymentHeadGroupClass = (academicYears?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_CLASS, academicYears ?? {}],
            queryFn: async () => getClassDropDownList(academicYears),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_CLASS]
            });
        }
    };
};

export const useMasterOnlinePaymentHeadGroupSubMerchant = (academicYears?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_SUB_MERCHANT, academicYears ?? {}],
            queryFn: async () => getSubMerchantDropDownList(academicYears),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_SUB_MERCHANT]
            });
        }
    };
};

export const useMasterOnlinePaymentHeadGroupGroupName = (academicYears?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_GROUPNAME, academicYears ?? {}],
            queryFn: async () => getGroupNameDropDownList(academicYears),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_GROUPNAME]
            });
        }
    };
};

export const useMasterOnlinePaymentHeadGroupHeadName = (academicYears?: number, groupName?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_HEADNAME, academicYears ?? {}],
            queryFn: async () => getHeadNameDropDownList(academicYears, groupName),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_HEADNAME]
            });
        }
    };
};

export const useMasterOnlinePaymentHeadGroupInstallment = (academicYears?: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_YEAR],
            queryFn: async () => getOnlinePaymentHeadGroupInstallment(academicYears),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ONLINE_PAYMENT_HEAD_GROUP_INSTALLMENT_YEAR]
            });
        }
    };
};

export const useFeeMasterHead = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_HEADS_DROPDOWN],
            queryFn: async () => getMasterfeehead(),
            staleTime: 0,
            retry: 1
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_HEADS_DROPDOWN]
            });
        }
    };
};

export const useFeeMasterInstallment = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_INSTALLMENT_DROPDOWN],
            queryFn: async () => getMasterfeeInstallment(),
            staleTime: 0,
            retry: 1
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_INSTALLMENT_DROPDOWN]
            });
        }
    };
};

export const useMasterAllFeeHead = (asmay_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_GROUPWISE_AUTO_RECEIPT, asmay_Id, searchParams ?? {}],
            queryFn: async () => getMasterAllFeeHead(asmay_Id, searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_GROUPWISE_AUTO_RECEIPT]
            })
    };
};

export const useFeeMasterGroupwiseAutoReceipt = (asmay_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_GROUPWISE_AUTO_RECEIPT, asmay_Id, searchParams ?? {}],
            queryFn: async () => getFeeMasterGroupwiseAutoReceipt(asmay_Id, searchParams),
            staleTime: 0
        }),
        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_GROUPWISE_AUTO_RECEIPT]
            })
    };
};
export const useFeeMasterGroupwiseAutoReceiptDropDown = (academicYear: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_GROUPWISE_AUTO_RECEIPT_GROUP_DROPDOWN, academicYear],
            queryFn: async () => getFeeMasterGroupwiseAutoReceiptGroupDropDown(academicYear),
            enabled: !!academicYear,

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({});
        }
    };
};

export const useMasterTermsHeadDueDate = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_TERM_HEAD_DUEDATE, searchParams ?? {}],
            queryFn: async () => getFeeTermHeadDueDateList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_TERM_HEAD_DUEDATE]
            });
        }
    };
};

export const CONCESSION_CATEGORYDROPDOWN_DATA = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_DROPDOWN],
            queryFn: async () => getconcessioncategorydropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useConcessionCategoryGroupHeadmappingdata = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_GROUP_HEAD_MAPPING, searchParams ?? {}],
            queryFn: async () => getConcessionCategoryGroupHeadMappingDetails(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_GROUP_HEAD_MAPPING]
            });
        }
    };
};

export const CONCESSION_CATEGORYG_GROUP_DROPDOWN_DATA = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_GROUP__DROPDOWN],
            queryFn: async () => getcategorygroupdropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_GROUP__DROPDOWN]
            });
        }
    };
};

export const CONCESSION_CATEGORYG_HEADS_DROPDOWN_DATA = (groupId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_HEADS__DROPDOWN],
            queryFn: async () => getcategoryheadsdropdown(groupId),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_HEADS__DROPDOWN]
            });
        }
    };
};

export const CONCESSION_CATEGORYG_DROPDOWN_DATA = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_DROPDOWNDATADETAILS],
            queryFn: async () => getcategorydropdowndropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORY_DROPDOWNDATADETAILS]
            });
        }
    };
};

export const useHeadsByGroupAndAcademicYear = (asmay_Id: number, fmg_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.HEAD_DROP_DOWN],
            queryFn: async () => getHeadDropDown(asmay_Id, fmg_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.HEAD_DROP_DOWN]
            });
        }
    };
};

export const useMasterFeeYearlyRebateSettingFacade = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_REBATE_SETTINGS, searchParams ?? {}],
            queryFn: async () => getMasterFeeYearlyRebateSettinFacade(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_YEARLY_REBATE_SETTINGS]
            });
        }
    };
};

export const useMasterTermsPeriod = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_TERMS_PERIOD, searchParams ?? {}],
            queryFn: async () => getMasterTermsPeriod(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_TERMS_PERIOD]
            });
        }
    };
};

export const useStudentFeeGroupMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING, searchParams ?? {}],
            queryFn: async () => getStudentFeeGroupMapping(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING]
            });
        }
    };
};

// export const useFeeSyudentGroupHeadMapping = () => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_HEAD_MAPPING],
//             queryFn: async () => getStudentFeeGeoupHeadMapping(),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_HEAD_MAPPING]
//             });
//         }
//     };
// };

export const useStudentFeeGroupList = (academicYear: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_HEAD],
            queryFn: async () => getStudentFeeGroupList(academicYear),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_HEAD]
            });
        }
    };
};

export const useMasterStudentFeeGrouMappingAcademic = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_ACADEMIC_DROPDOWN],
            queryFn: async () => getStudentFeeGroupMappingAcademicYearDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_ACADEMIC_DROPDOWN]
            });
        }
    };
};

export const useStudentFeeGroupAdmiClassCategoryDropDown = (enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_ADM_CLASS_CATEGORY],
            queryFn: async () => getAdmClassCategorydropdown(),
            staleTime: 0,
            enabled
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_ADM_CLASS_CATEGORY]
            });
        }
    };
};
export const useStudentFeeGroupFeeClassCategoryDropDown = (enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_FEECLASS_CATEGORY_DROPDOWN],
            queryFn: async () => getFeeClassCategorydropdown(),
            staleTime: 0,
            enabled
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_FEECLASS_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useStudentFeeBusRoutingDropDown = (enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_BUS_ROUTING_DROPDOWN],
            queryFn: async () => getFeeBusRoutingdropdown(),
            staleTime: 0,
            enabled
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_BUS_ROUTING_DROPDOWN]
            });
        }
    };
};

export const useStudentFeeCasteRoutingDropDown = (enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_CASTE_CATEGORY_DROPDOWN],
            queryFn: async () => getFeeCasteCategorydropdown(),
            staleTime: 0,
            enabled
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_CASTE_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useStudentClassMapping = (
    academicyear: number,
    classId: number,
    sectionId: number,
    admCategoryId: number,
    radioFilter: string,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_CLASS_MAPPING, searchParams ?? {}],
            queryFn: async () => getStudentClassMapping(academicyear, classId, sectionId, admCategoryId, radioFilter, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_CLASS_MAPPING]
            });
        }
    };
};

export const useStudentClassDropDown = (enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_CLASS_DROP_DOWN],
            queryFn: async () => getclassdropdown(),
            staleTime: 0,
            enabled
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_CLASS_DROP_DOWN]
            });
        }
    };
};
export const useStudentSectionDropDown = (enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_SECTION_DROP_DOWN],
            queryFn: async () => getSectionropdown(),
            staleTime: 0,
            enabled
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_SECTION_DROP_DOWN]
            });
        }
    };
};

// export const useStudentFeeGroupList = () => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_HEAD],
//             queryFn: async () => getStudentFeeGroupList(),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_HEAD]
//             });
//         }
//     };
// };

export const useFeeOtherStudent = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OTHER_STUDENT, searchParams ?? {}],
            queryFn: async () => getFeeOtherStudent(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OTHER_STUDENT]
            });
        }
    };
};

export const useSpecialFeeHead = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_SPECIAL_FEE_HEAD, searchParams ?? {}],
            queryFn: async () => getfeespeecialheadList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_SPECIAL_FEE_HEAD]
            });
        }
    };
};

export const feeSpecialHeadDROPDOWN = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_SPECIAL_FEE_HEAD_DROPDOWN],
            queryFn: async () => getFeeSpecialHeadDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_SPECIAL_FEE_HEAD_DROPDOWN]
            });
        }
    };
};

export const useGroupGroupingGroupDropdowndta = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_GROUPGROUPING_GROUPDROPDOWN],
            queryFn: async () => groupgroupingdropdowndata(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_GROUPGROUPING_GROUPDROPDOWN]
            });
        }
    };
};

export const useStudentFeeBusAreaDropDown = (enabled = true) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_BUS_AREA_DROPDOWN],
            queryFn: async () => getFeeBusAreadropdown(),
            staleTime: 0,
            enabled
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.STUDENT_FEE_GROUP_MAPPING_BUS_AREA_DROPDOWN]
            });
        }
    };
};

export const useFeeCompanyGroupMapping = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUP_MAPPING, searchParams ?? {}],
            queryFn: async () => getfeecompanygroupmappingList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUP_MAPPING]
            });
        }
    };
};

export const feeCompanyFeeGroupMappingCompanyDropdown = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUP_MAPPING_COMPANY_DROPDOWN],
            queryFn: async () => getFeeCompanyGroupMappingCompanyDropdown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUP_MAPPING_COMPANY_DROPDOWN]
            });
        }
    };
};

export const feeCompanyFeeGroupMappingGroupDropdown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUPMAPPING_GROUP_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getFeesGroupDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUPMAPPING_GROUP_DROPDOWN]
            });
        }
    };
};

export const feeCompanyFeeGroupMappingCompanyCompanyDropdown = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUP_MAPPING, searchParams ?? {}],
            queryFn: async () => getFeesGroupDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_COMPANY_GROUP_MAPPING]
            });
        }
    };
};
export const useMasterPaymentInstitutionName = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_PAYMENTGATEWAY_INSTITUTION_NAME],
            queryFn: async () => getpaymentgatewayInstitutionName(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_PAYMENTGATEWAY_INSTITUTION_NAME]
            });
        }
    };
};
