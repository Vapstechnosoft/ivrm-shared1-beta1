'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IAttendanceConfig, IStandardConfig, IStudentAttendance } from '@/types/staff-portal/attendance-entry';
import type React from 'react';
import { toast } from 'sonner';

interface AttendanceGridProps {
    students: IStudentAttendance[];
    setStudents: React.Dispatch<React.SetStateAction<any[]>>;
    entryType: string | undefined;
    config: IAttendanceConfig | null;
    stdConfig: IStandardConfig | null;
    countClass: number;
}

const AttendanceGrid: React.FC<AttendanceGridProps> = ({ students, setStudents, entryType, config, stdConfig, countClass }) => {
    const handleCheckboxChange = (studentId: number, field: 'selected' | 'FirstHalfflag' | 'SecondHalfflag', checked: boolean) => {
        //  console.log('handleCheckboxChange', studentId, field, checked);

        setStudents((prev) => prev.map((s) => (s.amsT_Id === studentId ? { ...s, [field]: checked } : s)));
    };

    const handleDaysBlur = (studentId: number, days: string) => {
        const val = Number.parseFloat(days);
        if (Number.isNaN(val)) return;

        if (val > countClass) {
            toast.error(countClass === 0 ? 'Total Class Held Is ZERO' : 'Present Days Is More Than Class Held');
            setStudents((prev) => prev.map((s) => (s.amsT_Id === studentId ? { ...s, pdays: 0 } : s)));
            return;
        }

        setStudents((prev) => prev.map((s) => (s.amsT_Id === studentId ? { ...s, pdays: val } : s)));
    };

    const handleDaysChange = (studentId: number, val: string) => {
        setStudents((prev) => prev.map((s) => (s.amsT_Id === studentId ? { ...s, pdays: val } : s)));
    };

    // Determine column visibility
    const showAdmNo =
        stdConfig?.ivrmgC_AdmnoColumnDisplay === 1 || (!stdConfig?.ivrmgC_AdmnoColumnDisplay && !stdConfig?.ivrmgC_RollnoColumnDisplay);
    const showRegNo = stdConfig?.ivrmgC_RegnoColumnDisplay === 1;
    const showRollNo =
        stdConfig?.ivrmgC_RollnoColumnDisplay === 1 || (!stdConfig?.ivrmgC_AdmnoColumnDisplay && !stdConfig?.ivrmgC_RollnoColumnDisplay);

    return (
        <div className='overflow-hidden rounded-md border'>
            <Table>
                <TableHeader className='bg-muted/50'>
                    <TableRow>
                        <TableHead className='w-16 text-center'>SL. NO.</TableHead>
                        <TableHead>Student Name</TableHead>
                        {showAdmNo && <TableHead>Admission No.</TableHead>}
                        {showRegNo && <TableHead>Registration No.</TableHead>}
                        {showRollNo && <TableHead className='text-center'>Roll No.</TableHead>}

                        {(entryType === 'Dailyonce' || entryType === 'period') && <TableHead className='text-center'>Attendance</TableHead>}

                        {entryType === 'monthly' && <TableHead className='w-32 text-center'>Days</TableHead>}

                        {entryType === 'Dailytwice' && (
                            <>
                                <TableHead className='text-center'>I Half</TableHead>
                                <TableHead className='text-center'>II Half</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student, index) => (
                        <TableRow key={student.amsT_Id}>
                            <TableCell className='text-center font-medium'>{index + 1}</TableCell>
                            <TableCell className='text-left font-semibold text-primary'>{student.studentname}</TableCell>
                            {showAdmNo && <TableCell>{student.amsT_AdmNo}</TableCell>}
                            {showRegNo && <TableCell>{student.amsT_RegistrationNo}</TableCell>}
                            {showRollNo && <TableCell className='text-center'>{student.amaY_RollNo}</TableCell>}

                            {(entryType === 'Dailyonce' || entryType === 'period') && (
                                <TableCell className='text-center'>
                                    <Checkbox
                                        checked={!!student.selected}
                                        onCheckedChange={(checked) => handleCheckboxChange(student.amsT_Id, 'selected', !!checked)}
                                    />
                                </TableCell>
                            )}

                            {entryType === 'monthly' && (
                                <TableCell className='text-center'>
                                    <Input
                                        type='text'
                                        className='h-8 text-center'
                                        value={student.pdays}
                                        onChange={(e) => handleDaysChange(student.amsT_Id, e.target.value)}
                                        onBlur={(e) => handleDaysBlur(student.amsT_Id, e.target.value)}
                                    />
                                </TableCell>
                            )}

                            {entryType === 'Dailytwice' && (
                                <>
                                    <TableCell className='text-center'>
                                        <Checkbox
                                            checked={!!student.FirstHalfflag}
                                            onCheckedChange={(checked) => handleCheckboxChange(student.amsT_Id, 'FirstHalfflag', !!checked)}
                                        />
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Checkbox
                                            checked={!!student.SecondHalfflag}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(student.amsT_Id, 'SecondHalfflag', !!checked)
                                            }
                                        />
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AttendanceGrid;
