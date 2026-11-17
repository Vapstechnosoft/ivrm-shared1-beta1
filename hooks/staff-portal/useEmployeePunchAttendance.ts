import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
    getEmployeePunchAttendanceInitialData,
    getEmployeePunchAttendanceReport,
} from '@/server/staff-portal/biometric-report/employee-punch-attendance.actions';
import {
    IEmployeeDetails,
    IPunchDetail,
} from '@/types/staff-portal/biometric-report/employee-punch-attendance.types';

const formSchema = z.object({
    fromdate: z.date({
        required_error: 'From date is required.',
    }),
    todate: z.date({
        required_error: 'To date is required.',
    }),
});

export type EmployeePunchAttendanceFormValues = z.infer<typeof formSchema>;

export const useEmployeePunchAttendance = () => {
    const [employeeDetails, setEmployeeDetails] = useState<IEmployeeDetails | null>(
        null
    );
    const [reportData, setReportData] = useState<IPunchDetail[]>([]);
    const [showReport, setShowReport] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<EmployeePunchAttendanceFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromdate: undefined,
            todate: undefined,
        },
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getEmployeePunchAttendanceInitialData();
                if (response.data?.filldepartment && response.data.filldepartment.length > 0) {
                    setEmployeeDetails(response.data.filldepartment[0]);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };
        fetchInitialData();
    }, []);

    const onReportSubmit = async (values: EmployeePunchAttendanceFormValues) => {
        setIsLoading(true);
        setShowReport(false);
        try {
            const payload = {
                fromdate: format(values.fromdate, 'yyyy-MM-dd'),
                todate: format(values.todate, 'yyyy-MM-dd'),
            };
            const response = await getEmployeePunchAttendanceReport(payload);
            if (
                response.data &&
                response.data.emp_punchDetails &&
                response.data.emp_punchDetails.length > 0
            ) {
                setReportData(response.data.emp_punchDetails);
                setShowReport(true);
            } else {
                setReportData([]);
                setShowReport(false);
                // Toast or alert can be added here
                alert('No Record Found');
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        employeeDetails,
        reportData,
        showReport,
        isLoading,
        onReportSubmit,
    };
};
