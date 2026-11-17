export interface IMasterRackDetails {
    lmrA_Id: number;
    lmraS_Id: number;
    mI_Id: number;
    lmrA_BuildingName: string;
    lmrA_RackName: string;
    lmS_Id: number;
    lmS_SubjectName?: string;
    lmrA_FloorName: string;
    lmrA_DisplayColour?: string;
    lmrA_Location: string;
    lmrA_ActiveFlag: boolean;
    lmrA_CreatedBy?: number;
    lmrA_UpdatedBy?: number;
    createdDate?: string;
    updatedDate?: string;
}
