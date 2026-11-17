'use client';

import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ActionButtons } from '@/components/ui/form/action-buttons';
import { useMasterClassCategorySection } from '@/hooks/admission/preadmission/useMasters';
import type { IMasterClassCategoryList } from '@/types/admission/preadmission/masters';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import ToggleMasterClassCategorySectionForm from './section-toggle-form';

interface ViewDetailModalProps {
    rowData: IMasterClassCategoryList;
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewDetailModal({ rowData, isOpen, onClose }: ViewDetailModalProps) {
    const [isToggleFormOpen, setIsToggleFormOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const closeToggleForm = useCallback(() => {
        setIsToggleFormOpen(false);
        setSelectedRow(null);
    }, []);
    const { data: response, isLoading, refetch } = useMasterClassCategorySection(rowData.asmcC_Id);

    const tableProps = useDataTableProps(response);

    // Build flattened rows so each section is its own row, preserving class/category context
    type SectionRow = {
        asmcC_Id?: number;
        asmaY_Year?: string;
        amC_Name?: string;
        asmcL_ClassName?: string;
        asmccS_Id?: number;
        asmS_Id?: number;
        asmC_SectionName?: string;
        asmccS_ActiveFlg?: boolean;
    };

    const flattenedData: SectionRow[] = (() => {
        const src = tableProps.data as any;
        if (!src) return [];
        // If API returned an object with `sections`
        if (!Array.isArray(src) && src.sections && Array.isArray(src.sections)) {
            return src.sections.map((s: any) => ({
                asmcC_Id: src.asmcC_Id,
                asmaY_Year: src.asmaY_Year,
                amC_Name: src.amC_Name,
                asmcL_ClassName: src.asmcL_ClassName,
                asmccS_Id: s.asmccS_Id,
                asmS_Id: s.asmS_Id,
                asmC_SectionName: s.asmC_SectionName,
                asmccS_ActiveFlg: s.asmccS_ActiveFlg
            }));
        }
        // If API returned an array of class-category items
        if (Array.isArray(src)) {
            return src.flatMap((item: any) => {
                if (item.sections && Array.isArray(item.sections)) {
                    return item.sections.map((s: any) => ({
                        asmcC_Id: item.asmcC_Id,
                        asmaY_Year: item.asmaY_Year,
                        amC_Name: item.amC_Name,
                        asmcL_ClassName: item.asmcL_ClassName,
                        asmccS_Id: s.asmccS_Id,
                        asmS_Id: s.asmS_Id,
                        asmC_SectionName: s.asmC_SectionName,
                        asmccS_ActiveFlg: s.asmccS_ActiveFlg
                    }));
                }
                // fallback: include the item itself
                return [
                    {
                        asmcC_Id: item.asmcC_Id,
                        asmaY_Year: item.asmaY_Year,
                        amC_Name: item.amC_Name,
                        asmcL_ClassName: item.asmcL_ClassName
                    }
                ];
            });
        }
        return [];
    })();

    const sectionColumns: ColumnDef<SectionRow>[] = [
        {
            accessorKey: 'asmcC_Id',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Sl.No' className='w-full pl-6' />,
            cell: ({ row }) => {
                const index = row.index + 1;
                return <div className='w-full pl-6'>{index}</div>;
            },
            enableSorting: true,
            enableHiding: false
        },

        {
            accessorKey: 'amC_Name',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Category Name' />,
            cell: ({ row }) => <div>{row.getValue('amC_Name')}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'asmcL_ClassName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
            cell: ({ row }) => <div>{row.getValue('asmcL_ClassName')}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            accessorKey: 'asmC_SectionName',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Section' />,
            cell: ({ row }) => <div>{row.getValue('asmC_SectionName')}</div>,
            enableSorting: true,
            enableHiding: true
        },
        {
            id: 'actions',
            header: ({ column }) => <DataTableColumnHeader column={column} title='Actions' className='text-start' />,
            accessorFn: (row: any) => row,
            enableSorting: false,
            cell: ({ row }) => (
                <ActionButtonsCell
                    rowData={row.original}
                    onOpenToggle={(r: any) => {
                        setSelectedRow(r);
                        setIsToggleFormOpen(true);
                    }}
                />
            )
        }
    ];

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
                    <div className='mt-5 space-y-4 py-4'>
                        <div className='rounded-lg border p-3'>
                            <GenericDataTable
                                {...tableProps}
                                data={flattenedData}
                                totalItems={flattenedData.length}
                                columns={sectionColumns}
                                isLoading={isLoading}
                                error={null}
                                showViewOptions={false}
                                isPaginationRequired={false}
                                isSearchRequired={false}
                                loadingMessage='Loading details...'
                                noDataTitle='No Details Found'
                                noDataDescription='No related details available'
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {isToggleFormOpen && selectedRow && (
                <ToggleMasterClassCategorySectionForm
                    SectionRow={selectedRow}
                    onClose={closeToggleForm}
                    onSuccess={() => {
                        // refetch sections for this class-category after successful toggle
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
function ActionButtonsCell({
    rowData,
    onOpenToggle
}: {
    rowData: any;
    onOpenToggle: (r: any) => void;
}) {
    const handleToggle = useCallback(() => {
        onOpenToggle(rowData);
    }, [onOpenToggle, rowData]);

    return (
        <div className='flex items-center gap-2'>
            <ActionButtons
                rowData={rowData}
                buttons={{ edit: false, toggle: true, delete: false }}
                onToggle={handleToggle}
                toggleConditionKey='asmccS_ActiveFlg'
            />
        </div>
    );
}
