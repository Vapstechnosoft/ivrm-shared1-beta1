'use server';

import { SportsCCNameDTO, SportsCCNameMasterDataDTO } from "@/types/sports/masters/sports-cc-name";

// Mock Data
let MOCK_GROUPS = [
    { spccmsccG_Id: 1, spccmsccG_SportsCCGroupName: 'Athletics' },
    { spccmsccG_Id: 2, spccmsccG_SportsCCGroupName: 'Team Sports' },
    { spccmsccG_Id: 3, spccmsccG_SportsCCGroupName: 'Indoor Games' },
    { spccmsccG_Id: 4, spccmsccG_SportsCCGroupName: 'Swimming' },
];

let MOCK_DATA: SportsCCNameDTO[] = [
    {
        spccmscC_Id: 1,
        spccmsccG_Id: 1,
        groupName: 'Athletics',
        spccmscC_SportsCCName: '100m Dash',
        spccmscC_SportsCCDesc: '100 meter sprint',
        spccmscC_SGFlag: 'Single',
        spccmscC_NoOfMembers: 1,
        spccmscC_RecHighLowFlag: 'High',
        spccmscC_RecInfo: 'Time in seconds',
        spccmscC_MultiAttemptFlg: false,
        spccmscC_ActiveFlag: true
    },
    {
        spccmscC_Id: 2,
        spccmsccG_Id: 2,
        groupName: 'Team Sports',
        spccmscC_SportsCCName: 'Football',
        spccmscC_SportsCCDesc: 'Standard Football',
        spccmscC_SGFlag: 'Group',
        spccmscC_NoOfMembers: 11,
        spccmscC_RecHighLowFlag: 'Low',
        spccmscC_RecInfo: 'Goals Scored',
        spccmscC_MultiAttemptFlg: false,
        spccmscC_ActiveFlag: true
    },
    {
        spccmscC_Id: 3,
        spccmsccG_Id: 3,
        groupName: 'Indoor Games',
        spccmscC_SportsCCName: 'Chess',
        spccmscC_SportsCCDesc: 'Standard Chess',
        spccmscC_SGFlag: 'Single',
        spccmscC_NoOfMembers: 1,
        spccmscC_RecHighLowFlag: 'High',
        spccmscC_RecInfo: 'Points',
        spccmscC_MultiAttemptFlg: false,
        spccmscC_ActiveFlag: false
    },
    {
        spccmscC_Id: 4,
        spccmsccG_Id: 1,
        groupName: 'Athletics',
        spccmscC_SportsCCName: 'Long Jump',
        spccmscC_SportsCCDesc: 'Long Jump Event',
        spccmscC_SGFlag: 'Single',
        spccmscC_NoOfMembers: 1,
        spccmscC_RecHighLowFlag: 'High',
        spccmscC_RecInfo: 'Distance in meters',
        spccmscC_MultiAttemptFlg: true,
        spccmscC_NoOfAttempts: 3,
        spccmscC_ActiveFlag: true,
        tempDatas: [{ spccmsccG_UnderEvent: 'Qualifiers' }, { spccmsccG_UnderEvent: 'Finals' }]
    }
];

export async function getSportsCCNameData(): Promise<SportsCCNameDTO[]> {
    return MOCK_DATA;
}

export async function getSportsCCNameMasterData(): Promise<SportsCCNameMasterDataDTO> {
    return {
        groupNameList: MOCK_GROUPS, // Corrected from gropList
        sportsccName: MOCK_DATA,
        count: MOCK_DATA.length
    } as any;
}

export async function saveSportsCCName(data: SportsCCNameDTO): Promise<{ success: boolean; message: string }> {
    console.log('Saving Data:', data);

    if (data.spccmscC_Id && data.spccmscC_Id > 0) {
        // Update
        const index = MOCK_DATA.findIndex(d => d.spccmscC_Id === data.spccmscC_Id);
        if (index !== -1) {
            const group = MOCK_GROUPS.find(g => g.spccmsccG_Id === data.spccmsccG_Id);
            MOCK_DATA[index] = { ...data, groupName: group?.spccmsccG_SportsCCGroupName, spccmscC_ActiveFlag: MOCK_DATA[index].spccmscC_ActiveFlag };
            return { success: true, message: 'Record Updated Successfully' };
        }
        return { success: false, message: 'Record not found' };
    } else {
        // Create
        const group = MOCK_GROUPS.find(g => g.spccmsccG_Id === data.spccmsccG_Id);
        const newRecord = {
            ...data,
            spccmscC_Id: Math.floor(Math.random() * 10000),
            groupName: group?.spccmsccG_SportsCCGroupName,
            spccmscC_ActiveFlag: true
        };
        MOCK_DATA.push(newRecord);
        return { success: true, message: 'Record Saved Successfully' };
    }
}

export async function deleteSportsCCName(id: number, activeFlag: boolean): Promise<{ success: boolean; message: string }> {
    const index = MOCK_DATA.findIndex(item => item.spccmscC_Id === id);
    if (index !== -1) {
        MOCK_DATA[index].spccmscC_ActiveFlag = !activeFlag;
        return { success: true, message: activeFlag ? 'Record Deactivated Successfully!' : 'Record Activated Successfully!' };
    }
    return { success: false, message: 'Record not found' };
}
