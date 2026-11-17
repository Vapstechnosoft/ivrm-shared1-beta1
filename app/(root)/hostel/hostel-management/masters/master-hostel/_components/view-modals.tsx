'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import { GenericDataTable, useDataTableProps } from '@/components/ui/view-data-table/view-generic-data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { IFacility, IEmployee, IHostelDocument, IHostel } from '@/types/hostel/hostel-management/masters';
import { useEffect, useState } from 'react';
import { getMappedEmployees, getMappedFacilities, getHostelPhotos } from '@/server/hostel/hostel-management/masters/hostel';

// --- View Facilities Modal ---

interface ViewFacilitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    hostel: IHostel | null;
}

export function ViewFacilitiesModal({ isOpen, onClose, hostel }: ViewFacilitiesModalProps) {
    const [data, setData] = useState<IFacility[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && hostel?.hlmH_Id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await getMappedFacilities(hostel.hlmH_Id);
                    if (res.data) {
                        setData(res.data);
                    } else {
                        setData([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch facilities", error);
                    setData([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setData([]);
        }
    }, [isOpen, hostel]);

    const tableProps = useDataTableProps({ data, total: data.length });

    const columns: ColumnDef<IFacility>[] = [
        {
            accessorKey: 'hlmftY_FacilityName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Facility Name' />,
            cell: ({ row }) => <div>{row.getValue('hlmftY_FacilityName')}</div>,
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Facilities: {hostel?.hlmH_Name}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <GenericDataTable
                        {...tableProps}
                        data={data}
                        totalItems={data.length}
                        columns={columns}
                        showViewOptions={false}
                        showPagination={false}
                        showSearch={false}
                        isLoading={isLoading}
                        noDataTitle='No Facilities'
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- View Wardens Modal ---

interface ViewWardensModalProps {
    isOpen: boolean;
    onClose: () => void;
    hostel: IHostel | null;
}

export function ViewWardensModal({ isOpen, onClose, hostel }: ViewWardensModalProps) {
    const [data, setData] = useState<IEmployee[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && hostel?.hlmH_Id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await getMappedEmployees(hostel.hlmH_Id);
                    // The API returns employees, but let's check the structure.
                    // Assuming the API returns data in res.data
                    if (res.data) {
                        setData(res.data);
                    } else {
                        setData([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch wardens", error);
                    setData([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setData([]);
        }
    }, [isOpen, hostel]);

    const tableProps = useDataTableProps({ data, total: data.length });

    const columns: ColumnDef<IEmployee>[] = [
        {
            accessorKey: 'hrmE_EmployeeFirstName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Warden Name' />,
            cell: ({ row }) => <div>{row.original.hrmE_EmployeeFullName || row.original.hrmE_EmployeeFirstName} : {row.original.hrmE_EmployeeCode}</div>,
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Wardens: {hostel?.hlmH_Name}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <GenericDataTable
                        {...tableProps}
                        data={data}
                        totalItems={data.length}
                        columns={columns}
                        showViewOptions={false}
                        showPagination={false}
                        showSearch={false}
                        isLoading={isLoading}
                        noDataTitle='No Wardens'
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- View Documents Modal ---

interface ViewDocumentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    hostel: IHostel | null;
}

export function ViewDocumentsModal({ isOpen, onClose, hostel }: ViewDocumentsModalProps) {
    const [data, setData] = useState<IHostelDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && hostel?.hlmH_Id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await getHostelPhotos(hostel.hlmH_Id);
                    if (res.data) {
                        setData(res.data);
                    } else {
                        setData([]);
                    }
                } catch (error) {
                    console.error("Failed to fetch documents", error);
                    setData([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setData([]);
        }
    }, [isOpen, hostel]);

    const tableProps = useDataTableProps({ data, total: data.length });

    const columns: ColumnDef<IHostelDocument>[] = [
        {
            accessorKey: 'hlmhP_FileName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='File Name' />,
            cell: ({ row }) => <div>{row.original.hlmhP_FileName}</div>,
        },
        {
            id: 'actions',
            header: 'View',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" onClick={() => window.open(row.original.hlmhP_FilePath, '_blank')}>
                    <Eye className="h-4 w-4 mr-2" /> View
                </Button>
            )
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Documents: {hostel?.hlmH_Name}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <GenericDataTable
                        {...tableProps}
                        data={data}
                        totalItems={data.length}
                        columns={columns}
                        showViewOptions={false}
                        showPagination={false}
                        showSearch={false}
                        isLoading={isLoading}
                        noDataTitle='No Documents'
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
