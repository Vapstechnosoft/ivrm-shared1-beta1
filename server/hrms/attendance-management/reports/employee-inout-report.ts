'use server';
import type { InOutRow } from '@/app/(root)/hrms/attendance-management/reports/employee-inout-report/_components/columns';
import type { EmployeeInOutReportFilters } from '@/app/(root)/hrms/attendance-management/reports/employee-inout-report/_components/filters';
import { createLocalCrud } from '@/lib/localdb';
export async function getEmployeeInOutReport(filters?: EmployeeInOutReportFilters) {
    const db = createLocalCrud<InOutRow>('attendance:inout');
    const data = db.list();
    if (!filters) {
        return {
            success: true,
            data: data,
            message: 'Data fetched successfully'
        };
    }
    const filtered = data.filter((r) => {
        const okBranch = filters.branch ? r.branch === filters.branch : true;
        const okType = filters.type && filters.type.length > 0 && r.type ? filters.type.includes(r.type) : true;
        const okDept =
            filters.department && filters.department.length > 0 && r.department ? filters.department.includes(r.department) : true;
        const okDesg =
            filters.designation && filters.designation.length > 0 && r.designation ? filters.designation.includes(r.designation) : true;
        const okDateFrom = filters.fromDate && r.date ? new Date(r.date) >= new Date(filters.fromDate) : true;
        const okDateTo = filters.toDate && r.date ? new Date(r.date) <= new Date(filters.toDate) : true;
        const okQuery =
            filters.allOrIndividual === 'Individual' && filters.query
                ? filters.codeOrName === 'Code'
                    ? (r.employeeCode || r.employee_code || '').includes(filters.query)
                    : (r.employeeName || r.user_name || '').toLowerCase().includes(filters.query.toLowerCase())
                : true;
        const okTimeInOut = filters.timeInTimeOut
            ? filters.timeInTimeOut === 'Time In'
                ? !!(r.timeIn || r.time_in)
                : filters.timeInTimeOut === 'Time Out'
                  ? !!(r.timeOut || r.time_out)
                  : filters.timeInTimeOut === 'In Out'
                    ? !!(r.timeIn || r.time_in) && !!(r.timeOut || r.time_out)
                    : true
            : true;
        return okBranch && okType && okDept && okDesg && okDateFrom && okDateTo && okQuery && okTimeInOut;
    });
    return {
        success: true,
        data: filtered,
        message: 'Data fetched successfully'
    };
}
export async function getEmployeeInOutReportDropdowns() {
    const db = createLocalCrud<InOutRow>('attendance:inout');
    const data = db.list();
    const branches = [...new Set(data.map((d) => d.branch))];
    const departments = [...new Set(data.map((d) => d.department))];
    const designations = [...new Set(data.map((d) => d.designation))];
    return {
        success: true,
        data: {
            branches,
            departments,
            designations
        },
        message: 'Dropdown data fetched successfully'
    };
}
