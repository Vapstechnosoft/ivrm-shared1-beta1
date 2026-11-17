'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import type { EmployeeListDTO } from '@/types/super-admin/user-creation/staff-user-creation';

interface ViewUsernamesModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: EmployeeListDTO[];
    roleName?: string;
}

export default function ViewUsernamesModal({
    isOpen,
    onClose,
    users,
    roleName
}: ViewUsernamesModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const isAdmin = roleName?.toUpperCase() === 'ADMIN' || roleName?.toUpperCase() === 'SUPER ADMIN';

    const filteredUsers = users.filter(user =>
        (user.stafname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.hrmE_EmployeeCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.user_Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.intname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.mI_Name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 bg-blue-50 border-b">
                    <DialogTitle className="text-xl font-bold text-blue-900">
                        {isAdmin ? 'Admin List With Usernames' : 'Employee List With Usernames'}
                    </DialogTitle>
                    <p className="text-sm text-blue-700 mt-1 uppercase">
                        NOTE: EXISTING USERNAMES FOR <b>{roleName || 'SELECTED ROLE'}</b>
                    </p>
                </DialogHeader>

                <div className="p-4 bg-gray-50 border-b flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={isAdmin ? "Search by institution or username..." : "Search by name, code, or username..."}
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <Table>
                        <TableHeader className="bg-gray-100 sticky top-0 z-10">
                            <TableRow>
                                <TableHead className="w-[80px] text-center">SL.NO.</TableHead>
                                {isAdmin ? (
                                    <>
                                        <TableHead>Institute Name</TableHead>
                                        <TableHead>User Name</TableHead>
                                    </>
                                ) : (
                                    <>
                                        <TableHead>Employee Name</TableHead>
                                        <TableHead className="text-center">Employee Code</TableHead>
                                        <TableHead>User Name</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <TableRow key={index} className="hover:bg-blue-50/30 transition-colors">
                                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                        {isAdmin ? (
                                            <>
                                                <TableCell>{user.intname || user.mI_Name || '------'}</TableCell>
                                                <TableCell className="font-semibold text-blue-700">{user.user_Name}</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>{user.stafname || '------'}</TableCell>
                                                <TableCell className="text-center">{user.hrmE_EmployeeCode || '------'}</TableCell>
                                                <TableCell className="font-semibold text-blue-700">{user.user_Name}</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 3 : 4} className="h-24 text-center text-gray-500 italic">
                                        No users found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
