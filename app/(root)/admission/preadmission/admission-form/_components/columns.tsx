'use client';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { useFormContext } from '@/components/ui/form/form-provider';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, Edit } from 'lucide-react';

import { ROLES } from '@/constants';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useStudentAdmissionFormById } from '@/hooks/admission/admissionForm';
import type { IadmissionStudentApplicationList } from '@/types/admission/admission';
import { toast } from 'sonner';
import DeleteMasterClassForm from './toggle-form';

export const studentApplicationColumns: ColumnDef<IadmissionStudentApplicationList>[] = [
    {
        accessorKey: 'amsT_Id',
        header: ({ column }) => <DataTableColumnHeader className='w-full pl-6' column={column} title='Sl.No' />,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const continuousIndex = pageIndex * pageSize + row.index + 1;
            return <div className='w-full pl-6'>{continuousIndex}</div>;
        },
        enableSorting: true,
        enableHiding: false
    },
    //   {
    //     accessorKey: 'amsT_Id',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Name/view Profile' />,
    //     cell: ({ row }) => <div>{row.getValue('amsT_Id') ?? 'N.A'}</div>,
    //     enableSorting: true,
    //     enableHiding: true
    // },
    {
        accessorKey: 'studentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name/view Profile' />,
        cell: ({ row }) => <div>{row.getValue('studentName') ?? 'N.A'}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'className',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
        cell: ({ row }) => <div>{row.getValue('className')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'admissionDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => <div>{row.getValue('admissionDate')}</div>,
        enableSorting: true,
        enableHiding: true
    },
    {
        accessorKey: 'gender',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Gender' />,
        cell: ({ row }) => <div>{row.getValue('gender')}</div>,
        enableSorting: true,
        enableHiding: true
    },

    {
        accessorKey: 'registrationNo',
        header: ({ column }) => <DataTableColumnHeader className='text-nowrap' column={column} title='Reg.No.' />,
        cell: ({ row }) => <div>{row.getValue('registrationNo')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'admissionNo',
        header: ({ column }) => <DataTableColumnHeader className='text-nowrap' column={column} title='Adm.No.' />,
        cell: ({ row }) => <div>{row.getValue('admissionNo')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'emailId',
        header: ({ column }) => <DataTableColumnHeader className='text-nowrap' column={column} title='Email Id' />,
        cell: ({ row }) => <div>{row.getValue('emailId')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    {
        accessorKey: 'mobileNo',
        header: ({ column }) => <DataTableColumnHeader className='text-nowrap' column={column} title='Mobile No' />,
        cell: ({ row }) => <div>{row.getValue('mobileNo')}</div>,
        enableSorting: false,
        enableHiding: true
    },
    // {
    //     accessorKey: 'isActive',
    //     header: ({ column }) => <DataTableColumnHeader className='text-nowrap' column={column} title='Status.' />,
    //     cell: ({ row }) => <div>{row.getValue('isActive')}</div>,
    //     enableSorting: false,
    //     enableHiding: true
    // },
    {
        accessorKey: 'studentPhotoUrl',
        header: ({ column }) => <DataTableColumnHeader className='text-nowrap' column={column} title='Photo' />,
        cell: ({ row }) => {
            const photo = row.getValue('studentPhotoUrl') as string | null;

            const handleDownload = async () => {
                if (!photo) {
                    toast.error('No photo available to download');
                    return;
                }

                try {
                    const res = await fetch(photo);
                    if (!res.ok) throw new Error('Network response was not ok');
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    const filename = photo.split('/').pop()?.split('?')[0] || 'photo.jpg';
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('Download failed', err);
                    toast.error('Unable to download photo');
                }
            };

            return (
                <div className='flex items-center gap-2'>
                    <div>
                        <Button type='button' variant='ghost' size='sm' onClick={handleDownload} className='p-1'>
                            <Download className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: true
    },

    {
        id: 'actions',
        header: ({ column }) => <DataTableColumnHeader className='text-center' column={column} title='Actions' />,
        accessorFn: (row: any) => {
            return row;
        },
        enableHiding: false,
        enableSorting: false,
        cell: ({ cell }: { cell: any }) => {
            const { openEditForm } = useFormContext<IadmissionStudentApplicationList>();
            const session = useSession();
            const [amstId, setAmstId] = useState<number>(0);

            const {
                data: applicationFormDetails,
                isLoading: applicationFormDetailsLoading,
                error: applicationFormError
            } = useStudentAdmissionFormById(amstId);

            useEffect(() => {
                // Avoid forcing a full page reload when session role is temporarily undefined.
                // Session lifecycle should be handled elsewhere; do nothing here.
            }, [session?.data?.role]);

            // Trigger form open when applicationFormDetails is loaded
            useEffect(() => {
                if (applicationFormError) {
                    console.error('Failed to fetch application details:', applicationFormError);
                    toast.error('Unable to fetch application details');
                    setAmstId(0);
                    return;
                }

                if (amstId && applicationFormDetails?.data && !applicationFormDetailsLoading) {
                    try {
                        const resp = applicationFormDetails.data;

                        // If backend returned a "full" structured object (firstTab/secondTab/thirdTab...)
                        // merge those tabs into a single student payload so the edit form can autofill.
                        const hasTabbed = Boolean(
                            (resp && (resp.firstTab || resp.secondTab || resp.thirdTab)) ||
                            (resp?.data && (resp.data.firstTab || resp.data.secondTab || resp.data.thirdTab))
                        );

                        let payload: any;

                        if (hasTabbed) {
                            // support both shapes: resp itself has tabs, or resp.data has tabs
                            const src = resp.firstTab ? resp : resp.data ? resp.data : resp;
                            const combined = {
                                ...(src.firstTab || {}),
                                ...(src.secondTab || {}),
                                ...(src.thirdTab || {}),
                                ...(src.fourthTab || {}),
                                ...(src.fifthTab || {}),
                                ...(src.lastTab || {}),
                                amsT_Id: src.firstTab?.amsT_Id ?? src.amsT_Id ?? 0
                            };

                            payload = {
                                ...combined,
                                // normalized arrays expected by update-form.tsx
                                adm_M_Student_EmailIdDTO: src.firstTab?.emailIds || src.emailIds || src.adm_M_Student_EmailIdDTO || combined.adm_M_Student_EmailIdDTO || [],
                                mobileNos: src.firstTab?.mobileNos || src.mobileNos || combined.mobileNos || [],

                                // Explicit mapping for critical fields known to have variation across endpoints
                                amsT_MobileNo: combined.amsT_MobileNo ?? combined.mobileNo ?? combined.mobile_No ?? combined.amsT_Mobile_No ?? src.firstTab?.amsT_MobileNo ?? src.firstTab?.mobileNo ?? '',
                                amsT_emailId: combined.amsT_emailId ?? combined.emailId ?? combined.email_Id ?? combined.amsT_Email_Id ?? src.firstTab?.amsT_emailId ?? src.firstTab?.emailId ?? '',
                                amsT_Sex: combined.amsT_Sex ?? combined.gender ?? combined.sex ?? '',
                                studentCategoryId: combined.studentCategoryId ?? combined.amsT_StudentCategory_Id ?? combined.imcC_Id ?? src.firstTab?.amsT_StudentCategory_Id ?? 0,
                                amsT_AadharNo: combined.amsT_AadharNo ?? combined.aadharNo ?? combined.aadhar_No ?? combined.amsT_Aadhar_No ?? '',
                                amsT_DOB: combined.amsT_DOB ?? combined.dob ?? combined.dateOfBirth ?? combined.pasR_DOB ?? null,
                                amsT_Date: combined.amsT_Date ?? combined.admissionDate ?? combined.date ?? null,

                                previousSchools: (
                                    src.fourthTab?.previousSchools ||
                                    src.previousSchools ||
                                    src.previous_schools ||
                                    src.previousSchoolDetails ||
                                    combined.previousSchools ||
                                    []
                                ).map((ps: any) => ({
                                    amstpS_Id: ps?.amstpS_Id ?? ps?.id ?? '',
                                    schoolName: ps.schoolName ?? ps.pasrpS_PrvSchoolName ?? ps.pasrS_SchoolName ?? '',
                                    schoolType: String(ps.schoolType ?? ''),
                                    class: String((ps.class || ps.classId) ?? ''),
                                    percentage: ps.percentage ?? ps.pasrpS_PreviousPer ?? '',
                                    grade: ps.grade ?? ps.pasrpS_PreviousGrade ?? '',
                                    passedYear: ps.passedYear ? Number(ps.passedYear) : 0,
                                    country: String(ps.country ?? ''),
                                    state: String(ps.state ?? ''),
                                    address: ps.address ?? ps.pasrpS_Address ?? '',
                                    leftReason: ps.leftReason ?? ps.pasrpS_LeftReason ?? '',
                                    medium: ps.medium ?? '',
                                    tcNumber: ps.tcNumber ?? ps.pasrpS_TcNo ?? '',
                                    tcDate: ps.tcDate ? (ps.tcDate instanceof Date ? ps.tcDate.toISOString() : String(ps.tcDate)) : ''
                                })),
                                siblings: (
                                    src.fourthTab?.siblings ||
                                    src.siblings ||
                                    src.student_siblings ||
                                    src.siblingsDetails ||
                                    combined.siblings ||
                                    []
                                ).map((s: any) => ({
                                    ...s,
                                    amsts_Id: s?.amstS_Id ?? s?.amsts_Id ?? s?.id ?? 0
                                })),
                                guardian: (src.guardians || src.guardian || src.guardiansDetails || combined.guardian || []).map((g: any) => ({
                                    ...g,
                                    guardian_Id: g?.guardian_Id ?? g?.guardianId ?? g?.id ?? null
                                })),
                                selectedSourceDetails: (
                                    src.fourthTab?.selectedSourceDetails ||
                                    src.selectedSource ||
                                    src.student_sources ||
                                    combined.selectedSourceDetails ||
                                    []
                                )
                                    .filter(Boolean)
                                    .map((s: any) => ({
                                        pamS_Id: String(s?.pamS_Id),
                                        pamS_SourceName: s.pamS_SourceName || s.name || ''
                                    })),
                                selectedRefrenceDetails: (
                                    src.selectedRefrenceDetails ||
                                    src.selectedReference ||
                                    src.student_refrences ||
                                    combined.selectedRefrenceDetails ||
                                    []
                                )
                                    .filter(Boolean)
                                    .map((r: any) => ({
                                        pamR_Id: String(r?.pamR_Id),
                                        pamR_ReferenceName: r.pamR_ReferenceName || r.name || ''
                                    })),
                                selectedDocuments: (src.student_documents || src.selectedDocuments || combined.selectedDocuments || []).filter(Boolean).map((d: any) => ({
                                    pasrD_Id: d?.pasrD_Id,
                                    pasR_Id: d?.pasR_Id,
                                    amsmD_Id: d?.amsmD_Id,
                                    document_Path: d?.document_Path
                                })),
                                activities: (src.fourthTab?.activities || src.activities || combined.activities || []).map((a: any) => ({
                                    activityId: a?.activityId,
                                    isSelected: a?.isSelected ?? true
                                })),
                                sourceDetails: (src.fourthTab?.sourceDetails || src.sourceDetails || combined.sourceDetails || []).map((s: any) => ({
                                    sourceId: s?.sourceId,
                                    isSelected: s?.isSelected ?? true
                                }))
                            };
                        } else {
                            // fallback to aggressive mapping for flat shapes
                            const student = resp?.student_details || resp || {};
                            payload = {
                                ...student,
                                amsT_MobileNo: student.amsT_MobileNo ?? student.mobileNo ?? student.mobile_No ?? '',
                                amsT_emailId: student.amsT_emailId ?? student.emailId ?? student.email_Id ?? '',
                                amsT_Sex: student.amsT_Sex ?? student.gender ?? student.sex ?? '',
                                studentCategoryId: student.studentCategoryId ?? student.amsT_StudentCategory_Id ?? student.imcC_Id ?? 0,
                                adm_M_Student_EmailIdDTO: resp?.emailIds || resp?.adm_M_Student_EmailIdDTO || (student.amsT_emailId ? [{ amsT_emailId: student.amsT_emailId }] : []),
                                mobileNos: resp?.mobileNos || (student.amsT_MobileNo ? [{ amsT_MobileNo: student.amsT_MobileNo, amstsmS_CountryCode: '91' }] : [])
                            };
                        }

                        // Open edit form with the flattened payload (matches update-form expectations)
                        openEditForm(payload);
                        setAmstId(0); // Reset after opening
                    } catch (error) {
                        // eslint-disable-next-line no-console
                        console.error('Error processing application details:', error);
                        toast.error('Unable to process application details');
                        setAmstId(0); // Reset on error
                    }
                }
            }, [applicationFormDetails, applicationFormDetailsLoading, applicationFormError]);

            return (
                <div className='flex items-start justify-start gap-2'>
                    <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        disabled={applicationFormDetailsLoading}
                        onClick={() => {
                            const rowData = cell.row.original as any;
                            // Prefer the admission's amsT_Id; fall back to common id shapes
                            const id = rowData?.amsT_Id ?? rowData?.amsTId ?? rowData?.id ?? 0;
                            if (id) {
                                setAmstId(Number(id));
                            } else {
                                toast.error('Unable to determine admission id for edit');
                            }
                        }}
                        className='w-fit p-1'>
                        {applicationFormDetailsLoading ? (
                            <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent' />
                        ) : (
                            <Edit className='h-4 w-4' />
                        )}
                    </Button>
                    <div className='flex w-full justify-between gap-2'>
                        {session?.data?.role?.toUpperCase() === ROLES.ADMIN && <DeleteMasterClassForm row={cell.row.original} />}
                    </div>
                </div>
            );
        }
    }
];
