'use client';

import { useEmployeePunchAttendance } from '@/hooks/staff-portal/useEmployeePunchAttendance';
import { EmployeePunchAttendanceFilter } from './_components/employee-punch-attendance-filter';
import { EmployeePunchAttendanceView } from './_components/employee-punch-attendance-view';

export default function EmployeePunchAttendancePage() {
    const {
        form,
        employeeDetails,
        reportData,
        showReport,
        isLoading,
        onReportSubmit,
    } = useEmployeePunchAttendance();

    return (
        <div className='container mx-auto p-4 max-w-5xl'>
            <EmployeePunchAttendanceFilter
                form={form}
                employeeDetails={employeeDetails}
                onSubmit={onReportSubmit}
                isLoading={isLoading}
            />
            {showReport && <EmployeePunchAttendanceView data={reportData} />}
        </div>
    );
}
