import { z } from 'zod';

export const MasterSportsCCNameUOMSchema = z.object({
    spccmsccuoM_Id: z.number().default(0),
    spccmscC_Id: z.number({ required_error: "Select Sports Name" }).min(1, "Select Sports Name"),
    spccmuoM_Id: z.number({ required_error: "Select UOM" }).min(1, "Select UOM"),
    spccmsccuoM_ActiveFlag: z.boolean().default(true).optional(),

    // Display fields for table - optional in schema as they come from API
    sportsCCName: z.string().optional(),
    uomName: z.string().optional(),
});

export type IMasterSportsCCNameUOM = z.infer<typeof MasterSportsCCNameUOMSchema>;

export interface ISportsCCName {
    spccmscC_Id: number;
    spccmsccG_Id: number;
    mI_Id: number;
    spccmscC_SportsCCName: string;
    spccmscC_NoOfMembers: number;
    spccmscC_ActiveFlag: boolean;
    count: number;
    retval: boolean;
}

export interface IUOM {
    spccmuoM_Id: number;
    mI_Id: number;
    spccmuoM_UOMName: string;
    spccmuoM_ActiveFlag: boolean;
    count: number;
    returnVal: boolean;
    returnVal_update: boolean;
    duplicate_UOM_name_bool: boolean;
}

export interface IMasterSportsCCNameUOMResponse {
    sportsccName: ISportsCCName[];
    uom: IUOM[];
    sportsccUom: IMasterSportsCCNameUOM[];
    count: number;
}
