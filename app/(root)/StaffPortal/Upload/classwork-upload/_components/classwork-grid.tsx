'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Pencil, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { IClassWork, IClassWorkAttachment } from '@/types/staff-portal/classwork.d';

interface ClassWorkGridProps {
    data: IClassWork[];
    onEdit: (data: IClassWork) => void;
    onDeactivate: (id: number, active: boolean) => void;
    onView: (id: number, year: number) => Promise<{ attachementlist: IClassWorkAttachment[] }>;
}

export default function ClassWorkGrid({ data, onEdit, onDeactivate, onView }: ClassWorkGridProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [attachments, setAttachments] = useState<IClassWorkAttachment[]>([]);

    const filteredData = data.filter(item =>
        item.ismS_SubjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.icW_Topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.asmcL_ClassName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = async (item: IClassWork) => {
        try {
            const res = await onView(item.icW_Id, item.asmaY_Id);
            setAttachments(res.attachementlist || []);
            setViewDialogOpen(true);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>ClassWork Details</CardTitle>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">SL NO</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Section</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead className="text-center">Attachment</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <TableRow key={item.icW_Id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.ismS_SubjectName}</TableCell>
                                    <TableCell>{item.icW_Topic}</TableCell>
                                    <TableCell>{item.asmcL_ClassName}</TableCell>
                                    <TableCell>{item.asmC_SectionName}</TableCell>
                                    <TableCell>{format(new Date(item.icW_FromDate), 'dd-MM-yyyy')}</TableCell>
                                    <TableCell>{format(new Date(item.icW_ToDate), 'dd-MM-yyyy')}</TableCell>
                                    <TableCell className="text-center">
                                        {item.FilesCount && item.FilesCount > 0 ? (
                                            <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                                                <Eye className="h-4 w-4 text-blue-500" />
                                            </Button>
                                        ) : (
                                            <span className="text-muted-foreground">---</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDeactivate(item.icW_Id, item.icW_ActiveFlag)}>
                                                {item.icW_ActiveFlag ? (
                                                    <ToggleRight className="h-6 w-6 text-green-500" />
                                                ) : (
                                                    <ToggleLeft className="h-6 w-6 text-red-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-4">No records found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Attachments</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {attachments.map((att, i) => (
                            <div key={i} className="flex justify-between items-center border p-2 rounded">
                                <span className="truncate max-w-[200px]">{att.icwatT_FileName}</span>
                                <Button size="sm" asChild>
                                    <a href={att.icwatT_Attachment} target="_blank" rel="noreferrer">
                                        {att.icW_Attachment === 'HyperLink' ? 'Open Link' : 'Download'}
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
