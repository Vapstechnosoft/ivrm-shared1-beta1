'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { exportToExcel } from '@/lib/export-to-file';
import {
    getInitialData,
    getReportDetails,
    resetStudentPassword,
    sendEmail,
    sendSMS,
    sendWhatsApp
} from '@/server/alumni/student-password-creation';
import type { IClass, ICredentialStudent, ISection, IYear } from '@/types/alumni/student-password-creation';
import { FileSpreadsheet, Loader2, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getStudentPasswordCreationColumns } from './_components/columns';
import FilterForm from './_components/filter-form';
import StudentCredentialsReport from './_components/student-credentials-report';

export default function StudentPasswordCreationPage() {
    const [initialLoading, setInitialLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [years, setYears] = useState<IYear[]>([]);
    const [classes, setClasses] = useState<IClass[]>([]);
    const [sections, setSections] = useState<ISection[]>([]);
    const [students, setStudents] = useState<ICredentialStudent[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<ICredentialStudent[]>([]);
    const [filterParams, setFilterParams] = useState<any>(null);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const res = await getInitialData();
                // Assuming res is the body and has success property based on common API pattern
                if (res && (res as any).success !== false) {
                    // flexible check
                    setYears((res as any).yearList || (res as any).data?.yearList || []);
                    setClasses((res as any).classlist || (res as any).data?.classlist || []);
                    setSections((res as any).sectionlist || (res as any).data?.sectionlist || []);
                } else {
                    // Fallback if structure is different
                    if ((res as any).yearList) {
                        setYears((res as any).yearList);
                        setClasses((res as any).classlist || []);
                        setSections((res as any).sectionlist || []);
                    } else {
                        toast.error((res as any).message || 'Failed to load initial data');
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch initial data');
            }
            setInitialLoading(false);
        };
        fetchInitial();
    }, []);

    const handleReportDetails = async (values: any) => {
        setTableLoading(true);
        setFilterParams(values);
        try {
            const res = await getReportDetails({
                asmaY_Id: Number.parseInt(values.asmaY_Id),
                asmcL_Id: Number.parseInt(values.asmcL_Id),
                asmS_Id: values.asmS_Id ? Number.parseInt(values.asmS_Id) : 0,
                filterdata: values.filterdata
            });
            if (res && (res as any).success !== false) {
                // API usually returns success: true.
                const data = (res as any).data || res; // Handle if data is directly returned or in .data
                if (Array.isArray(data)) {
                    setStudents(data);
                } else if (data && Array.isArray(data.data)) {
                    setStudents(data.data);
                } else {
                    setStudents([]);
                    if ((res as any).message)
                        toast.warning((res as any).message); // Use message from API if available
                    else if (data && data.length === 0) toast.warning('No records found');
                }
            } else {
                toast.error((res as any).message || 'Failed to fetch details');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching details');
        }
        setTableLoading(false);
    };

    const handleResetPassword = async (student: ICredentialStudent) => {
        try {
            const res = await resetStudentPassword(student, selectedStudents);
            if ((res as any).message === 'Success' || (res as any).success) {
                toast.success((res as any).message || 'Password Reset Successfully');
                // Re-fetch report to update data
                if (filterParams) handleReportDetails(filterParams);
            } else {
                toast.error((res as any).message || 'Failed to reset password');
            }
        } catch (error) {
            toast.error('Failed to reset password');
        }
    };

    const handleSendSMS = async () => {
        if (selectedStudents.length === 0) {
            toast.warning('Please select atleast one student');
            return;
        }
        try {
            const res = await sendSMS(filterParams.filterdata, selectedStudents);
            if ((res as any).success === 'success' || (res as any).success === true)
                toast.success((res as any).message || 'SMS Sent Successfully');
            else toast.error((res as any).message || 'Failed to send SMS');
        } catch (error) {
            toast.error('Failed to send SMS');
        }
    };

    const handleSendEmail = async () => {
        if (selectedStudents.length === 0) {
            toast.warning('Please select atleast one student');
            return;
        }
        try {
            const res = await sendEmail(filterParams.filterdata, selectedStudents);
            if ((res as any).success === 'success' || (res as any).success === true)
                toast.success((res as any).message || 'Email Sent Successfully');
            else toast.error((res as any).message || 'Failed to send Email');
        } catch (error) {
            toast.error('Failed to send Email');
        }
    };

    const handleSendWhatsApp = async () => {
        if (selectedStudents.length === 0) {
            toast.warning('Please select atleast one student');
            return;
        }
        try {
            const res = await sendWhatsApp(filterParams.filterdata, selectedStudents);
            if ((res as any).success === 'success' || (res as any).success === true)
                toast.success((res as any).message || 'WhatsApp Sent Successfully');
            else toast.error((res as any).message || 'Failed to send WhatsApp');
        } catch (error) {
            toast.error('Failed to send WhatsApp');
        }
    };

    const columns = getStudentPasswordCreationColumns(handleResetPassword);

    return (
        <div className='container space-y-8 p-6'>
            <div className='flex items-center justify-between border-b pb-4'>
                <div>
                    <h1 className='font-bold text-3xl tracking-tight'>Student Password Creation</h1>
                    <p className='text-muted-foreground text-sm'>Search and manage student credentials</p>
                </div>
            </div>

            <CollapsibleSection title='Search Filters' defaultOpen={true}>
                {initialLoading ? (
                    <div className='flex h-32 items-center justify-center'>
                        <Loader2 className='h-8 w-8 animate-spin text-primary' />
                    </div>
                ) : (
                    <FilterForm
                        years={years}
                        classes={classes}
                        sections={sections}
                        onSubmit={handleReportDetails}
                        onCancel={() => {
                            setStudents([]);
                            setSelectedStudents([]);
                        }}
                    />
                )}
            </CollapsibleSection>

            {students.length > 0 && (
                <CollapsibleSection title='Student Credentials List' defaultOpen={true}>
                    <div className='space-y-4'>
                        <GenericDataTable<ICredentialStudent>
                            data={students}
                            columns={columns}
                            isLoading={tableLoading}
                            onRowSelectionChange={setSelectedStudents}
                            totalItems={students.length}
                            //manualPagination={false}
                        />

                        <div className='flex flex-wrap items-center justify-center gap-4 border-t pt-6'>
                            {/* <Button
                                onClick={handleSendSMS}
                                className="w-32 bg-blue-600 hover:bg-blue-700"
                                disabled={selectedStudents.length === 0}
                            >
                                <Phone className="mr-2 h-4 w-4" /> SMS
                            </Button>
                            <Button
                                onClick={handleSendEmail}
                                className="w-32 bg-cyan-600 hover:bg-cyan-700"
                                disabled={selectedStudents.length === 0}
                            >
                                <Mail className="mr-2 h-4 w-4" /> EMAIL
                            </Button>
                            <Button
                                onClick={handleSendWhatsApp}
                                className="w-32 bg-green-600 hover:bg-green-700"
                                disabled={selectedStudents.length === 0}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" /> WHATSAPP
                            </Button> */}
                            <Button
                                variant='outline'
                                className='w-32'
                                onClick={() => window.print()}
                                disabled={selectedStudents.length === 0}>
                                <Printer className='mr-2 h-4 w-4' /> PRINT
                            </Button>
                            <Button
                                variant='outline'
                                className='w-32 border-green-600 text-green-600 hover:bg-green-50'
                                onClick={() =>
                                    exportToExcel(
                                        'Student_Credentials',
                                        JSON.stringify([
                                            { label: 'Name', value: 'studentname' },
                                            { label: 'Adm No', value: 'amsT_AdmNo' },
                                            { label: 'User Name', value: 'username' },
                                            { label: 'Password', value: 'password' },
                                            { label: 'Class', value: 'asmcL_ClassName' },
                                            { label: 'Section', value: 'asmC_SectionName' },
                                            { label: 'Mobile', value: 'amsT_MobileNo' },
                                            { label: 'Email', value: 'amsT_emailId' }
                                        ]),
                                        JSON.stringify(selectedStudents)
                                    )
                                }
                                disabled={selectedStudents.length === 0}>
                                <FileSpreadsheet className='mr-2 h-4 w-4' /> EXCEL
                            </Button>
                        </div>
                    </div>
                </CollapsibleSection>
            )}
            {/* Printable Report Section */}
            <div id='print-section'>
                <StudentCredentialsReport students={selectedStudents} />
            </div>
        </div>
    );
}
