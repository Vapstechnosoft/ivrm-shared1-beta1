export interface IUnit {
    lpmU_Id: number;
    lpmU_UnitName: string;
    Selected?: boolean;
}

export interface ITopic {
    lpmT_Id: number;
    lpmT_TopicName: string;
    Selected?: boolean;
}

export interface IMappingGridItem {
    lpmuT_Id: number;
    lpmU_Id: number;
    lpmT_Id: number;
    lpmU_UnitName: string;
    lpmT_TopicName: string;
    lpmuT_ActiveFlag: boolean;
}

export interface ITopicMappingDTO {
    lpmT_Id: number;
}

export interface ISaveMappingPayload {
    lpmU_Id: number;
    schoolMasterUnitTopicMappingTempDTO: ITopicMappingDTO[];
}

export interface IInitialDataResponse {
    getunitdetails: IUnit[];
    getgriddetails: IMappingGridItem[];
}

export interface ITopicResponse {
    gettopicdetails: ITopic[];
}

export interface IApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    total?: number | null;
    page?: number | null;
    page_size?: number | null;

    // Legacy support for data extraction helper
    returnval?: boolean;
    getunitdetails?: IUnit[];
    getgriddetails?: IMappingGridItem[];
    gettopicdetails?: ITopic[];
}
