export interface SportsCCNameDTO {
    spccmscC_Id: number;
    spccmsccG_Id: number;
    mI_Id?: number;
    spccmscC_SportsCCName: string;
    spccmscC_SportsCCDesc: string;
    spccmscC_SGFlag: string;
    spccmscC_NoOfMembers: number;
    spccmscC_RecHighLowFlag: string;
    spccmscC_RecInfo: string;
    spccmscC_MultiAttemptFlg: boolean;
    spccmscC_NoOfAttempts?: number | null;
    spccmscC_ActiveFlag?: boolean;
    createdDate?: string;
    updatedDate?: string;
    tempDatas?: SportsCCNameSubEventDTO[];

    // Display properties from API response
    groupName?: string;
    count?: number;
    retval?: boolean;
}

export interface SportsCCNameSubEventDTO {
    spccmsccG_Id?: number;
    spccmsccG_UnderEvent: string;

    // Additional properties from API response for existing sub-events
    mI_Id?: number;
    spccmsccG_SportsCCGroupName?: string; // Appears to be the mapped name in response
    spccmsccG_SportsCCGroupDesc?: string;
    spccmsccG_SCCFlag?: string;
    spccmsccG_ActiveFlag?: boolean;
    spccmsccG_Under?: number;
    spccmsccG_Level?: number;
    createdDate?: string;
    updatedDate?: string;
}

export interface SportsCCNameGroupDTO {
    spccmsccG_Id: number;
    mI_Id: number;
    spccmsccG_SportsCCGroupName: string;
    spccmsccG_SportsCCGroupDesc: string;
    spccmsccG_SCCFlag: string;
    spccmsccG_ActiveFlag: boolean;
    spccmsccG_Under: number;
    createdDate: string;
    updatedDate: string;
}

export interface SportsCCNameMasterDataDTO {
    groupNameList: SportsCCNameGroupDTO[];
    sportsccName: SportsCCNameDTO[];
    count: number;
}

export interface SportsCCNameEditDetailsDTO {
    editDetails: SportsCCNameDTO[];
    subEvents: SportsCCNameSubEventDTO[];
}
