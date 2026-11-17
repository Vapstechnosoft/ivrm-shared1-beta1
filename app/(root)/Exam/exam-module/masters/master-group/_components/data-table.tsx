'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IMasterSubjectGroupDetails } from '@/types/exam/exam-module/masters';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface SimpleSubjectTableProps {
    allSubjects: IMasterSubjectGroupDetails[];
    preselectedSubjects?: IMasterSubjectGroupDetails[];
    maxSelectableRows?: number;
    onSelectionChange?: (selected: IMasterSubjectGroupDetails[]) => void;
}

export function SimpleSubjectTable({
    allSubjects,
    preselectedSubjects = [],
    maxSelectableRows = 0,
    onSelectionChange
}: SimpleSubjectTableProps) {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Initialize preselected rows
    useEffect(() => {
        const preselectedIds = new Set(
            preselectedSubjects
                .map((s) => s.ismS_Id)
                .filter((id): id is number => id !== undefined) // ensure only numbers
        );
        setSelectedIds(preselectedIds);
    }, [preselectedSubjects]);

    // Filter subjects by search
    const filteredSubjects = useMemo(() => {
        if (!search) return allSubjects;
        return allSubjects.filter((subj) => subj.ismS_SubjectName.toLowerCase().includes(search.toLowerCase()));
    }, [allSubjects, search]);

    // Handle selection toggle
    const toggleSelection = (subject: IMasterSubjectGroupDetails) => {
        if (subject.ismS_Id === undefined) return; // safety check

        const updatedSelection = new Set(selectedIds);

        if (selectedIds.has(subject.ismS_Id)) {
            updatedSelection.delete(subject.ismS_Id);
        } else {
            if (maxSelectableRows && updatedSelection.size >= maxSelectableRows) {
                toast.error(`You can select up to ${maxSelectableRows} subjects only.`);
                return;
            }
            updatedSelection.add(subject.ismS_Id);
        }

        setSelectedIds(updatedSelection);

        // Notify parent
        const selectedSubjects = allSubjects.filter((s) => s.ismS_Id !== undefined && updatedSelection.has(s.ismS_Id));
        onSelectionChange?.(selectedSubjects);
    };

    return (
        <div className='w-full space-y-3'>
            {/* 🔍 Search Box */}
            <div className='justify-between-end flex items-center justify-end'>
                <Input
                    type='text'
                    placeholder='Search subjects...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-1/3'
                />
            </div>

            {/* 📋 Table */}
            <div className='max-h-[550px] overflow-y-auto rounded-md border'>
                <Table className='min-w-full'>
                    <TableHeader className='sticky top-0 z-10 bg-white shadow-sm'>
                        <TableRow>
                            <TableHead className='w-16'>Sl.No</TableHead>
                            <TableHead className='w-12 text-center'>Select</TableHead>
                            <TableHead>Subject Name</TableHead>
                            <TableHead>Subject Code</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredSubjects.length ? (
                            filteredSubjects.map((subject, index) => (
                                <TableRow key={subject.ismS_Id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className='text-center'>
                                        <Checkbox
                                            checked={subject.ismS_Id !== undefined && selectedIds.has(subject.ismS_Id)}
                                            onCheckedChange={() => toggleSelection(subject)}
                                        />
                                    </TableCell>
                                    <TableCell>{subject.ismS_SubjectName}</TableCell>
                                    <TableCell>{subject.ismS_SubjectCode}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className='h-24 text-center text-gray-500'>
                                    No subjects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
