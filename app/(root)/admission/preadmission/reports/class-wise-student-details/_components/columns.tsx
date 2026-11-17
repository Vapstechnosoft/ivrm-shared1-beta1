'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const formatDate = (date: unknown): string => {
    if (typeof date !== 'string') return 'N/A';
    if (!date) return 'N/A';
    try {
        return format(new Date(date), 'dd-MM-yyyy');
    } catch {
        return 'N/A';
    }
};

const FIELD_CONFIG: Record<string, { label: string; isDate?: boolean }> = {
    AMST_FirstName: { label: 'Student Name' },
    AMST_AdmNo: { label: 'Adm. No.' },
    AMAY_RollNo: { label: 'Roll No.' },
    AMST_RegistrationNo: { label: 'Reg. No' },
    ASMCL_ClassName: { label: 'Current Class' },
    ASMC_SectionName: { label: 'Current Section' },
    AMST_Sex: { label: 'Gender' },
    AMST_BloodGroup: { label: 'Blood Group' },
    AMST_MotherTongue: { label: 'Mother Tongue' },
    AMST_MobileNo: { label: 'Phone No.' },
    AMST_emailId: { label: 'Email ID' },
    AMST_PerAdd3: { label: 'Permanent Address' },
    AMST_ConCity: { label: 'Present Address' },
    IVRMMC_Nationality: { label: 'Nationality' },
    AMST_BiometricId: { label: 'Biometric Code' },
    AMST_Date: { label: 'DOA', isDate: true },
    AMST_DOB: { label: 'DOB', isDate: true },
    AMST_DOB_Words: { label: 'DOB(Words)' },
    PASR_Age: { label: 'Age' },
    IMC_CasteName: { label: 'Caste' },
    IMCC_CategoryName: { label: 'Caste Category' },
    AMC_Name: { label: 'Category' },
    IVRMMR_Name: { label: 'Religion' },
    AMST_PerStreet: { label: 'Street' },
    AMST_PerCity: { label: 'Town' },
    IVRMMS_Name: { label: 'State' },
    AMST_FatherName: { label: "Father's Name" },
    AMST_FatherMobleNo: { label: 'Father Mobile Number' },
    AMST_FatheremailId: { label: 'Father Email ID' },
    AMST_FatherOccupation: { label: 'Father Occupation' },
    AMST_FatherMonIncome: { label: 'Father Income' },
    AMST_FatherEducation: { label: 'Father Qualification' },
    AMST_MotherName: { label: 'Mother Name' },
    AMST_MotherMobileNo: { label: 'Mother Mobile Number' },
    AMST_MotherEmailId: { label: 'Mother Email ID' },
    AMST_MotherOccupation: { label: 'Mother Occupation' },
    AMST_MotherMonIncome: { label: 'Mother Income' },
    AMST_MotherEducation: { label: 'Mother Qualification' },
    AMST_AadharNo: { label: 'Aadhar Card Number' },
    AMST_Tpin: { label: 'Tpin' },
    AMST_GovtAdmno: { label: 'GovtAdmno' },
    AMST_BPLCardNo: { label: 'GovtNo' },
    AMST_BirthPlace: { label: 'Place Of Birth' },
    AMSTPS_PrvSchoolName: { label: 'Previous School Name' },
    AMSTPS_PreviousClass: { label: 'Previous Class' },
    AMSTPS_PrvTCDate: { label: 'Previous TC Date', isDate: true },
    AMSTPS_PrvTCNO: { label: 'Previous TC No.' },
    AMST_Village: { label: 'Village' },
    AMST_Township: { label: 'Town' },
    AMST_Taluk: { label: 'Taluk' },
    IVRMMD_Name: { label: 'District' },
    AMST_PlaceOfBirthState: { label: 'State' },
    AMST_PlaceOfBirthCountry: { label: 'Country' }
};

const serialNumberColumn: ColumnDef<any> = {
    accessorKey: 'RowNo',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='pl-6' />,
    cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const continuousIndex = pageIndex * pageSize + row.index + 1;
        return <div className='pl-6'>{continuousIndex}</div>;
    },
    enableSorting: true,
    enableHiding: false
};
const studentPhotoColumn: ColumnDef<any> = {
    accessorKey: 'AMST_Photoname',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Student Photo' />,
    cell: ({ row }) => (
        <div className='flex items-center justify-center'>
            {row.getValue('AMST_Photoname') ? (
                <img src={row.getValue('AMST_Photoname')} className='h-10 w-10 rounded-full object-cover' alt='Student' />
            ) : (
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-200'>
                    <span className='text-xs'>No Photo</span>
                </div>
            )}
        </div>
    ),
    enableSorting: false,
    enableHiding: true
};

const createDynamicColumn = (fieldId: string): ColumnDef<any> => {
    const config = FIELD_CONFIG[fieldId];

    if (!config) {
        return {
            accessorKey: fieldId,
            header: ({ column }) => <DataTableColumnHeader column={column} title={fieldId} />,
            cell: ({ row }) => <div>{row.getValue(fieldId) || 'N/A'}</div>,
            enableSorting: true,
            enableHiding: true
        };
    }

    return {
        accessorKey: fieldId,
        header: ({ column }) => <DataTableColumnHeader column={column} title={config.label} />,
        cell: ({ row }) => {
            const value = row.getValue(fieldId);

            if (config.isDate) {
                return <div>{formatDate(value)}</div>;
            }

            return <div>{String(value) || 'N/A'}</div>;
        },
        enableSorting: true,
        enableHiding: true
    };
};

export const getMasterAdmissionReportColumns = (selectedFields: string[]): ColumnDef<any>[] => {
    const columns: ColumnDef<any>[] = [serialNumberColumn, studentPhotoColumn];

    selectedFields.forEach((fieldId) => {
        if (fieldId !== 'AMST_Photoname') {
            columns.push(createDynamicColumn(fieldId));
        }
    });

    return columns;
};
