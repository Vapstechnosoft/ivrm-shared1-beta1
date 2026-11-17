'use client';

import { useEffect, useState } from 'react';
import BMICalculationForm from './add-form';
import { IBMICalculation, IStudentBMIEntry } from '@/types/sports/transactions/bmi-calculation';
import { useBMICalculation } from '@/hooks/sports/useBMICalculation';
import { Loader2 } from 'lucide-react';

interface UpdateBMICalculationFormProps {
    onSuccess?: () => void;
    selectedRow: IBMICalculation;
}

export default function UpdateBMICalculationForm({ onSuccess, selectedRow }: UpdateBMICalculationFormProps) {
    const { edit } = useBMICalculation();
    const [fetchedData, setFetchedData] = useState<IBMICalculation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEditData = async () => {
            setIsLoading(true);
            try {
                // Support both casing for IDs from selectedRow
                const params = {
                    ASMAY_Id: selectedRow.ASMAY_Id || (selectedRow as any).asmaY_Id,
                    SPCCSHW_Id: selectedRow.SPCCSHW_Id || (selectedRow as any).spccshW_Id,
                    ASMCL_Id: selectedRow.ASMCL_Id || (selectedRow as any).asmcL_Id,
                    ASMS_Id: selectedRow.ASMS_Id || (selectedRow as any).asmS_Id
                };

                const result = await edit.mutateAsync(params);

                if (result.success && result.data && result.data.editlist && result.data.editlist.length > 0) {
                    const editDetails = result.data.editlist[0];
                    const allStudents = result.data.studentList || [];

                    // Map all students, but only populate data for the one being edited
                    const studentEntries: IStudentBMIEntry[] = allStudents.map((s: any) => {
                        const studentId = s.amsT_Id || s.AMST_Id;
                        const editStudentId = editDetails.amsT_Id || editDetails.AMST_Id;
                        const isMatch = studentId === editStudentId;

                        if (isMatch) {
                            return {
                                AMST_Id: editStudentId,
                                studentName: editDetails.studentName || editDetails.StudentName,
                                AMST_AdmNo: editDetails.amsT_AdmNo || editDetails.AMST_AdmNo,
                                SPCCSHW_Weight: editDetails.spccshW_Weight ?? editDetails.SPCCSHW_Weight ?? 0,
                                SPCCSHW_Height: editDetails.spccshW_Height ?? editDetails.SPCCSHW_Height ?? 0,
                                SPCCSHW_BMI: editDetails.spccshW_BMI ?? editDetails.SPCCSHW_BMI ?? 0,
                                SPCCSHW_BMIRemark: editDetails.spccshW_BMIRemark || editDetails.SPCCSHW_BMIRemark || '',
                                selected: true
                            };
                        }

                        return {
                            AMST_Id: studentId,
                            studentName: s.studentName || s.StudentName,
                            AMST_AdmNo: s.amsT_AdmNo || s.AMST_AdmNo,
                            SPCCSHW_Weight: 0,
                            SPCCSHW_Height: 0,
                            SPCCSHW_BMI: 0,
                            SPCCSHW_BMIRemark: '',
                            selected: false
                        };
                    });

                    setFetchedData({
                        ...selectedRow,
                        ASMAY_Id: editDetails.asmaY_Id || editDetails.ASMAY_Id,
                        ASMCL_Id: editDetails.asmcL_Id || editDetails.ASMCL_Id,
                        ASMS_Id: editDetails.asmS_Id || editDetails.ASMS_Id,
                        SPCCSHW_AsOnDate: editDetails.spccshW_AsOnDate || editDetails.SPCCSHW_AsOnDate,
                        SPCCSHW_Id: editDetails.spccshW_Id || editDetails.SPCCSHW_Id,
                        student: studentEntries
                    });
                }
            } catch (error) {
                console.error('Failed to fetch edit data', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedRow) {
            fetchEditData();
        }
    }, [selectedRow]);

    if (isLoading) {
        return <div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!fetchedData) {
        return <div>Failed to load data</div>;
    }

    return <BMICalculationForm onSuccess={onSuccess} selectedRow={fetchedData} />;
}
