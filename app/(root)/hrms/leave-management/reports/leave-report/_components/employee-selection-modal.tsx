'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { InputText } from '@/components/ui/extension/input-text';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
export interface Employee {
    id: number;
    employeeCode: string;
    employeeName: string;
    designation?: string;
    department?: string;
}
interface EmployeeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    employees: Employee[];
    selectedEmployeeIds: number[];
    onSelect: (employeeIds: number[]) => void;
    isLoading?: boolean;
}
export function EmployeeSelectionModal({
    isOpen,
    onClose,
    employees,
    selectedEmployeeIds,
    onSelect,
    isLoading = false
}: EmployeeSelectionModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(selectedEmployeeIds);
    // Sync local state with prop
    useEffect(() => {
        setLocalSelectedIds(selectedEmployeeIds);
    }, [selectedEmployeeIds, isOpen]);
    // Filter employees based on search query
    const filteredEmployees = employees.filter((emp) => {
        const query = searchQuery.toLowerCase();
        return (
            emp.employeeCode.toLowerCase().includes(query) ||
            emp.employeeName.toLowerCase().includes(query) ||
            emp.designation?.toLowerCase().includes(query) ||
            emp.department?.toLowerCase().includes(query)
        );
    });
    const handleToggleEmployee = (employeeId: number) => {
        setLocalSelectedIds((prev) => {
            if (prev.includes(employeeId)) {
                return prev.filter((id) => id !== employeeId);
            }
            return [...prev, employeeId];
        });
    };
    const handleSelectAll = () => {
        if (localSelectedIds.length === filteredEmployees.length) {
            setLocalSelectedIds([]);
        } else {
            setLocalSelectedIds(filteredEmployees.map((emp) => emp.id));
        }
    };
    const handleSubmit = () => {
        onSelect(localSelectedIds);
        onClose();
    };
    const isAllSelected = filteredEmployees.length > 0 && localSelectedIds.length === filteredEmployees.length;
    const isIndeterminate = localSelectedIds.length > 0 && localSelectedIds.length < filteredEmployees.length;
    return (
        <AdaptiveDialog
            isOpen={isOpen}
            onClose={onClose}
            title='Select Employee'
            description={
                <span className='flex flex-col gap-2'>
                    <span>
                        Total employees: <b>{filteredEmployees.length}</b>
                    </span>
                    <span className='flex items-center gap-2 font-normal text-sm'>
                        <span className='text-muted-foreground'>
                            {localSelectedIds.length} / {filteredEmployees.length} selected
                        </span>
                        {isAllSelected && <CheckCircle2 className='h-5 w-5 text-green-500' />}
                    </span>
                </span>
            }
            size='5xl'>
            <AdaptiveBody className='max-h-[60vh]'>
                <div className='space-y-4'>
                    {/* Search Input */}
                    <div>
                        <InputText
                            type='text'
                            placeholder='Search employee by code, name, designation, or department...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    {isLoading ? (
                        <div className='flex flex-col items-center justify-center py-8 text-center'>
                            <div className='mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                            <p className='text-muted-foreground'>Loading employees...</p>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-8 text-center'>
                            <AlertCircle className='mb-2 h-12 w-12 text-muted-foreground' />
                            <p className='text-muted-foreground'>No employees found</p>
                        </div>
                    ) : (
                        <div className='overflow-hidden rounded-lg border'>
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-muted/50'>
                                        <TableHead className='w-[50px]'>
                                            <Checkbox
                                                checked={isAllSelected || (isIndeterminate && 'indeterminate')}
                                                onCheckedChange={handleSelectAll}
                                                aria-label='Select all employees'
                                            />
                                        </TableHead>
                                        <TableHead className='w-[40px]'>Sl.No</TableHead>
                                        <TableHead className='min-w-[120px]'>Employee Code</TableHead>
                                        <TableHead className='min-w-[200px]'>Employee Name</TableHead>
                                        <TableHead className='min-w-[150px]'>Designation</TableHead>
                                        <TableHead className='min-w-[150px]'>Department</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEmployees.map((employee, index) => (
                                        <TableRow key={employee.id} className='group'>
                                            <TableCell>
                                                <Checkbox
                                                    checked={localSelectedIds.includes(employee.id)}
                                                    onCheckedChange={() => handleToggleEmployee(employee.id)}
                                                />
                                            </TableCell>
                                            <TableCell className='font-medium'>{index + 1}</TableCell>
                                            <TableCell className='font-medium'>{employee.employeeCode}</TableCell>
                                            <TableCell className='font-medium'>{employee.employeeName}</TableCell>
                                            <TableCell>{employee.designation || '-'}</TableCell>
                                            <TableCell>{employee.department || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </AdaptiveBody>
            <AdaptiveFooter className='flex w-full justify-end gap-4'>
                <Button variant='outline' className='w-fit' onClick={onClose}>
                    Cancel
                </Button>
                <Button className='w-fit' onClick={handleSubmit} disabled={localSelectedIds.length === 0 || isLoading}>
                    {isLoading ? (
                        <>
                            <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                            Loading...
                        </>
                    ) : (
                        `Select ${localSelectedIds.length} Employee${localSelectedIds.length !== 1 ? 's' : ''}`
                    )}
                </Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
