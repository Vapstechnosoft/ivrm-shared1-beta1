
'use client';

import React, { useState } from 'react';
import { useStaffFeeDefaulterReport } from '@/hooks/staff-portal/useStaffFeeDefaulterReport';
import FeeDefaulterFilter from './_components/filter';
import FeeDefaulterTable from './_components/report-table';
import { toast } from 'sonner';
import { CreditCard, List } from 'lucide-react';
import type { IFeeDefaulterSearchRequest, IFeeDefaulterSearchResponse, IDefaulterStudent } from '@/types/staff-portal/fee-defaulter-report';

export default function StaffFeeDefaulterReportPage() {
    const {
        initialData,
        getClasses,
        getTerms,
        getSections,
        getGroups,
        search,
        saveRemark
    } = useStaffFeeDefaulterReport();

    const [searchData, setSearchData] = useState<IFeeDefaulterSearchResponse | null>(null);
    const [lastParams, setLastParams] = useState<IFeeDefaulterSearchRequest | null>(null);

    const handleSearch = (params: IFeeDefaulterSearchRequest) => {
        setLastParams(params);
        search.mutate(params, {
            onSuccess: (res) => {
                const hasData = res.data?.studentalldata?.length
                    || res.data?.groupalldata?.length
                    || res.data?.headalldata?.length
                    || res.data?.classalldata?.length;

                if (hasData) {
                    setSearchData(res.data);
                } else {
                    toast.error("No defaulter records found for the selected criteria");
                    setSearchData(null);
                }
            },
            onError: (err) => {
                toast.error("Error generating report: " + err);
            }
        });
    };

    const handleSaveRemarks = (students: IDefaulterStudent[]) => {
        if (!lastParams) return;
        saveRemark.mutate({ ASMAY_Id: lastParams.ASMAY_Id, remarkarray: students }, {
            onSuccess: (res) => {
                if (res.data?.message === 'Add') {
                    toast.success("Remarks saved successfully");
                    handleSearch(lastParams);
                } else {
                    toast.error(res.data?.message || "Failed to save remarks");
                }
            },
            onError: (err) => {
                toast.error("An error occurred while saving remarks: " + err);
            }
        });
    };

    return (
        <div className="container mx-auto p-4 space-y-8 min-h-screen pb-12">
            <div className="flex items-center gap-3 border-b pb-4 border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Fee Defaulter Report</h1>
                    <p className="text-sm text-muted-foreground">Detailed student fee pending analysis and management</p>
                </div>
            </div>

            <FeeDefaulterFilter
                initialData={initialData ?? undefined}
                isLoading={search.isPending}
                onSearch={handleSearch}
                onReset={() => setSearchData(null)}
                getClasses={async (y) => {
                    const res = await getClasses.mutateAsync(y);
                    return res.data?.fillclass || [];
                }}
                getTerms={async (y, r) => {
                    const res = await getTerms.mutateAsync({ asmaY_Id: y, reportType: r });
                    return res.data || { fillterms: [], customlist: [], grouplist: [] };
                }}
                getSections={async (y, c) => {
                    const res = await getSections.mutateAsync({ asmaY_Id: y, asmcL_Id: c });
                    return res.data?.fillsection || [];
                }}
                getGroups={async (ids, r) => {
                    const res = await getGroups.mutateAsync({ customIds: ids, reportType: r });
                    return res.data?.grouplist || [];
                }}
            />

            {searchData && lastParams && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between px-1 border-l-4 border-primary pl-4">
                        <h2 className="text-lg font-bold text-primary/80 uppercase tracking-wider">Report Results</h2>
                    </div>
                    <FeeDefaulterTable
                        data={searchData}
                        onSaveRemarks={handleSaveRemarks}
                        showRemarks={lastParams.radioval === 'FSW'}
                    />
                </div>
            )}

            {!searchData && !search.isPending && (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/5 border-primary/10 mx-auto max-w-2xl opacity-60">
                    <div className="bg-muted/10 p-4 rounded-full mb-4">
                        <List className="h-10 w-10 opacity-20" />
                    </div>
                    <p className="text-xl font-medium text-foreground/70">No report generated</p>
                    <p className="text-sm">Select criteria above and click 'Show Report' to view defaulter data.</p>
                </div>
            )}
        </div>
    );
}
