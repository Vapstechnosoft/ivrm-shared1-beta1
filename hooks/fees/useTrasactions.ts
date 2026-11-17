import { FEES_QUERY_KEYS } from '@/constants/query-keys';
import { getModeOfPayment } from '@/server/fees/masters/modeOfPayment';
// import { getFeeStudentTransactionDetails } from '@/server/fees/trasactions/fee_student_transaction';

import { getAcademicYearDropdownData, getAmountEntry } from '@/server/fees/trasactions/feeAmountEntry';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
    getConcessionAcademicDropdownData,
    getConcessionCategoryDropdownData,
    getConcessionClassesDropdownData,
    getConcessionFeeConcessionCategoryDropdownData,
    getConcessionHeadDetailsList,
    getConcessionStudentConcessionGrid,
    getConcessionStudentList,
    getConcessionTermDropdownData,
    getFeeConcessionAdmissionNo,
    getFeeConcessionEdit,
    getFeeConcessionOthersList,
    getFeeConcessionStaffList,
    getFeesCommonSettingConfigSet,
    getFeesConcessionStudentData
} from '@/server/fees/trasactions/FeeConcession';
import { getAcademicYearDropdownDatastthomas, getAmountEntrystthomas } from '@/server/fees/trasactions/feeAmountEntryStThomas';
import {
    getFeeAdjustmentFromHeadDropDown,
    getFeeAdjustmentGroupDropDown,
    getFeeAdjustmentToGroup,
    getFeeAdjustmentToHeadDropDown,
    getFeeAdjutmentGridList
} from '@/server/fees/trasactions/fee_adjustment';
import {
    getOpeningAcademicYearDropdownData,
    getOpeningBalanceList,
    getOpeningCategoryDropdownData,
    getOpeningClassDropdownData,
    getOpeningGroupDropdownData,
    getOpeningHeadDropdownData,
    getOpeningInstallmentDropdownData,
    getOpeningPDAList,
    getOpeningRefundable,
    getOpeningSectionDropdownData
} from '@/server/fees/trasactions/fee_opening_balance';
import { getFeeRefundableDetails } from '@/server/fees/trasactions/fee_refundable';
import {
    getFeeStudentTransactionDetails,
    masterconfiguration,
    updateFeeStudentCurrentAcademicDetails,
    updateFeeStudentTransactionDetails
} from '@/server/fees/trasactions/fee_student_transaction';
import { getFeeStudentTransactionDetailsstthomas } from '@/server/fees/trasactions/fee_transaction_stthomas';
import {
    getFeePreadmissionTransactionList,
    getFeeProspectusTransactionList,
    getPreadmissionStudentDropdownData
} from '@/server/fees/trasactions/feepreadmissiontrasaction';
import {
    getThirdPartyTrasaction,
    getThirdPartyTrasactionBankDropDown,
    getThirdPartyTrasactionGroupDropDown,
    getThirdPartyTrasactionHeadDropDown,
    getThirdPartyTrasactionStudentDropDown,
    get_Receipt_number,
    geteditThirdpartytrasaction
} from '@/server/fees/trasactions/thirdPartyTrasaction';
import { feeTransactionWaivedOff, getClassdetails, getsectiondetails } from '@/server/fees/trasactions/waived_off';
import type { ApiSearchparams } from '@/types';

export const useFeeAmountEntry = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_AMOUNT_ENTRY, searchParams ?? {}],
            queryFn: async () => getAmountEntry(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_AMOUNT_ENTRY]
            });
        }
    };
};

export const useacademicyerdropdowndatafee = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.ACADEMIC_DROPDOWN_FEES, searchParams ?? {}],
            queryFn: async () => getAcademicYearDropdownData(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.ACADEMIC_DROPDOWN_FEES]
            });
        }
    };
};

export const useopeningacademicyerdropdowndatafee = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_ACADEMIC_YEAR_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getOpeningAcademicYearDropdownData(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_ACADEMIC_YEAR_DROPDOWN]
            });
        }
    };
};

export const useopeningClassdropdowndatafee = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_CLASS_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getOpeningClassDropdownData(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_CLASS_DROPDOWN]
            });
        }
    };
};

export const useopeningSectiondropdowndatafee = (asmaY_Id: number, asmcL_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_SECTION_DROPDOWN, asmaY_Id, asmcL_Id, searchParams ?? {}],
            queryFn: async () => getOpeningSectionDropdownData(asmaY_Id, asmcL_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_SECTION_DROPDOWN]
            });
        }
    };
};

// export const useopeningHeaddropdowndatafee = (searchParams?: ApiSearchparams) => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.FEE_OPENING_HEAD_DROPDOWN, searchParams ?? {}],
//             queryFn: async () => getOpeningHeadDropdownData(),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.FEE_OPENING_HEAD_DROPDOWN]
//             });
//         }
//     };
// };

export const useopeningHeaddropdowndatafee = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_HEAD_DROPDOWN, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getOpeningHeadDropdownData(asmaY_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_HEAD_DROPDOWN]
            });
        }
    };
};

export const useopeningCategorydropdowndatafee = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_CATEGORY_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getOpeningCategoryDropdownData(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_CATEGORY_DROPDOWN]
            });
        }
    };
};

export const useopeningGroupdropdowndatafee = (fmH_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_GROUP_DROPDOWN, fmH_Id, searchParams ?? {}],
            queryFn: async () => getOpeningGroupDropdownData(fmH_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_GROUP_DROPDOWN]
            });
        }
    };
};

export const useopeningInstallmentdropdowndatafee = (asmaY_Id: number, fmG_id: number, fmH_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_INSTALLMENT_DROPDOWN, asmaY_Id, fmG_id, fmH_Id, searchParams ?? {}],
            queryFn: async () => getOpeningInstallmentDropdownData(asmaY_Id, fmG_id, fmH_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_INSTALLMENT_DROPDOWN]
            });
        }
    };
};
export const useMasterFeeTransactionWaiveOff = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_WAVIED_OFF, searchParams ?? {}],
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_WAVIED_OFF]
            });
        }
    };
};
export const useMasterFeeOpeningBalance = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();
    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_BALANCE, searchParams ?? {}],
            queryFn: async () => getModeOfPayment(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_BALANCE]
            });
        }
    };
};

export const useFeeThirdParty = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_TRASACTION, searchParams ?? {}],
            queryFn: async () => getThirdPartyTrasaction(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_TRASACTION]
            });
        }
    };
};

export const useGroupdropdowndatathirdpartytransaction = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_GROUPDROPDOWN, searchParams ?? {}],
            queryFn: async () => getThirdPartyTrasactionGroupDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_GROUPDROPDOWN]
            });
        }
    };
};

export const useHeaddropdowndatathirdpartytransaction = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_HEADDROPDOWN, searchParams ?? {}],
            queryFn: async () => getThirdPartyTrasactionHeadDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_HEADDROPDOWN]
            });
        }
    };
};

export const useBankdropdowndatathirdpartytransaction = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_BANKDROPDOWN, searchParams ?? {}],
            queryFn: async () => getThirdPartyTrasactionBankDropDown(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_BANKDROPDOWN]
            });
        }
    };
};

export const useFeePreadmissionTransactionList = (
    asmay_Id: number,
    searchParams?: Record<string, any> // ← Make sure it's object, not Promise
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                FEES_QUERY_KEYS.FEE_PREADMISSION_TRANSACTION_DETAILS,
                asmay_Id,
                searchParams ?? {} // ← This must be plain object
            ],
            queryFn: async () => getFeePreadmissionTransactionList(asmay_Id, searchParams),
            staleTime: 0,
            enabled: asmay_Id > 0 // ← Prevent API call when asmay_id=0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_PREADMISSION_TRANSACTION_DETAILS]
            });
        }
    };
};

export const usePreadmissionStudentDropdownData = (searchText: string, radiovalue: string, asmayId: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_PREADMISSION_STUDENT_DROPDOWN, {}],
            queryFn: async () => getPreadmissionStudentDropdownData(searchText, radiovalue, asmayId),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_PREADMISSION_STUDENT_DROPDOWN]
            });
        }
    };
};

//hooks/fees/useTrasactions.ts

export const useFeeTransactionList = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TRANSACTION, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getFeeStudentTransactionDetails(asmaY_Id, searchParams)
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TRANSACTION]
            })
    };
};

// export const useStudentdowndatathirdpartytransaction = (asmaY_Id: number) => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_STUDENTDROPDOWN],
//             queryFn: async () => getThirdPartyTrasactionStudentDropDown(asmaY_Id),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_STUDENTDROPDOWN]
//             });
//         }
//     };
// };

export const useStudentdowndatathirdpartytransaction = (asmaY_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_STUDENTDROPDOWN],
            queryFn: async () => getThirdPartyTrasactionStudentDropDown(asmaY_Id),

            //enabled: !!asmaY_Id, // 🔥 only run when academic year selected
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_STUDENTDROPDOWN]
            });
        }
    };
};

export const useget_Receipt_number = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_RECEIPTDATA, searchParams ?? {}],
            queryFn: async () => get_Receipt_number(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_RECEIPTDATA]
            });
        }
    };
};

export const useeditThirdpartytrasaction = (mi_id: number, asmaY_Id: number, fyp_id: number, options?: { enabled?: boolean }) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_EDITDATA],
            queryFn: async () => geteditThirdpartytrasaction(mi_id, asmaY_Id, fyp_id),
            enabled: options?.enabled ?? !!fyp_id,
            //enabled: !!asmaY_Id, // 🔥 only run when academic year selected
            staleTime: 0
        }),

        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_THIRDPARTY_EDITDATA]
            });
        }
    };
};

export const useSectiondropdowndatafee = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_SECTIONDROPDOWN_DETAILS, searchParams ?? {}],
            queryFn: async () => getsectiondetails(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_SECTIONDROPDOWN_DETAILS]
            });
        }
    };
};

export const useClassdropdowndatafee = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CLASSDROPDOWN_DETAILS, searchParams ?? {}],
            queryFn: async () => getClassdetails(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CLASSDROPDOWN_DETAILS]
            });
        }
    };
};

export const useFeeTransactionWaivedOffGrid = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_TRANSACTION_WAIVED_OFF_grid, searchParams ?? {}],
            queryFn: async () => feeTransactionWaivedOff(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_TRANSACTION_WAIVED_OFF_grid]
            });
        }
    };
};

export const useFeeOpeningBalanceList = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_BALANCE_LIST, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getOpeningBalanceList(asmaY_Id, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_BALANCE_LIST]
            });
        }
    };
};
export const useFeeOpeningPDAList = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_PDA_LIST, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getOpeningPDAList(asmaY_Id, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_PDA_LIST]
            });
        }
    };
};
export const useFeeOpeningRefundable = (asmaY_Id: number, filterrefund: string, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_OPENING_REFUNDABLE, asmaY_Id, filterrefund, searchParams ?? {}],
            queryFn: async () => getOpeningRefundable(asmaY_Id, filterrefund),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_OPENING_REFUNDABLE]
            });
        }
    };
};

export const useconcessionacademicyerdropdowndatafee = (mi_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_ACADEMIC_YEAR_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getConcessionAcademicDropdownData(mi_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_ACADEMIC_YEAR_DROPDOWN]
            });
        }
    };
};

export const useFeeConcessionTermDropdowndata = (groupOrTerm: string, asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_TERM_DROPDOWN, groupOrTerm, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getConcessionTermDropdownData(groupOrTerm, asmaY_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_TERM_DROPDOWN]
            });
        }
    };
};

export const useFeeRefundableList = (asmay_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_REFUNDABLE_LIST, asmay_Id, searchParams ?? {}],
            queryFn: async () => getFeeRefundableDetails(asmay_Id, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_REFUNDABLE_LIST]
            });
        }
    };
};

export const useFeeConcessionClassDropdowndata = (mi_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CLASS_DROPDOWN, mi_id, searchParams ?? {}],
            queryFn: async () => getConcessionClassesDropdownData(mi_id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CLASS_DROPDOWN]
            });
        }
    };
};
export const useFeeConcessionCategoryDropdowndata = (mi_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORYS_DROPDOWN, mi_id, searchParams ?? {}],
            queryFn: async () => getConcessionCategoryDropdownData(mi_id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORYS_DROPDOWN]
            });
        }
    };
};

export const useFeeConcessionHeadList = (mi_Id: number, asmaY_Id: number, asmcL_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_HEAD_LIST, mi_Id, asmaY_Id, asmcL_Id, searchParams ?? {}],
            //queryFn: async () => getConcessionHeadList(mi_Id, asmaY_Id, asmcL_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_HEAD_LIST]
            });
        }
    };
};

export const useFeeConcessionStudentList = (
    radiobtnvalue: string,
    asmaY_Id: number,
    asmcL_Id: number,
    amcId: number,
    fmccId: number,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STUDENT_LIST, radiobtnvalue, asmaY_Id, asmcL_Id, amcId, fmccId, searchParams ?? {}],
            queryFn: async () => getConcessionStudentList(radiobtnvalue, asmaY_Id, asmcL_Id, amcId, fmccId),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STUDENT_LIST]
            });
        }
    };
};

export const useFeeConcessionStudentConcessionGrid = (
    mi_Id: number,
    asmaY_Id: number,
    asmcL_Id: number,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STUDENT_GRID, mi_Id, asmaY_Id, asmcL_Id, searchParams ?? {}],
            queryFn: () => getConcessionStudentConcessionGrid(mi_Id, asmaY_Id, asmcL_Id, searchParams),
            staleTime: 0,
            enabled: !!mi_Id && !!asmaY_Id
        }),
        refetchAll: () => {
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STUDENT_GRID],
                exact: false
            });
        }
    };
};

export const useFeeConcessionHeadDetailsList = (
    asmaY_Id: number,
    amsT_Id: number,
    fmT_Id: number[],
    configSet: string,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_HEAD_LIST, asmaY_Id, amsT_Id, fmT_Id, configSet, searchParams ?? {}],
            queryFn: async () => getConcessionHeadDetailsList(asmaY_Id, amsT_Id, fmT_Id, configSet),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_HEAD_LIST]
            });
        }
    };
};

export const useFeeProspectusTransactionList = (
    asmay_Id: number,
    searchParams?: Record<string, any> // ← Make sure it's object, not Promise
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [
                FEES_QUERY_KEYS.FEE_PROSPECTUS_TRANSACTION_DETAILS,
                asmay_Id,
                searchParams ?? {} // ← This must be plain object
            ],
            queryFn: async () => getFeeProspectusTransactionList(asmay_Id, searchParams),
            staleTime: 0,
            enabled: asmay_Id > 0 // ← Prevent API call when asmay_id=0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_PROSPECTUS_TRANSACTION_DETAILS]
            });
        }
    };
};

export const useFeeConcessionConfigSet = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CONFIGSET, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getFeesCommonSettingConfigSet(asmaY_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CONFIGSET]
            });
        }
    };
};

export const useFeeConcessionStaffList = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STAFF_LIST, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getFeeConcessionStaffList(asmaY_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STAFF_LIST]
            });
        }
    };
};

export const useFeeConcessionOthersList = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_OTHERS_LIST, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getFeeConcessionOthersList(asmaY_Id),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_OTHERS_LIST]
            });
        }
    };
};

export const useFeeConcessionCategoryFeeConcessionDropdowndata = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORYS_FEE_CONCESSION_DROPDOWN, searchParams ?? {}],
            queryFn: async () => getConcessionFeeConcessionCategoryDropdownData(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_CATEGORYS_FEE_CONCESSION_DROPDOWN]
            });
        }
    };
};

export const useFeeAdjustment = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_GRIDDATA, searchParams ?? {}],
            queryFn: async () => getFeeAdjutmentGridList(searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_GRIDDATA]
            });
        }
    };
};

export const useFeeConcessionEdit = (asmaY_Id: number, fscI_ID: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_EDIT, asmaY_Id, fscI_ID, searchParams ?? {}],
            queryFn: async () => getFeeConcessionEdit(asmaY_Id, fscI_ID),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_EDIT]
            });
        }
    };
};

export const useFeeConcessionAdmissionNo = (asmaY_Id: number, searchfilter: string, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_ADMISSION_NO, asmaY_Id, searchfilter, searchParams ?? {}],
            queryFn: async () => getFeeConcessionAdmissionNo(asmaY_Id, searchfilter),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_ADMISSION_NO]
            });
        }
    };
};

export const useFeeConcessionStudentData = (asmaY_Id: number, amsT_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STUDENT_DATA, asmaY_Id, amsT_Id, searchParams ?? {}],
            queryFn: async () => getFeesConcessionStudentData(asmaY_Id, amsT_Id),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_CONCESSION_STUDENT_DATA]
            });
        }
    };
};

export const useFeeAdjustmentGroupDropDown = (filterrefund: string, asmaY_Id: number, amsT_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_GROUP_DROPDOWN, filterrefund, asmaY_Id, amsT_Id, searchParams ?? {}],
            queryFn: async () => getFeeAdjustmentGroupDropDown(filterrefund, asmaY_Id, amsT_Id),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_GROUP_DROPDOWN]
            });
        }
    };
};

export const useFeeAdjustmentHeadDropDown = (
    filterrefund: string,
    asmaY_Id: number,
    amsT_Id: number,
    fmG_id: number,
    searchParams?: ApiSearchparams
) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_HEAD_DROPDOWN, filterrefund, asmaY_Id, amsT_Id, fmG_id, searchParams ?? {}],
            queryFn: async () => getFeeAdjustmentFromHeadDropDown(filterrefund, asmaY_Id, amsT_Id, fmG_id),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_HEAD_DROPDOWN]
            });
        }
    };
};

export const useFeeAdjustmentToGroupDropDown = (asmaY_Id: number, amsT_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_TO_GROUP_DROPDOWN, asmaY_Id, amsT_Id, searchParams ?? {}],
            queryFn: async () => getFeeAdjustmentToGroup(asmaY_Id, amsT_Id),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_TO_GROUP_DROPDOWN]
            });
        }
    };
};

export const useFeeAdjustmentToHead = (asmaY_Id: number, amsT_Id: number, fmG_id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_TO_HEAD_DROPDOWN, asmaY_Id, amsT_Id, fmG_id, searchParams ?? {}],
            queryFn: async () => getFeeAdjustmentToHeadDropDown(asmaY_Id, amsT_Id, fmG_id),

            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_ADJUSTMENT_TO_HEAD_DROPDOWN]
            });
        }
    };
};

export const useFeeMasterConfiguration = () => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_MASTER_CONFIGURATION],
            queryFn: async () => masterconfiguration(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_MASTER_CONFIGURATION]
            });
        }
    };
};

export const useUpdateFeeTransactionList = (payload: any) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_UPDATE_TRANSACTION],
            queryFn: async () => updateFeeStudentTransactionDetails(payload)
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_UPDATE_TRANSACTION]
            })
    };
};

export const useFeeStudentCurrentAcademicDetails = (amst_Id: number, asmay_Id: number) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_CURRENT_ACADEMIC_DETAILS],
            queryFn: async () => updateFeeStudentCurrentAcademicDetails(amst_Id, asmay_Id)
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_CURRENT_ACADEMIC_DETAILS]
            })
    };
};

// export const useThirdPartyTrasactionfeeReceiptNoflg = (searchParams?: ApiSearchparams) => {
//     const queryClient = useQueryClient();

//     return {
//         ...useQuery({
//             queryKey: [FEES_QUERY_KEYS.THIRD_PARTY_AUTORECEIPT_FLG, searchParams ?? {}],
//             queryFn: async () => ThirdPartyTrasactionfeeReceiptNoflg(),
//             staleTime: 0
//         }),
//         refetchAll: () => {
//             return queryClient.invalidateQueries({
//                 queryKey: [FEES_QUERY_KEYS.THIRD_PARTY_AUTORECEIPT_FLG]
//             });
//         }
//     };
// };

export const useFeeAmountEntryforStThomas = (asmay_id?: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_AMOUNT_ENTRY_STTHOMAS, asmay_id, searchParams ?? {}],
            queryFn: async () => getAmountEntrystthomas(asmay_id, searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_AMOUNT_ENTRY_STTHOMAS]
            });
        }
    };
};

export const useacademicyerdropofStThomas = (searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.ACADEMIC_DROPDOWN_FEES_STTHOMAS, searchParams ?? {}],
            queryFn: async () => getAcademicYearDropdownDatastthomas(),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.ACADEMIC_DROPDOWN_FEES_STTHOMAS]
            });
        }
    };
};

export const useFeeTransactionListStThomas = (asmaY_Id: number, searchParams?: ApiSearchparams) => {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TRANSACTIONSTTHOMAS, asmaY_Id, searchParams ?? {}],
            queryFn: async () => getFeeStudentTransactionDetailsstthomas(asmaY_Id, searchParams)
        }),

        refetchAll: () =>
            queryClient.invalidateQueries({
                queryKey: [FEES_QUERY_KEYS.FEE_STUDENT_TRANSACTIONSTTHOMAS]
            })
    };
};
