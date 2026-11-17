import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function NotEnteredSubjectsModal({ open, onClose, data, info }: any) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Not Entered Subject List</DialogTitle>
                </DialogHeader>

                <div className='my-4 grid grid-cols-4 gap-4 font-medium text-sm'>
                    <div>
                        Academic Year: <strong>{info.asmaY_Year}</strong>
                    </div>
                    <div>
                        Class: <strong>{info.asmcL_ClassName}</strong>
                    </div>
                    <div>
                        Section: <strong>{info.asmC_SectionName}</strong>
                    </div>
                    <div>
                        Exam: <strong>{info.emE_ExamName}</strong>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SLNO</TableHead>
                            <TableHead>Subject Name</TableHead>
                            <TableHead>Source Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item: any, i: number) => (
                            <TableRow key={i}>
                                <TableCell className='text-center'>{i + 1}</TableCell>
                                <TableCell>{item.ISMS_SubjectName}</TableCell>
                                <TableCell style={{ color: item.SourceMarksColorFlag || 'inherit' }}>{item.SourceMarksEntry}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
}
