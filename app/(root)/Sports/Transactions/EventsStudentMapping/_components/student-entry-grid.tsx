'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { IStudentValues } from '@/types/sports/events-student-mapping';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface StudentEntryGridProps {
    students: IStudentValues[];
    onUpdateStudent: (id: number, field: keyof IStudentValues, value: any) => void;
    onRemoveStudent: (id: number) => void;
    onToggleSelectAll: (checked: boolean) => void;
    onToggleSelect: (id: number, checked: boolean) => void;
    globalSelectState: boolean;
}

export function StudentEntryGrid({
    students,
    onUpdateStudent,
    onRemoveStudent,
    onToggleSelectAll,
    onToggleSelect,
    globalSelectState
}: StudentEntryGridProps) {
    if (!students || students.length === 0) return null;

    return (
        <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="max-h-[300px] overflow-y-auto w-full">
                <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={globalSelectState}
                                    onCheckedChange={(checked) => onToggleSelectAll(!!checked)}
                                />
                            </TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Adm No.</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>House</TableHead>
                            <TableHead className="w-[100px]">Point</TableHead>
                            <TableHead className="w-[100px]">Place</TableHead>
                            <TableHead>Remark</TableHead>
                            <TableHead>Record</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student, index) => (
                            <TableRow key={student.amsT_Id}>
                                <TableCell>
                                    <Checkbox
                                        checked={student.selected ?? false}
                                        onCheckedChange={(checked) => onToggleSelect(student.amsT_Id, !!checked)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{student.studentName}</TableCell>
                                <TableCell>{student.amsT_AdmNo}</TableCell>
                                <TableCell>{student.asmcL_ClassName}</TableCell>
                                <TableCell>{student.asmC_SectionName}</TableCell>
                                <TableCell>{student.spccmH_HouseName}</TableCell>
                                <TableCell>
                                    {student.ivrmgC_SportsPointsDropdownFlg === 1 ? (
                                        <Select
                                            value={String(student.spccestR_Points || '')}
                                            onValueChange={(val) => onUpdateStudent(student.amsT_Id, 'spccestR_Points', Number(val))}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="-" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5].map(v => (
                                                    <SelectItem key={v} value={String(v)}>{v}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            className="h-8 w-full"
                                            type="number"
                                            value={student.spccestR_Points || ''}
                                            onChange={(e) => onUpdateStudent(student.amsT_Id, 'spccestR_Points', Number(e.target.value))}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={student.spccestR_Rank || ''}
                                        onValueChange={(val) => onUpdateStudent(student.amsT_Id, 'spccestR_Rank', val)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="-" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                                                <SelectItem key={v} value={String(v)}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        className="h-8 w-full"
                                        value={student.spccestR_Remarks || ''}
                                        onChange={(e) => onUpdateStudent(student.amsT_Id, 'spccestR_Remarks', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={student.spccestR_RecordBrokenFlag ?? false}
                                        onCheckedChange={(checked) => onUpdateStudent(student.amsT_Id, 'spccestR_RecordBrokenFlag', checked)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemoveStudent(student.amsT_Id)}
                                        className="h-8 w-8 text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
