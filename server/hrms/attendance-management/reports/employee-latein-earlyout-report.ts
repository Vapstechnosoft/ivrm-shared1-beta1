'use server';
import type { LIEORow } from '@/app/(root)/hrms/attendance-management/reports/employee-lateInEarlyOut-report/_components/columns';
import type { EmployeeLateInEarlyOutReportFilters } from '@/app/(root)/hrms/attendance-management/reports/employee-lateInEarlyOut-report/_components/filters';
import { createLocalCrud } from '@/lib/localdb';
export async function getEmployeeLateInEarlyOutReport(filters?: EmployeeLateInEarlyOutReportFilters) {
    const db = createLocalCrud<LIEORow>('attendance:lieo');
    const data = db.list();
    if (!filters) {
        return {
            success: true,
            data: data,
            message: 'Data fetched successfully'
        };
    }
    const filtered = data.filter((r) => {
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
                    : (r.employeeName || r.employee_name || '').toLowerCase().includes(filters.query.toLowerCase())
                : true;
        const okMode = filters.mode
            ? filters.mode === 'Late By'
                ? !!(r.lateBy || r.late_by)
                : filters.mode === 'Early Out'
                  ? !!(r.earlyOut || r.early_out)
                  : filters.mode === 'Late In Early Out'
                    ? !!(r.lateBy || r.late_by) && !!(r.earlyOut || r.early_out)
                    : true
            : true;
        return okType && okDept && okDesg && okDateFrom && okDateTo && okQuery && okMode;
    });
    return {
        success: true,
        data: filtered,
        message: 'Data fetched successfully'
    };
}
export async function getEmployeeLateInEarlyOutReportDropdowns() {
    const db = createLocalCrud<LIEORow>('attendance:lieo');
    const data = db.list();
    const types = [...new Set(data.map((d) => d.type).filter(Boolean))];
    const departments = [...new Set(data.map((d) => d.department))];
    const designations = [...new Set(data.map((d) => d.designation))];
    return {
        success: true,
        data: {
            types,
            departments,
            designations
        },
        message: 'Dropdown data fetched successfully'
    };
}
