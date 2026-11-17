'use client';

import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { Button } from '@/components/ui/button';
import { useInvTItemConsumption } from '@/hooks/inventory/transactions/use-inv-t-item-consumption';
import type { InvTItemConsumption } from '@/types/inventory/transactions/inv-t-item-consumption';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from 'lucide-react';

interface ViewStaffModalProps {
    rowData: InvTItemConsumption;
    onClose: () => void;
}

export function ViewStaffModal({ rowData, onClose }: ViewStaffModalProps) {
    const { getICUserDetailsMutation } = useInvTItemConsumption();
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await getICUserDetailsMutation.mutateAsync({
                    INVMIC_Id: rowData.invmiC_Id,
                    userflag: rowData.invmiC_StuOtherFlg
                });
                const data = response?.data || response;
                if (Array.isArray(data)) {
                    setStaff(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setStaff(data.data);
                }
            } catch (error) {
                console.error('Error fetching IC staff details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (rowData.invmiC_Id) {
            fetchData();
        }
    }, [rowData.invmiC_Id, rowData.invmiC_StuOtherFlg]);

    return (
        <AdaptiveDialog title={`Staff Details: ${rowData.invmiC_ICNo}`} isOpen={true} onClose={onClose} size="lg">
            <AdaptiveBody className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="flex h-48 items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[60vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
                            {staff.map((s, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all duration-200">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">{s.username || s.employeename || s.hrmE_EmployeeName}</span>
                                        <span className="text-xs text-muted-foreground">{s.extra_code || s.hrme_employeecode || s.hrmE_EmployeeCode || 'No Code'}</span>
                                    </div>
                                </div>
                            ))}
                            {staff.length === 0 && (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                    <div className="p-3 rounded-full bg-muted">
                                        <User className="h-6 w-6 opacity-20" />
                                    </div>
                                    <p className="text-sm italic">No staff members assigned to this record.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                )}
            </AdaptiveBody>
            <AdaptiveFooter>
                <Button onClick={onClose} variant="outline" className="px-8 shadow-sm">Close</Button>
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
