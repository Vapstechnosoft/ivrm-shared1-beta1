import { z } from 'zod';

export const routeLocationMappingSchema = {
    addOrUpdate: z.object({
        trmrL_Id: z.number().optional(),
        trmA_Id: z.number().min(1, 'Area is required'),
        trmR_Id: z.number().min(1, 'Route is required'),
        selectedLocationIds: z.array(z.number()).min(1, 'Select at least one location')
    }),

    delete: z.object({
        trmrL_Id: z.number()
    })
};

export const vehicleDriverMappingSchema = {
    addOrUpdate: z.object({
        trvD_Id: z.number().optional(),
        trmV_Id: z.number().min(1, 'Vehicle is required'),
        trmD_Id: z.number().min(1, 'Driver is required'),
        trmS_Id: z.number().min(1, 'Session is required'),
        trvD_Date: z.string().min(1, 'Date is required'),
        trmS_Flag: z.string().optional(),
        trmV_VehicleNo: z.string().optional(),
        trmD_DriverName: z.string().optional(),
        trmS_SessionName: z.string().optional()
    }),
    delete: z.object({
        trvD_Id: z.number()
    })
};

export const vehicleRouteMappingSchema = {
    addOrUpdate: z.object({
        trvR_Id: z.number().optional(),
        trmV_Id: z.number().min(1, 'Vehicle is required'),
        trmR_Id: z.number().min(1, 'Route is required'),
        trmS_Id: z.number().min(1, 'Session is required'),
        trvR_Date: z.string().min(1, 'Date is required'),
        trmS_Flag: z.string().optional(),
        trmV_VehicleNo: z.string().optional(),
        trmR_RouteName: z.string().optional(),
        trmS_SessionName: z.string().optional()
    }),
    delete: z.object({
        trvR_Id: z.number()
    })
};
