'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { AddForm } from './_components/add-form';
import { columns } from './_components/columns';
import { StudentHouseMappingDTO } from '@/types/sports/masters/student-house-mapping';
import {
    getStudentHouseMappings,
    deleteStudentHouseMapping,
} from '@/actions/sports/masters/student-house-mapping';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StudentHouseMappingPage() {
    const [data, setData] = useState<StudentHouseMappingDTO[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingData, setEditingData] = useState<StudentHouseMappingDTO | null>(null);
    const [loading, setLoading] = useState(true);

    // Confirmation Dialog State
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [actionType, setActionType] = useState<'activate' | 'deactivate' | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedActiveFlag, setSelectedActiveFlag] = useState<boolean | null>(null);


    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getStudentHouseMappings();
            setData(result);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (record: StudentHouseMappingDTO) => {
        setEditingData(record);
        setIsAdding(true);
    };

    const handleDeleteClick = (id: number, activeFlag: boolean) => {
        setSelectedId(id);
        setSelectedActiveFlag(activeFlag);
        setActionType(activeFlag ? 'deactivate' : 'activate');
        setConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (selectedId !== null && selectedActiveFlag !== null) {
            try {
                const result = await deleteStudentHouseMapping(selectedId, selectedActiveFlag);
                if (result.success) {
                    toast.success(result.message);
                    loadData();
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                console.error(error);
                console.error(error);
                toast.error('Something went wrong');
            }
        }
        setConfirmOpen(false);
        setSelectedId(null);
        setSelectedActiveFlag(null);
        setActionType(null);
    };

    const handleSuccess = () => {
        setIsAdding(false);
        setEditingData(null);
        loadData();
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingData(null);
    };

    return (
        <div className="space-y-6">


            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Student House Mapping</CardTitle>
                    {!isAdding && (
                        <Button onClick={() => setIsAdding(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Mapping
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isAdding ? (
                        <AddForm
                            onSuccess={handleSuccess}
                            onCancel={handleCancel}
                            initialData={editingData}
                        />
                    ) : (
                        <DataTable<StudentHouseMappingDTO, unknown>
                            columns={columns(handleEdit, handleDeleteClick)}
                            data={data}
                            isLoading={loading}
                            totalItems={data.length}
                        />
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to {actionType} this record?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmAction}>
                            Yes, {actionType} it!
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
