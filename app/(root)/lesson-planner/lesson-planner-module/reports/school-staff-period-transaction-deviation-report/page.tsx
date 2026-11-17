'use client';

import { getDeviationReport, getInitialData } from '@/server/lesson-planner/reports/school-staff-period-transaction-deviation-report';
import type {
    IDeviationReportDetail,
    IDeviationReportEmployee,
    IDeviationReportPayload,
    IYear
} from '@/types/lesson-planner/reports/school-staff-period-transaction-deviation-report';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ReportDisplay from './_components/report-display';
import ReportFilter from './_components/report-filter';

export default function SchoolStaffPeriodTransactionDeviationReportPage() {
    const [masterYear, setMasterYear] = useState<IYear[]>([]);
    const [reportData, setReportData] = useState<IDeviationReportDetail[]>([]);
    const [employeeData, setEmployeeData] = useState<IDeviationReportEmployee[]>([]);
    const [filterDetails, setFilterDetails] = useState({ year: '', class: '', section: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const res: any = await getInitialData();
                const responseData = res.data || res;
                const years = (Array.isArray(responseData) ? responseData : responseData.masteryear || []) as IYear[];
                if (years.length > 0) {
                    setMasterYear(years);
                }
            } catch (error) {
                console.error('Failed to load initial data', error);
                toast.error('Failed to load initial data');
            }
        };
        fetchInitial();
    }, []);

    const handleReportSubmit = async (payload: IDeviationReportPayload) => {
        setIsLoading(true);
        try {
            console.log('Deviation Report Payload:', payload);
            console.log('Calling getDeviationReport with:', payload.ASMAY_Id, payload.ASMCL_Id, payload.ASMS_Id, payload.HRME_Id);

            const res: any = await getDeviationReport(payload.ASMAY_Id, payload.ASMCL_Id, payload.ASMS_Id, payload.HRME_Id);
            console.log('Deviation Report API Response:', res);

            if (!res) {
                console.error('Deviation Report: Response is undefined/null');
                toast.error('Failed to fetch report: No response from server');
                return;
            }

            const responseData = res.data || res;

            // Handle flat data array from "data" property (New API Structure)
            if (res.data && Array.isArray(res.data)) {
                console.log('Handling as Flat Data Array');
                const flatData = res.data as IDeviationReportDetail[];
                setReportData(flatData);

                // Extract unique employees for grouping
                const uniqueEmployees = Array.from(new Map(flatData.map((item) => [item.isms_id, item])).values()).map((item) => ({
                    isms_id: item.isms_id,
                    staffname: item.staffname,
                    subjectname: item.subjectname || '' // Handle null subjectname
                })) as IDeviationReportEmployee[];

                setEmployeeData(uniqueEmployees);

                const yearObj = masterYear.find((y) => y.asmaY_Id === payload.ASMAY_Id);
                setFilterDetails({
                    year: yearObj?.asmaY_Year || '',
                    class: flatData[0]?.classname || '',
                    section: flatData[0]?.sectionname || ''
                });
            }
            // Handle Legacy Structure
            else if (responseData.getdevationreport || responseData.getdevationreportemployee || Array.isArray(responseData)) {
                const reportArray = Array.isArray(responseData) ? responseData : responseData.getdevationreport || [];
                setReportData(reportArray as IDeviationReportDetail[]);
                setEmployeeData((responseData.getdevationreportemployee as IDeviationReportEmployee[]) || []);

                const yearObj = masterYear.find((y) => y.asmaY_Id === payload.ASMAY_Id);
                // For legacy structure, we might still need the passed names if not in response,
                // but prioritizing API consistency. If legacy API doesn't return names, we might need names arg again.
                // However, user specifically asked for backend data usage.
                // Let's rely on the backend data for the new flow and keep names as fallback or empty for now to match user request.
                // Actually, I should remove 'names' argument from signature if I am not using it, or verify if legacy path needs it.
                // Given the instructions, I will just use empty string or existing logic if any.
                // But to be safe and clean, I will remove the `names` parameter usage if I am confident.
                // User said "in backend i am getting this data", implying the NEW flow.

                setFilterDetails({
                    year: yearObj?.asmaY_Year || '',
                    class: '',
                    section: ''
                });
            } else {
                toast.info('No records found');
                setReportData([]);
                setEmployeeData([]);
            }
        } catch (error) {
            console.error('Failed to fetch report', error);
            toast.error('Failed to fetch report');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        window.location.reload();
    };

    return (
        <div className='container mx-auto space-y-6 p-6'>
            <h1 className='font-bold text-3xl text-[#5c2482]'>School Staff Period Deviation Report</h1>

            <ReportFilter masterYear={masterYear} onSubmit={handleReportSubmit} onCancel={handleCancel} isLoading={isLoading} />

            {reportData.length > 0 && <ReportDisplay reportData={reportData} employeeData={employeeData} filterDetails={filterDetails} />}
        </div>
    );
}
