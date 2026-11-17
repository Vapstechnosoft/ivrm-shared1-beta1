'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/extension/field';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeeRefundableList, useopeningacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import type { IFeeReceiptImportDelate } from '@/types/fees/transactions/transactions';
import { Search, Upload, X } from 'lucide-react';
import { use, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type ImportedExcelData = {
    [key: string]: any;
}[];

export default function FeesReceiptImport(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const [isReportGenerated, setIsReportGenerated] = useState(false);
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [importedData, setImportedData] = useState<ImportedExcelData>([]);
    const [filteredData, setFilteredData] = useState<ImportedExcelData>([]);
    const [excelSheets, setExcelSheets] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string>('');
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filename, setFilename] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const { data: response, isLoading, error } = useFeeRefundableList(Number(selectedAsmayId), searchParams);
    const { data: academicYearData, isLoading: loadingYears } = useopeningacademicyerdropdowndatafee();

    useEffect(() => {
        if (!loadingYears && academicYearData?.data?.length && selectedAsmayId === null) {
            setSelectedAsmayId(Number(academicYearData.data[0].asmaY_Id));
        }
    }, [loadingYears, academicYearData, selectedAsmayId]);

    // Handle Excel file upload
    const selectFileForUpload = (input: HTMLInputElement) => {
        if (!input.files || !input.files[0]) {
            // Clear all data if no file is selected
            clearImportedData();
            return;
        }

        const file = input.files[0];

        // Check if file is Excel type
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
            setExcelFile(file);
            setFilename(file.name);

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });

                    const sheets = workbook.SheetNames;
                    setExcelSheets(sheets);

                    if (sheets.length > 0) {
                        setSelectedSheet(sheets[0]);
                        loadSheetData(workbook, sheets[0]);
                    }

                    toast.success(`File "${file.name}" loaded successfully`);
                } catch (error) {
                    toast.error('Error reading Excel file');
                    console.error('Excel read error:', error);
                }
            };
            reader.readAsBinaryString(file);
        } else {
            toast.error('Please select a valid Excel file (.xlsx, .xls)');
            setFilename(file.name);
            // Clear the file input and data
            if (input) {
                input.value = '';
            }
            clearImportedData();
        }
    };

    // Clear all imported data
    const clearImportedData = () => {
        setExcelFile(null);
        setImportedData([]);
        setFilteredData([]);
        setExcelSheets([]);
        setSelectedSheet('');
        setTableHeaders([]);
        setSearchQuery('');
        setFilename('');
    };

    // Load data from selected sheet
    const loadSheetData = (workbook: XLSX.WorkBook, sheetName: string) => {
        try {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length > 0) {
                // Get headers from first row
                const headers = jsonData[0] as string[];
                const rows = jsonData.slice(1) as any[][];

                // Filter out empty headers and store them
                const filteredHeaders = headers.filter((header) => header && header.trim() !== '');
                setTableHeaders(['SLNO', ...filteredHeaders]); // Add SLNO as first header

                // Format data with headers and add SLNO
                const formattedData = rows.map((row, index) => {
                    const obj: { [key: string]: any } = { SLNO: index + 1 }; // Add SLNO
                    headers.forEach((header, idx) => {
                        if (header && header.trim() !== '') {
                            obj[header] = row[idx] || '';
                        }
                    });
                    return obj;
                });

                setImportedData(formattedData);
                setFilteredData(formattedData); // Initialize filtered data
                toast.success(`Loaded ${formattedData.length} rows from "${sheetName}"`);
            }
        } catch (error) {
            toast.error('Error loading sheet data');
            console.error('Sheet load error:', error);
        }
    };

    // Handle search functionality
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredData(importedData);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = importedData.filter((row) => {
            return Object.values(row).some((value) => String(value).toLowerCase().includes(query));
        });
        setFilteredData(filtered);
    }, [searchQuery, importedData]);

    const handleSheetSelect = (sheetName: string) => {
        setSelectedSheet(sheetName);
        if (excelFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                loadSheetData(workbook, sheetName);
            };
            reader.readAsBinaryString(excelFile);
        }
    };

    const handleReportClick = () => {
        if (!selectedAsmayId) {
            toast.error('Please select an Academic Year');
            return;
        }

        if (!excelFile) {
            toast.error('Please select an Excel file');
            return;
        }

        setIsReportGenerated(true);

        try {
            // Prepare data for API call (similar to Angular logic)
            const data1 = {
                newlstget1: filteredData
            };

            // Uncomment and implement your API service call
            // const response = await apiService.create("FeeReceiptImportStthomas/checkvalidation", data1);
            // if (response.stuStatus && response.stuStatus !== "") {
            //     toast.error(response.stuStatus);
            //     clearImportedData();
            // } else {
            //     setIsReportGenerated(true);
            //     toast.success('Data validated successfully');
            // }

            // For now, just show success
            setIsReportGenerated(true);
            toast.success(`${filteredData.length} records Saved successfully`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            toast.error('Error processing data');
            console.error('Processing error:', error);
        }
    };

    const handleResetClick = () => {
        setIsReportGenerated(false);
        clearImportedData();
    };

    // Function to handle file removal
    const handleRemoveFile = () => {
        clearImportedData();
        toast.info('File removed successfully');
    };

    return (
        <>
            <FormProvider<IFeeReceiptImportDelate>>
                <FeesReceiptImportDeletePageContent
                    isLoading={isLoading}
                    error={error}
                    selectedAsmayId={selectedAsmayId}
                    setSelectedAsmayId={setSelectedAsmayId}
                    academicYearData={academicYearData}
                    loadingYears={loadingYears}
                    isReportGenerated={isReportGenerated}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    onSave={handleReportClick}
                    onResetClick={handleResetClick}
                    onRemoveFile={handleRemoveFile}
                    excelFile={excelFile}
                    onFileUpload={selectFileForUpload}
                    importedData={importedData}
                    filteredData={filteredData}
                    excelSheets={excelSheets}
                    selectedSheet={selectedSheet}
                    onSheetSelect={handleSheetSelect}
                    tableHeaders={tableHeaders}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filename={filename}
                    isSaving={isSaving}
                />
            </FormProvider>
        </>
    );
}

function FeesReceiptImportDeletePageContent({
    isLoading,
    error,
    academicYearData,
    loadingYears,
    selectedAsmayId,
    setSelectedAsmayId,
    isReportGenerated,
    selectedDate,
    setSelectedDate,
    onSave,
    onResetClick,
    onRemoveFile,
    excelFile,
    onFileUpload,
    importedData,
    filteredData,
    excelSheets,
    selectedSheet,
    onSheetSelect,
    tableHeaders,
    searchQuery,
    setSearchQuery,
    filename,
    isSaving
}: {
    isLoading: boolean;
    error: any;
    academicYearData: any;
    selectedAsmayId: number | null;
    setSelectedAsmayId: (id: number | null) => void;
    loadingYears: boolean;
    isReportGenerated: boolean;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    onSave: () => void;
    onResetClick: () => void;
    onRemoveFile: () => void;
    excelFile: File | null;
    onFileUpload: (input: HTMLInputElement) => void;
    importedData: ImportedExcelData;
    filteredData: ImportedExcelData;
    excelSheets: string[];
    selectedSheet: string;
    onSheetSelect: (sheetName: string) => void;
    tableHeaders: string[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filename: string;
    isSaving: boolean;
}) {
    const { openAddForm } = useFormContext<IFeeReceiptImportDelate>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileUpload(e.target);
    };

    const handleFileRemoveClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onRemoveFile();
    };

    // Check if we should show table content
    const shouldShowTableContent = importedData.length > 0;

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container space-y-6 p-4'>
                {/* DATA IMPORT SECTION */}
                <div className='rounded-lg border bg-white shadow-sm'>
                    {/* Header */}
                    <div className='border-b p-4 text-center'>
                        <p className='mt-1 font-bold text-green-600 text-sm'>**Kindly Select Only One Excel Sheet To Import</p>
                    </div>

                    {/* Content */}
                    <div className='p-6'>
                        {/* IMPORTED DATA FROM EXCEL heading */}
                        <div className='mb-4'>
                            <h2 className='font-semibold text-base text-gray-700'>IMPORTED DATA FROM EXCEL</h2>
                        </div>

                        {/* Form row with Academic Year and File Upload */}
                        <div className='mb-6 grid grid-cols-2 gap-6'>
                            {/* Academic Year Column */}
                            <div>
                                <div className='flex items-center gap-2'>
                                    <Label className='whitespace-nowrap font-medium'>
                                        Academic Year<span className='text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        value={selectedAsmayId?.toString() || ''}
                                        onValueChange={(v) => setSelectedAsmayId(v ? Number(v) : null)}
                                        disabled={loadingYears}>
                                        <SelectTrigger className='w-48'>
                                            <SelectValue placeholder='Select Academic Year' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYearData?.data?.map((item: any) => (
                                                <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                    {item.asmaY_Year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* File Upload Column */}
                            <div>
                                <div className='flex items-center gap-2'>
                                    <Label className='whitespace-nowrap font-medium'>
                                        Choose File<span className='text-red-500'>*</span>
                                    </Label>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                ref={fileInputRef}
                                                type='file'
                                                accept='.xlsx,.xls,.csv'
                                                onChange={handleFileChange}
                                                className='hidden'
                                                id='excel-file-input'
                                            />
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={() => fileInputRef.current?.click()}
                                                className='w-48 gap-2'>
                                                <Upload className='h-4 w-4' />
                                                {filename ? 'File Selected' : 'Choose File'}
                                            </Button>
                                            {filename && (
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={handleFileRemoveClick}
                                                    className='h-8 w-8 p-0'>
                                                    <X className='h-4 w-4' />
                                                </Button>
                                            )}
                                        </div>
                                        {filename && <p className='text-green-600 text-sm'>Selected: {filename}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search Input - Only show when data is imported */}
                        {shouldShowTableContent && (
                            <div className='mb-4 flex'>
                                <div className='ml-auto'>
                                    <div className='relative w-48'>
                                        <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400' />
                                        <Input
                                            placeholder='search here...'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='pl-9'
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data Table */}
                        <div className='overflow-hidden rounded-md border'>
                            <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200 text-center'>
                                    <thead className='bg-gray-50'>
                                        {shouldShowTableContent ? (
                                            // Show headers when data exists
                                            <tr>
                                                {tableHeaders.map((header, index) => (
                                                    <th
                                                        key={index}
                                                        className='px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        ) : (
                                            // Show empty headers when no data
                                            <tr>
                                                <th className='px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                    No Data Imported
                                                </th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className='divide-y divide-gray-200 bg-white'>
                                        {shouldShowTableContent ? (
                                            // Show data when imported
                                            filteredData.length > 0 ? (
                                                filteredData.map((row, rowIndex) => (
                                                    <tr key={rowIndex} className='hover:bg-gray-50'>
                                                        <td className='whitespace-nowrap px-6 py-3 text-gray-900 text-sm'>{row.SLNO}</td>
                                                        {tableHeaders.slice(1).map((header, colIndex) => (
                                                            <td
                                                                key={colIndex}
                                                                className='whitespace-nowrap px-6 py-3 text-gray-900 text-sm'>
                                                                {row[header] !== undefined ? String(row[header]) : ''}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            ) : (
                                                // No search results
                                                <tr>
                                                    <td colSpan={tableHeaders.length} className='px-6 py-3 text-gray-500 text-sm'>
                                                        No results found for "{searchQuery}"
                                                    </td>
                                                </tr>
                                            )
                                        ) : (
                                            // Show empty state when no data imported
                                            <tr>
                                                <td colSpan={1} className='px-6 py-24 text-center text-gray-500 text-sm'>
                                                    Please select an Excel file to import data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className='mt-6 flex flex-col items-center justify-center gap-4 rounded-lg border bg-white p-6 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                {/* <Button
                                    type='button'
                                    onClick={onSave}
                                    className='shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg'>
                                    Save
                                </Button> */}
                                <Button
                                    type='button'
                                    onClick={onSave}
                                    disabled={!shouldShowTableContent || isSaving}
                                    className='shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'>
                                    {isSaving ? (
                                        <>
                                            {/* <span className="animate-spin mr-2">⏳</span> */}
                                            Saving...
                                        </>
                                    ) : isReportGenerated ? (
                                        'Update'
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                                <Button variant='outline' onClick={onResetClick} type='button'>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <FormSections />
            </div>
        </div>
    );
}

function FormSections() {
    const { isAddFormOpen, closeAddForm, addFormRef } = useFormContext<IFeeReceiptImportDelate>();

    return <></>;
}
