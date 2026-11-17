'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ApiResponse } from '@/lib/apiService';
import { getTransportReportData } from '@/server/transport/transport-module/reports/transport-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FileSpreadsheet, Loader2, Printer } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { z } from 'zod';

const formSchema = z.object({
    allorindiv: z.enum(['All', 'indi']),
    regorname_m: z.string().optional(),
    regorname_map: z.string().optional()
});

export default function TransportReportPage() {
    const { mutate: generateReport, isPending: isGenerating } = useMutation<ApiResponse<any>, Error, any>({
        mutationFn: async (data: any) => {
            const response = await getTransportReportData(data);
            return response;
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to fetch report data');
        }
    });
    const [reportData, setReportData] = useState<any[]>([]);
    const [currentReportType, setCurrentReportType] = useState<string>('');
    const [reportTitle, setReportTitle] = useState<string>('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            allorindiv: 'All',
            regorname_m: 'masterarea',
            regorname_map: 'routelocmap'
        }
    });

    const reportType = form.watch('allorindiv');
    const masterReportType = form.watch('regorname_m');
    const mapReportType = form.watch('regorname_map');

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setReportData([]);
        setSelectedRows([]);

        const payload = {
            onclickloaddata: values.allorindiv,
            regorname_m: values.allorindiv === 'All' ? values.regorname_m : undefined,
            regorname_map: values.allorindiv === 'indi' ? values.regorname_map : undefined
        };

        console.log('report payload', payload);
        generateReport(payload, {
            onSuccess: (response: any) => {
                console.log('transport report response', response);
                if (response && response.data && response.data.length > 0) {
                    setReportData(response.data);

                    // Set title based on selection
                    if (values.allorindiv === 'All') {
                        setCurrentReportType(values.regorname_m || '');
                        setReportTitle(getMasterReportTitle(values.regorname_m));
                    } else {
                        setCurrentReportType(values.regorname_map || '');
                        setReportTitle(getMapReportTitle(values.regorname_map));
                    }
                } else {
                    toast.warning('Record Not Found !!');
                }
            }
        });
    };

    const toggleRow = (index: number) => {
        setSelectedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === reportData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(reportData.map((_, i) => i));
        }
    };

    const getMasterReportTitle = (type?: string) => {
        switch (type) {
            case 'masterarea':
                return 'Master Area Report';
            case 'masterdriver':
                return 'Master Driver Report';
            case 'masterfueltype':
                return 'Master Fuel Report';
            case 'masterlocation':
                return 'Master Location Report';
            case 'masterroute':
                return 'Master Route Report';
            case 'mastervehical':
                return 'Master Vehicle Report';
            case 'mastervehicaltype':
                return 'Master Vehicle Type Report';
            case 'mastersession':
                return 'Master Session Report';
            case 'masterrouteschedule':
                return 'Master Schedule Report';
            default:
                return 'Transport Report';
        }
    };

    const getMapReportTitle = (type?: string) => {
        switch (type) {
            case 'routelocmap':
                return 'Route Location Mapping Report';
            case 'vehicalroutemap':
                return 'Vehicle Route Mapping Report';
            case 'vehicaldrivermap':
                return 'Vehicle Driver Mapping Report';
            case 'vehicaldriversubstitute':
                return 'Vehicle Driver Substitute Mapping Report';
            default:
                return 'Transport Report';
        }
    };

    const handleCancel = () => {
        form.reset({
            allorindiv: 'All',
            regorname_m: 'masterarea',
            regorname_map: 'routelocmap'
        });
        setReportData([]);
        setSelectedRows([]);
        setCurrentReportType('');
    };

    const handlePrint = () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one record to print');
            return;
        }

        const tableHeaderRow = document.querySelector('#report-table thead tr');
        let headerHtml = '';
        if (tableHeaderRow) {
            const clonedHeaderRow = tableHeaderRow.cloneNode(true) as HTMLElement;
            if (clonedHeaderRow.firstElementChild) clonedHeaderRow.removeChild(clonedHeaderRow.firstElementChild);
            headerHtml = clonedHeaderRow.outerHTML;
        }

        const selectedRowsHtml = selectedRows
            .sort((a, b) => a - b)
            .map((index) => {
                const row = document.querySelectorAll('#report-table tbody tr')[index];
                // Clone the row to modify it for print (remove check box)
                const clonedRow = row.cloneNode(true) as HTMLElement;
                if (clonedRow.firstElementChild) clonedRow.removeChild(clonedRow.firstElementChild); // Remove checkbox cell
                return clonedRow.outerHTML;
            })
            .join('');

        const popupWin = window.open('', '_blank', 'width=1000,height=1000');

        if (popupWin) {
            popupWin.document.open();
            popupWin.document.write(`
                <html>
                    <head>
                        <title>Transport Report</title>
                        <style>
                            body { font-family: 'Times New Roman', serif; padding: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                            th, td { border: 1px solid black; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; font-weight: bold; text-align: center;}
                            .text-center { text-align: center; }
                            h3 { text-align: center; margin-bottom: 20px; text-transform: uppercase; }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        <h3>${reportTitle}</h3>
                        <table>
                            <thead>${headerHtml}</thead>
                            <tbody>${selectedRowsHtml}</tbody>
                        </table>
                    </body>
                </html>
            `);
            popupWin.document.close();
        }
    };

    const handleExportExcel = () => {
        if (selectedRows.length === 0) {
            toast.warning('Please select at least one record to export');
            return;
        }

        const selectedData = reportData.filter((_, index) => selectedRows.includes(index));

        // Transform data for Excel (removing internal keys if needed, or mapping to display names)
        // For simplicity, we just export the raw filtered data, but ideally we should format it.
        // A better approach is to rely on table to book but filtering rows.

        // Create a new table element in memory to generate Excel from
        const tempTable = document.createElement('table');
        const header = document.querySelector('#report-table thead')?.cloneNode(true) as HTMLElement;
        if (header.firstElementChild?.firstElementChild) header.firstElementChild.removeChild(header.firstElementChild.firstElementChild); // Remove checkbox th
        tempTable.appendChild(header);

        const tbody = document.createElement('tbody');
        selectedRows
            .sort((a, b) => a - b)
            .forEach((index) => {
                const row = document.querySelectorAll('#report-table tbody tr')[index]?.cloneNode(true) as HTMLElement;
                if (row.firstElementChild) row.removeChild(row.firstElementChild); // Remove checkbox td
                tbody.appendChild(row);
            });
        tempTable.appendChild(tbody);

        const wb = XLSX.utils.table_to_book(tempTable);
        XLSX.writeFile(wb, `${reportTitle.replace(/ /g, '_')}_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
    };

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <Card className='w-full shadow-md'>
                <CardHeader className='border-b bg-primary/5'>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='font-bold text-primary text-xl'>Transport Report</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className='pt-6'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                            {/* Main Selection */}
                            <div className='flex justify-center rounded-lg border bg-muted/20 p-4'>
                                <FormField
                                    control={form.control}
                                    name='allorindiv'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className='flex space-x-8'>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='All' id='radio-all' />
                                                        <FormLabel htmlFor='radio-all' className='cursor-pointer font-semibold'>
                                                            Master Reports
                                                        </FormLabel>
                                                    </div>
                                                    <div className='flex items-center space-x-2'>
                                                        <RadioGroupItem value='indi' id='radio-indi' />
                                                        <FormLabel htmlFor='radio-indi' className='cursor-pointer font-semibold'>
                                                            Transaction Reports
                                                        </FormLabel>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Master Reports Sub-Selection */}
                            {reportType === 'All' && (
                                <div className='grid grid-cols-1 gap-4 rounded-lg border bg-muted/10 p-4 md:grid-cols-2 lg:grid-cols-2'>
                                    <FormField
                                        control={form.control}
                                        name='regorname_m'
                                        render={({ field }) => (
                                            <FormItem className='col-span-full'>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                        {[
                                                            { value: 'masterarea', label: 'Master Area' },
                                                            { value: 'masterdriver', label: 'Master Driver' },
                                                            { value: 'masterfueltype', label: 'Master Fuel Type' },
                                                            { value: 'masterlocation', label: 'Master Location' },
                                                            { value: 'masterroute', label: 'Master Route' },
                                                            { value: 'mastervehical', label: 'Master Vehicle' },
                                                            { value: 'mastervehicaltype', label: 'Master Vehicle Type' },
                                                            { value: 'mastersession', label: 'Master Session' },
                                                            { value: 'masterrouteschedule', label: 'Master Route Schedule' }
                                                        ].map((item) => (
                                                            <div key={item.value} className='flex items-center space-x-2'>
                                                                <RadioGroupItem value={item.value} id={`m-${item.value}`} />
                                                                <FormLabel htmlFor={`m-${item.value}`} className='cursor-pointer'>
                                                                    {item.label}
                                                                </FormLabel>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Transaction Reports Sub-Selection */}
                            {reportType === 'indi' && (
                                <div className='grid grid-cols-1 gap-4 rounded-lg border bg-muted/10 p-4'>
                                    <FormField
                                        control={form.control}
                                        name='regorname_map'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className='grid grid-cols-1 gap-4'>
                                                        {[
                                                            { value: 'routelocmap', label: 'Route Location Mapping' },
                                                            { value: 'vehicalroutemap', label: 'Vehicle Route Mapping' },
                                                            { value: 'vehicaldrivermap', label: 'Vehicle Driver Mapping' },
                                                            { value: 'vehicaldriversubstitute', label: 'Vehicle Driver Substitute Mapping' }
                                                        ].map((item) => (
                                                            <div key={item.value} className='flex items-center space-x-2'>
                                                                <RadioGroupItem value={item.value} id={`t-${item.value}`} />
                                                                <FormLabel htmlFor={`t-${item.value}`} className='cursor-pointer'>
                                                                    {item.label}
                                                                </FormLabel>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Buttons */}
                            <div className='flex justify-center gap-4 border-t pt-4'>
                                <Button type='submit' disabled={isGenerating} className='min-w-32'>
                                    {isGenerating ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    {isGenerating ? 'Generating...' : 'Report'}
                                </Button>

                                <Button type='button' variant='outline' onClick={handleCancel} className='min-w-32'>
                                    Cancel
                                </Button>

                                {reportData.length > 0 && (
                                    <>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handlePrint}
                                            className='w-32 border-primary text-primary hover:bg-primary/10'>
                                            <Printer className='mr-2 h-4 w-4' />
                                            Print
                                        </Button>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={handleExportExcel}
                                            className='w-40 border-green-600 text-green-600 hover:bg-green-50'>
                                            <FileSpreadsheet className='mr-2 h-4 w-4' />
                                            Export Excel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Results Grid - Dynamic based on selection */}
            {reportData.length > 0 && (
                <Card className='fade-in-50 slide-in-from-bottom-5 w-full animate-in shadow-lg'>
                    <CardHeader className='pb-2 text-center'>
                        <CardTitle className='font-semibold text-lg uppercase'>{reportTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='mb-4 rounded-md border bg-muted/20 p-2 font-medium text-sm'>Total Records: {reportData.length}</div>
                        <div className='max-h-[600px] overflow-auto rounded-md border' id='report-table-container'>
                            {/* Dynamic Table Rendering */}
                            <Table id='report-table'>
                                <TableHeader className='sticky top-0 bg-primary/10'>
                                    <TableRow>
                                        <TableHead className='w-[50px] text-center'>
                                            <Checkbox
                                                checked={reportData.length > 0 && selectedRows.length === reportData.length}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label='Select all'
                                            />
                                        </TableHead>
                                        <TableHead className='w-[60px] text-center font-bold'>SL.No.</TableHead>
                                        {/* Master Area */}
                                        {currentReportType === 'masterarea' && (
                                            <>
                                                <TableHead className='font-bold'>Area Name</TableHead>
                                                <TableHead className='font-bold'>Alias Name</TableHead>
                                            </>
                                        )}
                                        {/* Master Driver */}
                                        {currentReportType === 'masterdriver' && (
                                            <>
                                                <TableHead className='font-bold'>Driver Name</TableHead>
                                                <TableHead className='font-bold'>Driver Code</TableHead>
                                                <TableHead className='font-bold'>DL No</TableHead>
                                                <TableHead className='font-bold'>RTO Name</TableHead>
                                                <TableHead className='font-bold'>DL Expiry</TableHead>
                                            </>
                                        )}
                                        {/* Master Fuel */}
                                        {currentReportType === 'masterfueltype' && (
                                            <>
                                                <TableHead className='font-bold'>Fuel Type</TableHead>
                                            </>
                                        )}
                                        {/* Master Location */}
                                        {currentReportType === 'masterlocation' && (
                                            <>
                                                <TableHead className='font-bold'>Location Name</TableHead>
                                                <TableHead className='font-bold'>Alias</TableHead>
                                                <TableHead className='font-bold'>Longitude</TableHead>
                                                <TableHead className='font-bold'>Latitude</TableHead>
                                            </>
                                        )}
                                        {/* Master Route */}
                                        {currentReportType === 'masterroute' && (
                                            <>
                                                <TableHead className='font-bold'>Route Name</TableHead>
                                                <TableHead className='font-bold'>Route No</TableHead>
                                                <TableHead className='font-bold'>Description</TableHead>
                                            </>
                                        )}
                                        {/* Master Vehicle */}
                                        {currentReportType === 'mastervehical' && (
                                            <>
                                                <TableHead className='font-bold'>Vehicle Name</TableHead>
                                                <TableHead className='font-bold'>Vehicle No</TableHead>
                                                <TableHead className='font-bold'>Engine No</TableHead>
                                                <TableHead className='font-bold'>Chassis No</TableHead>
                                            </>
                                        )}
                                        {/* Master Vehicle Type */}
                                        {currentReportType === 'mastervehicaltype' && (
                                            <>
                                                <TableHead className='font-bold'>Vehicle Type</TableHead>
                                                <TableHead className='font-bold'>Description</TableHead>
                                            </>
                                        )}
                                        {/* Master Session */}
                                        {currentReportType === 'mastersession' && (
                                            <>
                                                <TableHead className='font-bold'>Session Name</TableHead>
                                                <TableHead className='font-bold'>Description</TableHead>
                                                <TableHead className='font-bold'>Flag</TableHead>
                                            </>
                                        )}
                                        {/* Master Schedule */}
                                        {currentReportType === 'masterrouteschedule' && (
                                            <>
                                                <TableHead className='font-bold'>Schedule Name</TableHead>
                                            </>
                                        )}

                                        {/* Mapping: Route Location */}
                                        {currentReportType === 'routelocmap' && (
                                            <>
                                                <TableHead className='font-bold'>Route Name</TableHead>
                                                <TableHead className='font-bold'>Location Name</TableHead>
                                            </>
                                        )}
                                        {/* Mapping: Vehicle Route */}
                                        {currentReportType === 'vehicalroutemap' && (
                                            <>
                                                <TableHead className='font-bold'>Vehicle Name</TableHead>
                                                <TableHead className='font-bold'>Route Name</TableHead>
                                                <TableHead className='font-bold'>Date</TableHead>
                                                <TableHead className='font-bold'>Session</TableHead>
                                            </>
                                        )}
                                        {/* Mapping: Vehicle Driver */}
                                        {currentReportType === 'vehicaldrivermap' && (
                                            <>
                                                <TableHead className='font-bold'>Vehicle Name</TableHead>
                                                <TableHead className='font-bold'>Driver Name</TableHead>
                                                <TableHead className='font-bold'>Date</TableHead>
                                                <TableHead className='font-bold'>Session</TableHead>
                                            </>
                                        )}
                                        {/* Mapping: Vehicle Driver Substitute */}
                                        {currentReportType === 'vehicaldriversubstitute' && (
                                            <>
                                                <TableHead className='font-bold'>Vehicle Name</TableHead>
                                                <TableHead className='font-bold'>Absent Driver</TableHead>
                                                <TableHead className='font-bold'>Substitute Driver</TableHead>
                                                <TableHead className='font-bold'>From Date</TableHead>
                                                <TableHead className='font-bold'>To Date</TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.map((item, index) => (
                                        <TableRow key={index} className='hover:bg-muted/50'>
                                            <TableCell className='text-center'>
                                                <Checkbox checked={selectedRows.includes(index)} onCheckedChange={() => toggleRow(index)} />
                                            </TableCell>
                                            <TableCell className='text-center'>{index + 1}</TableCell>

                                            {/* Master Area */}
                                            {currentReportType === 'masterarea' && (
                                                <>
                                                    <TableCell>{item.trmA_AreaName}</TableCell>
                                                    <TableCell>{item.trmA_AliasName}</TableCell>
                                                </>
                                            )}

                                            {/* Master Driver */}
                                            {currentReportType === 'masterdriver' && (
                                                <>
                                                    <TableCell>{item.trmD_DriverName}</TableCell>
                                                    <TableCell>{item.trmD_DriverCode}</TableCell>
                                                    <TableCell>{item.trmD_DLNo}</TableCell>
                                                    <TableCell>{item.trmD_RTOName}</TableCell>
                                                    <TableCell>
                                                        {item.trmD_DLExpiryDate
                                                            ? format(new Date(item.trmD_DLExpiryDate), 'dd/MM/yyyy')
                                                            : ''}
                                                    </TableCell>
                                                </>
                                            )}
                                            {/* Master Fuel */}
                                            {currentReportType === 'masterfueltype' && (
                                                <>
                                                    <TableCell>{item.trmfT_FuelType}</TableCell>
                                                </>
                                            )}
                                            {/* Master Location */}
                                            {currentReportType === 'masterlocation' && (
                                                <>
                                                    <TableCell>{item.trmL_LocationName}</TableCell>
                                                    <TableCell>{item.trmA_AreaName}</TableCell>
                                                    <TableCell>{item.trmL_Longitude}</TableCell>
                                                    <TableCell>{item.trmL_Latitude}</TableCell>
                                                </>
                                            )}
                                            {/* Master Route */}
                                            {currentReportType === 'masterroute' && (
                                                <>
                                                    <TableCell>{item.trmR_RouteName}</TableCell>
                                                    <TableCell>{item.trmR_RouteNo}</TableCell>
                                                    <TableCell>{item.trmR_RouteDesc}</TableCell>
                                                </>
                                            )}
                                            {/* Master Vehicle */}
                                            {currentReportType === 'mastervehical' && (
                                                <>
                                                    <TableCell>{item.trmV_VehicleName}</TableCell>
                                                    <TableCell>{item.trmV_VehicleNo}</TableCell>
                                                    <TableCell>{item.trmV_EngineNo}</TableCell>
                                                    <TableCell>{item.trmV_ChassisNo}</TableCell>
                                                </>
                                            )}
                                            {/* Master Vehicle Type */}
                                            {currentReportType === 'mastervehicaltype' && (
                                                <>
                                                    <TableCell>{item.trmvT_VehicleType}</TableCell>
                                                    <TableCell>{item.trmvT_VehicleDesc}</TableCell>
                                                </>
                                            )}
                                            {/* Master Session */}
                                            {currentReportType === 'mastersession' && (
                                                <>
                                                    <TableCell>{item.trmS_SessionName}</TableCell>
                                                    <TableCell>{item.trmS_SessionDesc}</TableCell>
                                                    <TableCell>{item.trmS_Flag}</TableCell>
                                                </>
                                            )}
                                            {/* Master Schedule */}
                                            {currentReportType === 'masterrouteschedule' && (
                                                <>
                                                    <TableCell>{item.trrsC_ScheduleName}</TableCell>
                                                </>
                                            )}

                                            {/* Mapping: Route Location */}
                                            {currentReportType === 'routelocmap' && (
                                                <>
                                                    <TableCell>{item.routename}</TableCell>
                                                    <TableCell>{item.locationname}</TableCell>
                                                </>
                                            )}

                                            {/* Mapping: Vehicle Route */}
                                            {currentReportType === 'vehicalroutemap' && (
                                                <>
                                                    <TableCell>{item.trmV_VehicleName}</TableCell>
                                                    <TableCell>{item.trmR_RouteName}</TableCell>
                                                    <TableCell>
                                                        {item.trvR_Date ? format(new Date(item.trvR_Date), 'dd/MM/yyyy') : ''}
                                                    </TableCell>
                                                    <TableCell>{item.trmS_SessionName}</TableCell>
                                                </>
                                            )}

                                            {/* Mapping: Vehicle Driver */}
                                            {currentReportType === 'vehicaldrivermap' && (
                                                <>
                                                    <TableCell>{item.trmV_VehicleName}</TableCell>
                                                    <TableCell>{item.trmD_DriverName}</TableCell>
                                                    <TableCell>
                                                        {item.trvD_Date ? format(new Date(item.trvD_Date), 'dd/MM/yyyy') : ''}
                                                    </TableCell>
                                                    <TableCell>{item.trmS_SessionName}</TableCell>
                                                </>
                                            )}

                                            {/* Mapping: Vehicle Driver Substitute */}
                                            {currentReportType === 'vehicaldriversubstitute' && (
                                                <>
                                                    <TableCell>{item.trmV_VehicleName}</TableCell>
                                                    <TableCell>{item.absent_Driver}</TableCell>
                                                    <TableCell>{item.substitute_Driver}</TableCell>
                                                    <TableCell>
                                                        {item.trvdS_FromDate ? format(new Date(item.trvdS_FromDate), 'dd/MM/yyyy') : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.trvdS_ToDate ? format(new Date(item.trvdS_ToDate), 'dd/MM/yyyy') : ''}
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
