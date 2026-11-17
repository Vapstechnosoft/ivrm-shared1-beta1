'use client';

import { getInitialData, getTransactionReport } from '@/server/lesson-planner/reports/school-staff-period-transaction-report';
import type {
    ITransactionReportDetail,
    ITransactionReportEmployee,
    ITransactionReportPayload,
    IYear
} from '@/types/lesson-planner/reports/school-staff-period-transaction-report';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ReportDisplay from './_components/report-display';
import ReportFilter from './_components/report-filter';

export default function SchoolStaffPeriodTransactionReportPage() {
    const [masterYear, setMasterYear] = useState<IYear[]>([]);
    const [reportData, setReportData] = useState<ITransactionReportDetail[]>([]);
    const [employeeData, setEmployeeData] = useState<ITransactionReportEmployee[]>([]);
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

    const handleReportSubmit = async (payload: ITransactionReportPayload) => {
        setIsLoading(true);
        try {
            console.log('Transaction Report Payload:', payload);
            const res: any = await getTransactionReport(payload);
            console.log('Transaction Report API Response:', res);

            if (!res) {
                console.error('Transaction Report: Response is undefined/null');
                toast.error('Failed to fetch report: No response from server');
                return;
            }

            const responseData = res.data || res;

            // Handle flat data array from "data" property (New API Structure)
            if (res.data && Array.isArray(res.data)) {
                console.log('Handling as Flat Data Array');
                const flatData = res.data as ITransactionReportDetail[];
                setReportData(flatData);

                // Extract unique employees for grouping
                const uniqueEmployees = Array.from(new Map(flatData.map((item) => [item.isms_id, item])).values()).map((item) => ({
                    isms_id: item.isms_id,
                    staffname: item.staffname,
                    subjectname: item.subjectname || ''
                })) as ITransactionReportEmployee[];

                setEmployeeData(uniqueEmployees);

                const yearObj = masterYear.find((y) => y.asmaY_Id === payload.ASMAY_Id);
                setFilterDetails({
                    year: yearObj?.asmaY_Year || '',
                    class: flatData[0]?.classname || '',
                    section: flatData[0]?.sectionname || ''
                });
            }
            // Handle Legacy Structure
            else if (responseData.getreport || responseData.getreportemployee || Array.isArray(responseData)) {
                const reportArray = Array.isArray(responseData) ? responseData : responseData.getreport || [];
                setReportData(reportArray as ITransactionReportDetail[]);
                setEmployeeData((responseData.getreportemployee as ITransactionReportEmployee[]) || []);

                const yearObj = masterYear.find((y) => y.asmaY_Id === payload.ASMAY_Id);
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
            <h1 className='font-bold text-3xl text-[#5c2482]'>School Staff Period Transaction Report</h1>

            <ReportFilter masterYear={masterYear} onSubmit={handleReportSubmit} onCancel={handleCancel} isLoading={isLoading} />

            {reportData.length > 0 && <ReportDisplay reportData={reportData} employeeData={employeeData} filterDetails={filterDetails} />}
        </div>
    );
}
