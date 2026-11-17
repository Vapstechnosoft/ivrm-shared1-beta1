'use client';

import { useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { GenericDataTable } from '@/components/ui/view-data-table/view-generic-data-table';
import { getCumulativeReport } from '@/server/exam/exam-module/reports/cumulative-report';
import type { ApiSearchparams } from '@/types';
import type { ICumulativeReport, Institution, IMasterInstitution, IReportHeader, ISubject } from '@/types/exam/exam-module/report';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import CumulativeReportForm from './_components/add-form';
import CumulativeReportGridView from './_components/columns';
import CumulativeReportExcel from './_components/cumulative-report-excel';
import CumulativeReportPrintView from './_components/cumulative-report-printable';
import { RefreshCw } from 'lucide-react';
import { getMasterInstitution } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import { set } from 'date-fns';

export default function CumulativeReportPage() {
    const [reportData, setReportData] = useState<ICumulativeReport[]>([]);
    const [reportTableProsData, setReportTableProsData] = useState<any>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [headerInfo, setHeaderInfo] = useState<Partial<IReportHeader>>({});
    const [isReportVisible, setIsReportVisible] = useState(false);
    const [searchParams, setSearchParams] = useState<ApiSearchparams>({});
    const [currentPayload, setCurrentPayload] = useState<any>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [institution, setInstitution] = useState<IMasterInstitution | Institution | null>();

    const tableProps = useDataTableProps(reportTableProsData);
    const printRef = useRef<HTMLDivElement>(null);

    const [columnFlags, setColumnFlags] = useState({
        admno: false,
        regno: false,
        rollno: true,
        classrank: true,
        sectionrank: true,
        attendancedispaly: false
    });

    const handleReportSuccess = async (payload: any, setSearchParams: any) => {
        if (!payload) return;
        setIsGenerating(true);
        try {
            setCurrentPayload(payload);
            const res = await getCumulativeReport(payload, setSearchParams);
            const institudtion_res = await getMasterInstitution();
            const { data: institudtion_data } = institudtion_res;
            setInstitution(institudtion_data);
            const _result = Array.isArray(res.data) ? res.data[0] : res.data;
            if (!res?.success) {
                toast.error(res?.message || 'Failed to generate report');
                return;
            }

            const responseData = res.data;
            const rawList = Array.isArray(responseData) ? responseData : responseData?.cumulative_reportList || responseData?.data || [];

            if (!Array.isArray(rawList) || rawList.length === 0) {
                setReportData([]);
                setSubjects([]);
                setHeaderInfo({});
                setCurrentPayload({}); // Avoid loop on pagination if no data
                toast.error('No records found');
                return;
            }

            const subjMap = new Map<number, ISubject>();
            rawList.forEach((student: any) => {
                student.subjectsList?.forEach((s: any) => {
                    if (!subjMap.has(s.ismS_Id)) {
                        subjMap.set(s.ismS_Id, {
                            ismS_Id: s.ismS_Id,
                            ismS_SubjectName: s.ismS_SubjectName,
                            eyceS_AplResultFlg: s.eyceS_AplResultFlg ?? true,
                            type: s.eyceS_GradeDisplayFlg ? 'Grade' : 'Marks',
                            eyceS_MarksDisplayFlg: s.eyceS_MarksDisplayFlg ?? false,
                            eyceS_GradeDisplayFlg: s.eyceS_GradeDisplayFlg ?? false,
                            eyceS_SubjectOrder: s.eyceS_SubjectOrder ?? 999
                        });
                    }
                });
            });

            const subjectsList: ISubject[] = Array.from(subjMap.values()).sort(
                (a, b) => (a.eyceS_SubjectOrder ?? 999) - (b.eyceS_SubjectOrder ?? 999)
            );


            const formatted: ICumulativeReport[] = rawList.map((s: any) => {
                const fullName = [s.amsT_FirstName, s.amsT_MiddleName, s.amsT_LastName].filter(Boolean).join(' ').trim();

                return {
                    amsT_FirstName: fullName || 'Unknown',
                    amaY_RollNo: s.amaY_RollNo ?? null,
                    amsT_AdmNo: s.amsT_AdmNo ?? null,
                    amsT_RegistrationNo: s.amsT_RegistrationNo ?? null,
                    sub_list: (s.subjectsList ?? []).map((sub: any) => ({
                        ismS_Id: sub.ismS_Id,
                        estmpS_ObtainedMarks: sub.estmpS_ObtainedMarks ?? null,
                        estmpS_ObtainedGrade: sub.estmpS_ObtainedGrade ?? null,
                        estmpS_PassFailFlg: sub.estmpS_PassFailFlg ?? null
                    })),
                    estmP_TotalMaxMarks: s.estmP_TotalMaxMarks ?? null,
                    estmP_TotalObtMarks: s.estmP_TotalObtMarks ?? null,
                    estmP_Percentage: s.estmP_Percentage ?? null,
                    estmP_TotalGrade: s.estmP_TotalGrade ?? null,
                    estmP_Result: s.estmP_Result ?? 'Pass',
                    estmP_ClassRank: s.estmP_ClassRank ?? null,
                    estmP_SectionRank: s.estmP_SectionRank ?? null,
                    classheld: s.asA_ClassHeld ?? null,
                    classatt: s.asA_Class_Attended ?? null
                };
            });

            const first = { ...rawList[0], ...institudtion_data }
            const header: Partial<IReportHeader> = {
                mI_name: first?.mI_Name ?? 'Vidya Vikasa Vidya Samsthe (R)',
                yr: first?.asmaY_Year ?? '',
                cla: first?.asmcL_ClassName ?? '',
                sec: first?.asmC_SectionName ?? '',
                exmmid: first?.emE_ExamName ?? ''
            };

            const cfg = first?.exm_Configuration?.[0] ?? responseData.exm_Configuration?.[0] ?? {};

            setColumnFlags({
                admno: cfg.exmConfig_AdmnoColumnDisplay ?? false,
                regno: cfg.exmConfig_RegnoColumnDisplay ?? false,
                rollno: cfg.exmConfig_RollnoColumnDisplay ?? true,
                classrank: true,
                sectionrank: true,
                attendancedispaly: false
            });

            setSubjects(subjectsList);
            const formattedData = { ...res, data: formatted };
            setReportData(formatted);
            setReportTableProsData(formattedData);
            setIsReportVisible(true);
            setHeaderInfo(header);
            toast.success('Report generated successfully');
        } catch (e: any) {
            console.error('Report error:', e);
            toast.error(e?.message || 'Error generating report');
        } finally {
            setIsGenerating(false);
        }
    };


    // Re-fetch when pagination changes
    useEffect(() => {
        // Only fetch if we have a valid payload AND api params have changed from default/initial
        if (currentPayload && Object.keys(currentPayload).length > 0 && Object.keys(searchParams).length > 0) {
            handleReportSuccess(currentPayload, searchParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handlePrint = () => window.print();
    const handleApiSearchParms = (searchParams: ApiSearchparams) => {
        setSearchParams(searchParams);
    };

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <CollapsibleSection title='Cumulative Report' defaultOpen>
                <CumulativeReportForm onSuccess={handleReportSuccess} apiSearchParams={searchParams} isGenerating={isGenerating} />
            </CollapsibleSection>

            {isGenerating && (
                <div className='flex flex-col items-center justify-center space-y-4 py-12'>
                    <RefreshCw className='h-8 w-8 animate-spin text-secondary' />
                    <p className='text-muted-foreground text-sm'>Loading data...</p>
                </div>
            )}

            {
                isReportVisible && (
                    <CollapsibleSection title='Grid View' defaultOpen>
                        <div ref={printRef}>
                            {/* Print View */}
                            {institution && (
                                <CumulativeReportPrintView
                                    reportData={reportData}
                                    institution={institution}
                                    subjects={subjects}
                                    headerInfo={headerInfo}
                                    fontSize='medium'
                                    columnFlags={columnFlags}
                                />
                            )}

                            {/* Screen View */}
                            <CumulativeReportGridView
                                reportData={reportData}
                                subjects={subjects}
                                headerInfo={headerInfo}
                                columnFlags={columnFlags}
                                onPrint={handlePrint}
                            />

                            <div className='mt-6 flex justify-end print:hidden'>
                                <CumulativeReportExcel
                                    reportData={reportData}
                                    subjects={subjects}
                                    headerInfo={headerInfo}
                                    columnFlags={columnFlags}
                                />
                            </div>

                            <div className='mt-10'>
                                <GenericDataTable
                                    isLoading={false}
                                    {...tableProps}
                                    columns={[]}
                                    data={reportData}
                                    noDataTitle='No results.'
                                    noDataDescription='No student data matches the selected criteria.'
                                    showPagination={true}
                                    onSearchQueryChange={handleApiSearchParms}
                                    currentApiParams={searchParams}
                                />
                            </div>
                        </div>
                    </CollapsibleSection>
                )
            }
        </div >
    );
}
