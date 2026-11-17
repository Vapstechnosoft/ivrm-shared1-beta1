'use client';

import AddMasterFloorForm from "./add-form";
import { IFacility, IHostel } from "@/types/hostel/hostel-management/masters";
import { IMasterFloor } from "./columns";

interface UpdateMasterFloorFormProps {
    rowData: IMasterFloor | any;
    onSuccess: () => void;
    hostels: IHostel[];
    facilities: IFacility[];
}

export default function UpdateMasterFloorForm({ rowData, onSuccess, hostels, facilities }: UpdateMasterFloorFormProps) {
    // Transform rowData if necessary to match form schema expectations
    // e.g., numbers to strings for inputs that expect strings during editing
    const initialData = {
        ...rowData,
        hlmH_Id: rowData.hlmH_Id?.toString(),
        hrmF_FloorName: rowData.hrmF_FloorName,
        hrmF_TotalRooms: rowData.hrmF_TotalRooms?.toString(),
        hrmF_FloorDesc: rowData.hrmF_FloorDesc,
        facilities: rowData.facilities || [], // Ensure this is matches the expected array format
    };

    return (
        <AddMasterFloorForm
            onSuccess={onSuccess}
            initialData={initialData}
        />
    );
}
