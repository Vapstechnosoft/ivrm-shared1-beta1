
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Phone, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ISalarySlipMainItem } from '@/types/staff-portal/salary-slip';
import { format } from 'date-fns';

interface SalarySlipViewProps {
    data: ISalarySlipMainItem[];
    onCancel: () => void;
}

const SalarySlipView: React.FC<SalarySlipViewProps> = ({ data, onCancel }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
            {data.map((employee, index) => (
                <div key={index} className="print:m-0 print:p-0">
                    <Card id={`salary-slip-${index}`} className="print:border-0 print:shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between print:hidden">
                            <CardTitle className="text-lg">Employee Salary Slip</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Header Section */}
                            <div className="text-center space-y-2 pb-6 border-b">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={employee.institutionDetails.mI_Logo || '/images/logo.png'}
                                        alt="Logo"
                                        className="h-24 w-auto"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold uppercase text-primary">
                                    Salary Slip: {employee.selectedMonth} {employee.selectedYear}
                                </h2>
                            </div>

                            {/* Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                                <div className="space-y-3">
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Name</span>
                                        <span>: {employee.currentemployeeDetails.hrmE_EmployeeFirstName} {employee.currentemployeeDetails.hrmE_EmployeeMiddleName} {employee.currentemployeeDetails.hrmE_EmployeeLastName}</span>
                                    </div>
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Department</span>
                                        <span>: {employee.departmentName}</span>
                                    </div>
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Designation</span>
                                        <span>: {employee.designationName}</span>
                                    </div>
                                    {employee.currentemployeeDetails.hrmE_PFApplicableFlag && (
                                        <div className="flex border-b pb-1">
                                            <span className="font-semibold w-40">PF Ac No.</span>
                                            <span>: {employee.currentemployeeDetails.hrmE_UINumber}</span>
                                        </div>
                                    )}
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Bank Name</span>
                                        <span>: {employee.empsaldetail.hreS_BankCode}</span>
                                    </div>
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Bank Ac No.</span>
                                        <span>: {employee.empsaldetail.hreS_AccountNo}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Employee Code</span>
                                        <span>: {employee.currentemployeeDetails.hrmE_EmployeeCode}</span>
                                    </div>
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Date Of Joining</span>
                                        <span>: {employee.currentemployeeDetails.hrmE_DOJ ? format(new Date(employee.currentemployeeDetails.hrmE_DOJ), 'dd-MM-yyyy') : ''}</span>
                                    </div>
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">PAN No.</span>
                                        <span>: {employee.currentemployeeDetails.hrmE_PANCardNo}</span>
                                    </div>
                                    {employee.currentemployeeDetails.hrmE_ESIApplicableFlag && (
                                        <div className="flex border-b pb-1">
                                            <span className="font-semibold w-40">ESI Ac No.</span>
                                            <span>: {employee.currentemployeeDetails.hrmE_ESIAccNo}</span>
                                        </div>
                                    )}
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">Working Days</span>
                                        <span>: {employee.empsaldetail.hreS_WorkingDays}</span>
                                    </div>
                                    <div className="flex border-b pb-1">
                                        <span className="font-semibold w-40">LOP Days</span>
                                        <span>: {employee.empsaldetail.lopdays}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details Table */}
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted">
                                        <TableRow>
                                            <TableHead className="font-bold border-r">Earnings</TableHead>
                                            <TableHead className="text-right font-bold border-r">Amount</TableHead>
                                            <TableHead className="font-bold border-r">Deductions</TableHead>
                                            <TableHead className="text-right font-bold">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {employee.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="border-r">{item.HRMED_Name}</TableCell>
                                                <TableCell className="text-right border-r font-medium">
                                                    {item.Amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="border-r">{item.ds?.HRMED_Name || ''}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {item.ds?.Amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ''}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="bg-muted/50 font-bold">
                                            <TableCell className="border-r">Total</TableCell>
                                            <TableCell className="text-right border-r">
                                                {employee.totals[0].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="border-r">Total</TableCell>
                                            <TableCell className="text-right">
                                                {employee.totals[1].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Net Salary Section */}
                            <div className="space-y-4 pt-4">
                                <div className="text-xl font-bold flex gap-4">
                                    <span>Net Salary:</span>
                                    <span className="text-primary">₹ {employee.NetSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /-</span>
                                </div>
                                <div className="text-sm italic text-muted-foreground uppercase">
                                    Net Salary in Words : {employee.NetAmountInwords}
                                </div>
                            </div>

                            {/* Note Section */}
                            <div className="pt-8 border-t text-xs font-semibold text-center uppercase tracking-wider text-muted-foreground">
                                NOTE : Signature is not required because it is a computer generated statement.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons (Hidden on Print) */}
                    <div className="flex justify-center gap-4 mt-8 print:hidden">
                        <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="secondary">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Mail
                        </Button>
                        <Button variant="secondary">
                            <Phone className="h-4 w-4 mr-2" />
                            Send SMS
                        </Button>
                        <Button variant="outline" onClick={onCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalarySlipView;
