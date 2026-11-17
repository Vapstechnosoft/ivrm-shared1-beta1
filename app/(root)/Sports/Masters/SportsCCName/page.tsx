'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { createColumns } from './_components/columns';
import { AddForm } from './_components/add-form';
import { UpdateForm } from './_components/update-form';
import { ToggleForm } from './_components/toggle-form';
import { getSportsCCNameDetails } from '@/server/sports/masters/sports-cc-name';
import { SportsCCNameDTO, SportsCCNameGroupDTO } from '@/types/sports/masters/sports-cc-name';

export default function SportsCCNamePage() {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deletingActiveFlag, setDeletingActiveFlag] = useState<boolean>(false);
    const [data, setData] = useState<SportsCCNameDTO[]>([]);
    const [groupNameList, setGroupNameList] = useState<SportsCCNameGroupDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const result = await getSportsCCNameDetails();
            if (result && result.data) {
                setData(result.data.sportsccName || []);
                setGroupNameList(result.data.groupNameList || []);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleEdit = (item: SportsCCNameDTO) => {
        setEditingId(item.spccmscC_Id);
        setIsAdding(true);
    };

    const handleDelete = (row: SportsCCNameDTO) => {
        setDeletingId(row.spccmscC_Id);
        setDeletingActiveFlag(!!row.spccmscC_ActiveFlag);
    };

    const handleSuccess = () => {
        setIsAdding(false);
        setEditingId(null);
        setDeletingId(null);
        loadData();
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setDeletingId(null);
    };

    const columns = createColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isLoading && !data.length && !isAdding) {
        return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Master SportsCC Name</h1>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                )}
            </div>

            {isAdding ? (
                <div className="border rounded-lg p-6 bg-card">
                    {editingId ? (
                        <UpdateForm
                            id={editingId}
                            onSuccess={handleSuccess}
                            onCancel={handleCancel}
                            groupNameList={groupNameList}
                        />
                    ) : (
                        <AddForm
                            onSuccess={handleSuccess}
                            onCancel={handleCancel}
                            groupNameList={groupNameList}
                        />
                    )}
                </div>
            ) : (
                <div className="border rounded-lg bg-card">
                    <DataTable columns={columns} data={data} totalItems={data.length} />
                </div>
            )}

            {deletingId && (
                <ToggleForm
                    id={deletingId}
                    activeFlag={deletingActiveFlag}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
