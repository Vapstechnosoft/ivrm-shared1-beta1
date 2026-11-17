import type { employeeInOutReportFilterSchema } from '@/schemas/hrms/attendance-management-schemas';
import type { z } from 'zod';

export type EmployeeInOutReportFilters = z.infer<typeof employeeInOutReportFilterSchema>;
