'use server';

import { api } from "@/lib/apiService";

export async function getCoeMonthEndReport(payload: any) {
  const url = '/coe_report/coe_month_end_report';
  return await api.post<any[]>('coe', url, payload);
}