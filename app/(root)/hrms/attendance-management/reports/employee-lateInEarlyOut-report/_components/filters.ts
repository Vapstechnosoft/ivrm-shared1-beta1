import type { employeeLateInEarlyOutReportFilterSchema } from '@/schemas/hrms/attendance-management-schemas';
import type { z } from 'zod';

export type EmployeeLateInEarlyOutReportFilters = z.infer<typeof employeeLateInEarlyOutReportFilterSchema>;
