'use client';

import { IMasterHostelForm } from '@/schemas/hostel/master-hostel.schema';
import { getHostelPhotos, getMappedEmployees, getMappedFacilities, getMappedMesses, ICountry, IEmployee, IFacility, IMess, IState } from '@/server/hostel/hostel-management/masters/hostel';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddMasterHostelForm from './add-form';

interface UpdateMasterHostelFormProps {
    rowData: any;
    onSuccess: () => void;
    countries: ICountry[];
    facilities: IFacility[];
    messes: IMess[];
    employees: IEmployee[];
}

export default function UpdateMasterHostelForm({
    rowData,
    onSuccess,
    countries,
    facilities,
    messes,
    employees
}: UpdateMasterHostelFormProps) {
    const [initialData, setInitialData] = useState<Partial<IMasterHostelForm> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!rowData?.hlmH_Id) {
                setInitialData({
                    ...rowData,
                    ivrmmC_Id: rowData.ivrmmC_Id?.toString(),
                    ivrmmS_Id: rowData.ivrmmS_Id?.toString()
                });
                setIsLoading(false);
                return;
            }

            try {
                const hostelId = rowData.hlmH_Id;

                // Fetch mapped details using the specific API functions
                const [facilitiesRes, wardensRes, messesRes, photosRes] = await Promise.all([
                    getMappedFacilities(hostelId).catch(e => ({ data: [] })),
                    getMappedEmployees(hostelId).catch(e => ({ data: [] })),
                    getMappedMesses(hostelId).catch(e => ({ data: [] })),
                    getHostelPhotos(hostelId).catch(e => ({ data: [] }))
                ]);


                // Extract IDs for multi-selects
                // Facilities
                const selectedFacilityIds = (facilitiesRes?.data || []).map((item: any) => item.hlmftY_Id).filter(Boolean);

                // Wardens
                const selectedWardenIds = (wardensRes?.data || []).map((item: any) => item.hrmE_Id).filter(Boolean);

                // Messes
                const selectedMessIds = (messesRes?.data || []).map((item: any) => item.hlmM_Id).filter(Boolean);

                // Photos
                const hostelPhotos = (photosRes?.data || []).map((p: any) => ({
                    hlmhP_FileName: p.hlmhP_FileName,
                    hlmhP_FilePath: p.hlmhP_FilePath,
                    filetype: p.hlmhP_FileName?.split('.').pop()
                }));

                setInitialData({
                    ...rowData,
                    // Ensure Country and State are strings for the Select components
                    ivrmmC_Id: rowData.ivrmmC_Id?.toString(),
                    ivrmmS_Id: rowData.ivrmmS_Id?.toString(),

                    // Simple fields (ensure they are passed if not in rowData/undefined)
                    hlmH_TotalCapacity: rowData.hlmH_TotalCapacity,
                    hlmH_Pincode: rowData.hlmH_Pincode,
                    hlmH_TotalFloor: rowData.hlmH_TotalFloor,
                    hlmH_TotalRoom: rowData.hlmH_TotalRoom,

                    // Mapped Arrays
                    selectedFacilityIds,
                    selectedWardenIds,
                    selectedMessIds,
                    hostelPhotos
                });
            } catch (error) {
                console.error("Failed to fetch hostel details", error);
                toast.error("Failed to load some hostel details.");
                // Fallback to basic data
                setInitialData({
                    ...rowData,
                    ivrmmC_Id: rowData.ivrmmC_Id?.toString(),
                    ivrmmS_Id: rowData.ivrmmS_Id?.toString()
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [rowData]);

    if (isLoading) return <div>Loading details...</div>;

    return (
        <AddMasterHostelForm
            onSuccess={onSuccess}
            countries={countries}
            facilities={facilities}
            messes={messes}
            employees={employees}
            initialData={initialData}
        />
    );
}
