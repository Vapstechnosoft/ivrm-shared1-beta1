import { z } from "zod";
import { createCustomStringSchema, deleteIdSchema } from "../validationSchemas";



export const masterAreaSchema = {
    addOrUpdate: z.object({
        trmA_Id: z.number().optional(),

        trmA_AreaName: z
            .string()
            .min(1, { message: 'Please Enter Zone/ Area Name' })
            .regex(/^[a-zA-Z0-9\s]+$/, {
                message: 'Only letters, numbers, and spaces are allowed'
            }),

        trmA_AliasName: z
            .string()
            .min(1, { message: 'Please Enter Alias Name' })
    }),

    delete: z.object({
        trmA_Id: deleteIdSchema('trmA_Id')
    })
};

export const masterDriverSchema = {
    addOrUpdate: z.object({
        trmD_Id: z.number().optional(),
        trmD_DriverName: z.string().min(1, 'Driver Name is required').max(100),
        trmD_DriverCode: z.string().min(1, 'Driver Code is required'),
        trmD_DLNo: z
            .string()
            .min(16, 'Enter Minimum 16 Digits Alpha Numeric')
            .regex(/^[a-zA-Z0-9\s]+$/, 'Only Alpha Numeric Allowed'),
        trmD_DriverBadgeNo: z.string().min(1, 'Driver Badge No is required'),
        trmD_MobileNo: z.string().length(10, 'Mobile No must be 10 digits').regex(/^[0-9]+$/, 'Only Numbers Allowed'),
        trmD_EmailId: z.string().email('Invalid Email').optional().or(z.literal('')),
        trmD_LicenseType: z.string().min(1, 'License Type is required'),
        trmD_DLExpiryDate: z.union([z.date(), z.string({ required_error: 'DL Expiring Date is required' })]),
        trmD_RTOName: z.string().min(1, 'RTO Name is required'),
        trmD_MTExpiryDate: z.union([z.date(), z.string()]).optional().nullable(),
        trmD_SDExpiryDate: z.union([z.date(), z.string({ required_error: 'Safe Driving Expiring Date is required' })]),
        trmD_SpareDriverFlg: z.boolean().default(false)
    }),

    delete: z.object({
        trmD_Id: deleteIdSchema('trmD_Id')
    })
};

export const masterFuelTypeSchema = {
    addOrUpdate: z.object({
        trmfT_Id: z.number().optional(),
        trmfT_FuelType: z
            .string()
            .min(1, 'Fuel Type is required')
            .regex(/^[a-zA-Z0-9\s]+$/, 'Only Alpha Numeric Allowed')
    }),

    delete: z.object({
        trmfT_Id: deleteIdSchema('trmfT_Id')
    })
};


export const masterLocationSchema = {
    addOrUpdate: z.object({
        trmL_Id: z.number().optional(),
        trmL_LocationName: z
            .string()
            .min(1, 'Location Name is required')
            .regex(/^[a-zA-Z0-9\s]+$/, 'Only Alpha Numeric Allowed'),
        trmL_Latitude: z
            .string()
            .min(1, 'Latitude is required'),
        trmL_Longitude: z
            .string()
            .min(1, 'Longitude is required'),
    }),

    delete: z.object({
        trmL_Id: deleteIdSchema('trmL_Id')
    })
};

export const masterRouteSchema = {
    addOrUpdate: z.object({
        trmR_Id: z.number().optional(),
        trmR_RouteName: z.string().min(1, 'Route Name is required').regex(/^[a-zA-Z\s.]+$/, 'Only Alphabets and Dots Allowed'),
        trmR_RouteDesc: z.string().min(1, 'Description is required').max(20),
        trmR_RouteNo: z.string().min(1, 'Route No is required').max(20).regex(/^[a-zA-Z0-9\s]+$/, 'Only Alpha Numeric Allowed'),
        trmR_order: z.coerce.number().min(1, 'Order is required')
    }),

    delete: z.object({
        trmR_Id: deleteIdSchema('trmR_Id')
    })
};

export const routeAreaMappingSchema = {
    addOrUpdate: z.object({
        trmR_Id: z.coerce.number().min(1, 'Please Select Route'),
        selectedAreaIds: z.array(z.number()).min(1, 'Please Select At Least One Area')
    })
};

export const masterServiceStationSchema = {
    addOrUpdate: z.object({
        TRMSST_Id: z.number().optional(),
        TRMSST_ServiceStationName: z.string().min(1, 'Service Station Name is required').max(100),
        TRMSST_ContactNo: z.string().length(10, 'Mobile No must be 10 digits').regex(/^[0-9]+$/, 'Only Numbers Allowed'),
        TRMSST_EmailId: z.string().email('Invalid Email Id').max(100),
        TRMSST_Address: z.string().min(1, 'Address is required').max(250)
    }),

    delete: z.object({
        TRMSST_Id: deleteIdSchema('TRMSST_Id')
    })
};

export const masterSessionSchema = {
    addOrUpdate: z.object({
        TRMS_Id: z.number().optional(),
        TRMS_SessionName: z.string().min(1, 'Session Name is required').regex(/^[a-zA-Z\s]+$/, 'Only Alphabets and Spaces Allowed'),
        TRMS_SessionDesc: z.string().min(1, 'Session Description is required'),
        TRMS_Flag: z.enum(['Pick Up', 'Drop'], { required_error: 'Please select Pick Up or Drop' })
    }),

    delete: z.object({
        TRMS_Id: deleteIdSchema('TRMS_Id')
    })
};

export const masterVehicleTypeSchema = {
    addOrUpdate: z.object({
        TRMVT_Id: z.number().optional(),
        TRMVT_VehicleType: z.string().min(1, 'Vehicle Type is required').regex(/^[a-zA-Z\s]+$/, 'Only Alphabets and Spaces Allowed'),
        TRMVT_VehicleDesc: z.string().min(1, 'Vehicle Description is required')
    }),

    delete: z.object({
        TRMVT_Id: deleteIdSchema('TRMVT_Id')
    })
};

export const masterRouteScheduleSchema = {
    addOrUpdate: z.object({
        TRRSC_Id: z.number().optional(),
        TRRSC_ScheduleName: z.string().min(1, 'Schedule Name is required').regex(/^[a-zA-Z\s]+$/, 'Only Alphabets and Spaces Allowed')
    }),

    delete: z.object({
        TRRSC_Id: deleteIdSchema('TRRSC_Id')
    })
};


