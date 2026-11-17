'use client';

import { editSchoolMasterUnit } from '@/server/lesson-planner/master/school-master-unit';
import type { IMasterSchoolUnit } from '@/types/lesson-planner/master/school-master-unit';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddMasterSchoolUnitForm from './add-form';

interface UpdateMasterSchoolUnitFormProps {
    selectedRow: IMasterSchoolUnit;
    onSuccess?: () => void;
    mI_Id?: number;
    userId?: number;
    className?: string;
}

export default function UpdateMasterSchoolUnitForm({
    selectedRow,
    onSuccess,
    mI_Id,
    userId,
    className = ''
}: UpdateMasterSchoolUnitFormProps) {
    const [editData, setEditData] = useState<IMasterSchoolUnit | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEditDetails = async () => {
            setIsLoading(true);
            try {
                const res: any = await editSchoolMasterUnit(selectedRow.lpmU_Id);
                console.log('Edit API Response:', res);

                if (res.success && res.data) {
                    const editArray = Array.isArray(res.data)
                        ? res.data
                        : res.data.geteditdetails || res.data.editdetail || res.data.editdetails || [];

                    if (editArray.length > 0) {
                        setEditData(editArray[0]);
                    } else {
                        console.error('Record not found in API response:', res);
                        setEditData(selectedRow);
                    }
                } else {
                    console.error('Invalid API response structure or empty data:', res);
                    setEditData(selectedRow);
                }
            } catch (error) {
                console.error('Error fetching edit details:', error);
                toast.error(`Failed to fetch edit details: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setEditData(selectedRow);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEditDetails();
    }, [selectedRow]);

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className='text-muted-foreground'>Loading edit details...</div>
            </div>
        );
    }

    if (!editData) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className='text-destructive'>Failed to load edit data</div>
            </div>
        );
    }

    return (
        <div className={className}>
            <AddMasterSchoolUnitForm initialData={editData} onSuccess={onSuccess} mI_Id={mI_Id} userId={userId} />
        </div>
    );
}
