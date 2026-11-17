'use server';

import { revalidatePath } from 'next/cache';
import { IBed, IBedDisplay, IFloor, IHostel, IRoom, IRoomCategory } from '@/types/hostel/hostel-management/masters';

// --- Mock Data ---

const MOCK_HOSTELS: IHostel[] = [
    {
        hlmH_Id: 1,
        hlmH_Name: 'Main Hostel - Boys',
        hlmH_ActiveFlag: true,
        hlmH_BoysGirlsFlg: 'Boys',
        hlmH_TotalCapacity: 100,
        hlmH_ContactNo: '1234567890',
        hlmH_Address: 'Address 1',
        ivrmmC_Id: 1,
        ivrmmS_Id: 1,
        hlmH_City: 'City',
        hlmH_Pincode: 560000,
        hlmH_TotalFloor: 3,
        hlmH_TotalRoom: 30,
        facilities: [],
        wardens: [],
        messes: [],
        documents: []
    },
    {
        hlmH_Id: 2,
        hlmH_Name: 'Main Hostel - Girls',
        hlmH_ActiveFlag: true,
        hlmH_BoysGirlsFlg: 'Girls',
        hlmH_TotalCapacity: 100,
        hlmH_ContactNo: '1234567890',
        hlmH_Address: 'Address 2',
        ivrmmC_Id: 1,
        ivrmmS_Id: 1,
        hlmH_City: 'City',
        hlmH_Pincode: 560000,
        hlmH_TotalFloor: 3,
        hlmH_TotalRoom: 30,
        facilities: [],
        wardens: [],
        messes: [],
        documents: []
    }
];

const MOCK_FLOORS: IFloor[] = [
    {
        hlmF_Id: 1,
        hrmF_FloorName: 'Ground Floor',
        hlmH_Id: 1,
        hrmF_TotalRooms: 10,
        hrmF_FloorDesc: 'Ground Floor Description',
        hrmF_ActiveFlag: true,
        facilities: []
    },
    {
        hlmF_Id: 2,
        hrmF_FloorName: 'First Floor',
        hlmH_Id: 1,
        hrmF_TotalRooms: 12,
        hrmF_FloorDesc: 'First Floor Description',
        hrmF_ActiveFlag: true,
        facilities: []
    },
    {
        hlmF_Id: 3,
        hrmF_FloorName: 'Ground Floor',
        hlmH_Id: 2,
        hrmF_TotalRooms: 10,
        hrmF_FloorDesc: 'Ground Girls Floor',
        hrmF_ActiveFlag: true,
        facilities: []
    }
];

const MOCK_ROOMS: IRoom[] = [
    {
        hrmrM_Id: 1,
        hrmrM_RoomNo: '101',
        hlmF_Id: 1,
        hlmH_Id: 1,
        hlmrcA_Id: 1,
        hrmrM_BedCapacity: 2,
        hrmrM_ACFlg: false,
        hrmrM_SharingFlg: true,
        hrmrM_RoomForStudentFlg: true,
        hrmrM_RoomForStaffFlg: false,
        hrmrM_RoomForGuestFlg: false,
        hrmrM_ActiveFlag: true,
        facilities: []
    },
    {
        hrmrM_Id: 2,
        hrmrM_RoomNo: '102',
        hlmF_Id: 1,
        hlmH_Id: 1,
        hlmrcA_Id: 1,
        hrmrM_BedCapacity: 3,
        hrmrM_ACFlg: true,
        hrmrM_SharingFlg: true,
        hrmrM_RoomForStudentFlg: true,
        hrmrM_RoomForStaffFlg: false,
        hrmrM_RoomForGuestFlg: false,
        hrmrM_ActiveFlag: true,
        facilities: []
    },
    {
        hrmrM_Id: 3,
        hrmrM_RoomNo: '201',
        hlmF_Id: 2,
        hlmH_Id: 1,
        hlmrcA_Id: 2,
        hrmrM_BedCapacity: 4,
        hrmrM_ACFlg: false,
        hrmrM_SharingFlg: true,
        hrmrM_RoomForStudentFlg: true,
        hrmrM_RoomForStaffFlg: false,
        hrmrM_RoomForGuestFlg: false,
        hrmrM_ActiveFlag: true,
        facilities: []
    },
    {
        hrmrM_Id: 4,
        hrmrM_RoomNo: 'G-01',
        hlmF_Id: 3,
        hlmH_Id: 2,
        hlmrcA_Id: 3,
        hrmrM_BedCapacity: 2,
        hrmrM_ACFlg: true,
        hrmrM_SharingFlg: true,
        hrmrM_RoomForStudentFlg: true,
        hrmrM_RoomForStaffFlg: false,
        hrmrM_RoomForGuestFlg: true,
        hrmrM_ActiveFlag: true,
        facilities: []
    }
];

const MOCK_ROOM_CATEGORIES: IRoomCategory[] = [
    {
        hlmrcA_Id: 1,
        hlmH_Id: 1,
        hlmF_Id: 1,
        fmG_Id: 1,
        hlmrcA_RoomCategory: 'Deluxe',
        hlmrcA_SORate: 5000,
        hlmrcA_RoomRate: 5000,
        hlmrcA_MaxCapacity: 2,
        hlmrcA_Description: 'Deluxe Room',
        hlmrcA_ACFlg: true,
        hlmrcA_SharingFlg: true,
        hlmrcA_ActiveFlag: true
    },
    {
        hlmrcA_Id: 2,
        hlmH_Id: 1,
        hlmF_Id: 1,
        fmG_Id: 1,
        hlmrcA_RoomCategory: 'Standard',
        hlmrcA_SORate: 3000,
        hlmrcA_RoomRate: 3000,
        hlmrcA_MaxCapacity: 4,
        hlmrcA_Description: 'Standard Room',
        hlmrcA_ACFlg: false,
        hlmrcA_SharingFlg: true,
        hlmrcA_ActiveFlag: true
    },
    {
        hlmrcA_Id: 3,
        hlmH_Id: 2,
        hlmF_Id: 3,
        fmG_Id: 1,
        hlmrcA_RoomCategory: 'Deluxe Girls',
        hlmrcA_SORate: 5000,
        hlmrcA_RoomRate: 5000,
        hlmrcA_MaxCapacity: 2,
        hlmrcA_Description: 'Deluxe Room',
        hlmrcA_ACFlg: true,
        hlmrcA_SharingFlg: true,
        hlmrcA_ActiveFlag: true
    }
];

const MOCK_BEDS: IBed[] = [
    {
        hlmB_Id: 1,
        hlmH_Id: 1,
        hlmF_Id: 1,
        hrmrM_Id: 1,
        hlmB_BedName: 'B1',
        hlmB_MattressFlg: true,
        hlmB_BedSheetFlg: true,
        hlmB_PillowFlg: true,
        hlmB_StudyTableFlg: false,
        hlmB_LampFlg: false,
        hlmB_ActiveFlag: true
    },
    {
        hlmB_Id: 2,
        hlmH_Id: 1,
        hlmF_Id: 1,
        hrmrM_Id: 1,
        hlmB_BedName: 'B2',
        hlmB_MattressFlg: true,
        hlmB_BedSheetFlg: true,
        hlmB_PillowFlg: true,
        hlmB_StudyTableFlg: true,
        hlmB_LampFlg: true,
        hlmB_ActiveFlag: true
    }
];

// --- Actions ---

export async function fetchBedData() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const gridData: IBedDisplay[] = MOCK_BEDS.map((bed) => ({
        ...bed,
        hlmH_Name: MOCK_HOSTELS.find((h) => h.hlmH_Id === bed.hlmH_Id)?.hlmH_Name || 'Unknown',
        hrmF_FloorName: MOCK_FLOORS.find((f) => f.hlmF_Id === bed.hlmF_Id)?.hrmF_FloorName || 'Unknown',
        hrmrM_RoomNo: MOCK_ROOMS.find((r) => r.hrmrM_Id === bed.hrmrM_Id)?.hrmrM_RoomNo || 'Unknown'
    }));

    return {
        success: true,
        data: {
            hostels: MOCK_HOSTELS,
            bedList: gridData
        }
    };
}

export async function fetchFloors(hostelId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const floors = MOCK_FLOORS.filter((f) => f.hlmH_Id === hostelId);
    const categories = MOCK_ROOM_CATEGORIES.filter((c) => c.hlmH_Id === hostelId);
    return { floors, categories };
}

export async function fetchRooms(floorId: number) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const rooms = MOCK_ROOMS.filter((r) => r.hlmF_Id === floorId);
    return { rooms };
}

export async function saveBed(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
        const isUpdate = !!data.HLMB_Id;

        const newBed: IBed = {
            hlmB_Id: data.HLMB_Id || Math.floor(Math.random() * 100000),
            hlmH_Id: Number(data.HLMH_Id),
            hlmF_Id: Number(data.HLMF_Id),
            hrmrM_Id: Number(data.HRMRM_Id),
            hlmB_BedName: data.HLMB_BedName,
            hlmB_MattressFlg: data.HLMB_MattressFlg,
            hlmB_BedSheetFlg: data.HLMB_BedSheetFlg,
            hlmB_PillowFlg: data.HLMB_PillowFlg,
            hlmB_StudyTableFlg: data.HLMB_StudyTableFlg,
            hlmB_LampFlg: data.HLMB_LampFlg,
            hlmB_ActiveFlag: true
        };

        if (isUpdate) {
            const index = MOCK_BEDS.findIndex((b) => b.hlmB_Id === Number(data.HLMB_Id));
            if (index !== -1) {
                MOCK_BEDS[index] = { ...MOCK_BEDS[index], ...newBed };
                revalidatePath('/hostel/masters/master-bed');
                return { success: true, message: 'Bed updated successfully' };
            }
            return { success: false, message: 'Bed not found' };
        } else {
            MOCK_BEDS.push(newBed);
            revalidatePath('/hostel/masters/master-bed');
            return { success: true, message: 'Bed saved successfully' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to save bed' };
    }
}

export async function deleteBed(id: number) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = MOCK_BEDS.findIndex((b) => b.hlmB_Id === id);
    if (index !== -1) {
        const bed = MOCK_BEDS[index];
        bed.hlmB_ActiveFlag = !bed.hlmB_ActiveFlag;
        revalidatePath('/hostel/masters/master-bed');
        return { success: true, message: `Bed ${bed.hlmB_ActiveFlag ? 'activated' : 'deactivated'} successfully` };
    }
    return { success: false, message: 'Bed not found' };
}
