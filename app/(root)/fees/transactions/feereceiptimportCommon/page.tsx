'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/extension/field';
import { FormProvider } from '@/components/ui/form/form-provider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useopeningacademicyerdropdowndatafee } from '@/hooks/fees/useTrasactions';
import { savefeeReceiptimportCommon } from '@/server/fees/reports/feeReceiptimportCommon';
import type { IFeeReceiptImportDelate } from '@/types/fees/transactions/transactions';
import { Search, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

type ProcessedData = {
    FYP_Date: any;
    AMST_AdmNo: string;
    Student_Name: string;
    FYP_Tot_Amount: number;
    FYP_Bank_Or_Cash: string;
    FYP_TranscationId: string;
    Termname: string;
}[];

export default function feeReceiptimportCommon() {
    const [isReportGenerated, setIsReportGenerated] = useState(false);
    const [selectedAsmayId, setSelectedAsmayId] = useState<number | null>(null);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [processedData, setProcessedData] = useState<ProcessedData>([]);
    const [filteredData, setFilteredData] = useState<ProcessedData>([]);
    const [excelSheets, setExcelSheets] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string>('');
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filename, setFilename] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [parsingError, setParsingError] = useState<string>('');

    const [requiredColumnsMissing, setRequiredColumnsMissing] = useState<string[]>([]);

    const { data: academicYearData, isLoading: loadingYears } = useopeningacademicyerdropdowndatafee();

    useEffect(() => {
        if (!loadingYears && academicYearData?.data?.length && selectedAsmayId === null) {
            setSelectedAsmayId(Number(academicYearData.data[0].asmaY_Id));
        }
    }, [loadingYears, academicYearData, selectedAsmayId]);

    // Check if required columns are present
    const checkRequiredColumns = (headers: string[]): string[] => {
        const requiredColumns = ['FYP_Date', 'AMST_AdmNo', 'Student_Name', 'FYP_Tot_Amount'];
        const missingColumns: string[] = [];

        for (const requiredCol of requiredColumns) {
            const exactMatch = headers.some((h) => h && typeof h === 'string' && h.trim() === requiredCol);

            const closeMatch = headers.some(
                (h) =>
                    h && typeof h === 'string' && h.toLowerCase().replace(/[_\s]/g, '') === requiredCol.toLowerCase().replace(/[_\s]/g, '')
            );

            if (!exactMatch && !closeMatch) {
                missingColumns.push(requiredCol);
            }
        }

        return missingColumns;
    };

    // Process Excel data based on file format
    const processExcelData = (data: any[], headers: string[]): ProcessedData => {
        const processedRows: ProcessedData = [];
        setParsingError('');
        setRequiredColumnsMissing([]);

        if (!data || data.length === 0) {
            setParsingError('No data found in Excel sheet');
            return processedRows;
        }

        const missingColumns = checkRequiredColumns(headers);
        if (missingColumns.length > 0) {
            setRequiredColumnsMissing(missingColumns);
            setParsingError(`Missing required columns: ${missingColumns.join(', ')}`);
            toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
            return processedRows;
        }

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
                let admissionNumber = '';
                let studentName = '';
                let depositAmount = 0;
                let dateValue = '';
                let transactionId = '';
                let termName = '';
                let bankOrCash = 'C'; // Default to 'C'

                const admKey = headers.find(
                    (h) =>
                        h &&
                        typeof h === 'string' &&
                        (h === 'AMST_AdmNo' ||
                            h === 'Admission No' ||
                            h.toLowerCase().includes('admno') ||
                            h.toLowerCase().includes('admission'))
                );

                if (admKey && row[admKey] !== undefined && row[admKey] !== null && row[admKey] !== '') {
                    admissionNumber = String(row[admKey]).trim();
                }

                // Find student name
                const nameKey = headers.find(
                    (h) =>
                        h && typeof h === 'string' && (h === 'Student_Name' || h === 'Student Name' || h.toLowerCase().includes('student'))
                );

                if (nameKey && row[nameKey] !== undefined && row[nameKey] !== null && row[nameKey] !== '') {
                    studentName = String(row[nameKey]).trim();
                }

                // Find amount
                const amountKey = headers.find(
                    (h) => h && typeof h === 'string' && (h === 'FYP_Tot_Amount' || h === 'Amount' || h.toLowerCase().includes('amount'))
                );

                if (amountKey && row[amountKey] !== undefined && row[amountKey] !== null && row[amountKey] !== '') {
                    const amountStr = String(row[amountKey]).replace(/,/g, '');
                    const parsedAmount = Number.parseFloat(amountStr);
                    if (!Number.isNaN(parsedAmount) && parsedAmount > 0) {
                        depositAmount = parsedAmount;
                    }
                }

                // Find date
                const dateKey = headers.find(
                    (h) => h && typeof h === 'string' && (h === 'FYP_Date' || h === 'Date' || h.toLowerCase().includes('date'))
                );

                if (dateKey && row[dateKey] !== undefined && row[dateKey] !== null && row[dateKey] !== '') {
                    dateValue = String(row[dateKey]);
                }

                // Find transaction ID
                const transKey = headers.find(
                    (h) =>
                        h &&
                        typeof h === 'string' &&
                        (h === 'FYP_TranscationId' || h === 'Transaction ID' || h.toLowerCase().includes('transaction'))
                );

                if (transKey && row[transKey] !== undefined && row[transKey] !== null && row[transKey] !== '') {
                    transactionId = String(row[transKey]).trim();
                }

                const termKey = headers.find(
                    (h) =>
                        h &&
                        typeof h === 'string' &&
                        (h === 'Termname' || h === 'Term Name' || h.toLowerCase().includes('term') || h === 'TERMNAME')
                );

                if (termKey && row[termKey] !== undefined && row[termKey] !== null && row[termKey] !== '') {
                    termName = String(row[termKey]).trim();
                }

                // Find bank/cash mode
                const modeKey = headers.find(
                    (h) =>
                        h &&
                        typeof h === 'string' &&
                        (h === 'FYP_Bank_Or_Cash' || h === 'Mode' || h.toLowerCase().includes('bank') || h.toLowerCase().includes('cash'))
                );

                if (modeKey && row[modeKey] !== undefined && row[modeKey] !== null && row[modeKey] !== '') {
                    const mode = String(row[modeKey]).toUpperCase();
                    bankOrCash = mode;
                }

                // Validate that we have the minimum required data
                if (admissionNumber && studentName && depositAmount > 0) {
                    processedRows.push({
                        FYP_Date: dateValue || new Date().toLocaleDateString(),
                        AMST_AdmNo: admissionNumber,
                        Student_Name: studentName,
                        FYP_Tot_Amount: depositAmount,
                        FYP_Bank_Or_Cash: bankOrCash || 'C',
                        FYP_TranscationId: transactionId || '',
                        Termname: termName || ''
                    });
                }
            } catch (error) {
                console.error(`Error processing row ${i + 1}:`, error, row);
            }
        }

        // Sort by amount in descending order
        //processedRows.sort((a, b) => b.FYP_Tot_Amount - a.FYP_Tot_Amount);

        if (processedRows.length === 0) {
            setParsingError('No valid data found. Please check your Excel file format.');
        }

        return processedRows;
    };

    const selectFileForUpload = async (input: HTMLInputElement) => {
        setParsingError('');
        setRequiredColumnsMissing([]);

        if (!input.files || !input.files[0]) {
            clearImportedData();
            toast.error('No file selected');
            return;
        }

        const file = input.files[0];
        const validExtensions = ['.xlsx', '.xls', '.csv', '.xlsm'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            toast.error(`Please select a valid Excel file (${validExtensions.join(', ')})`);
            input.value = '';
            clearImportedData();
            return;
        }

        setExcelFile(file);
        setFilename(file.name);

        try {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const data = e.target?.result;
                    if (!data) {
                        throw new Error('Failed to read file');
                    }

                    const arrayBuffer =
                        data instanceof ArrayBuffer
                            ? data
                            : typeof data === 'string'
                              ? new TextEncoder().encode(data).buffer
                              : new Uint8Array(data as ArrayBuffer).buffer;

                    const workbook = XLSX.read(arrayBuffer, {
                        type: 'array',
                        cellDates: true,
                        cellNF: false,
                        cellText: false
                    });

                    const sheets = workbook.SheetNames;
                    setExcelSheets(sheets);

                    if (sheets.length === 0) {
                        throw new Error('No sheets found in Excel file');
                    }

                    setSelectedSheet(sheets[0]);
                    loadSheetData(workbook, sheets[0]);

                    toast.success(`"${file.name}" loaded successfully`);
                } catch (error) {
                    console.error('Error reading Excel file:', error);
                    toast.error(`Error reading Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    clearImportedData();
                }
            };

            reader.onerror = () => {
                toast.error('Error reading file');
                clearImportedData();
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('File processing error:', error);
            toast.error('Error processing file');
            clearImportedData();
        }
    };

    const loadSheetData = (workbook: XLSX.WorkBook, sheetName: string) => {
        try {
            const worksheet = workbook.Sheets[sheetName];

            if (!worksheet) {
                throw new Error(`Sheet "${sheetName}" not found`);
            }

            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const headerRow: any[] = [];
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
                const cell = worksheet[cellAddress];
                headerRow.push(cell ? String(cell.v).trim() : `Column${col + 1}`);
            }

            // Convert sheet to JSON
            const rawData = XLSX.utils.sheet_to_json(worksheet, {
                header: headerRow,
                defval: '',
                raw: false,
                dateNF: 'yyyy-mm-dd'
            });

            if (rawData.length === 0) {
                toast.error('Excel Sheet is Empty');
                setProcessedData([]);
                setFilteredData([]);
                setTableHeaders([]);
                setParsingError('Sheet is empty');
                return;
            }

            // Process the data
            const processed = processExcelData(rawData, headerRow);
            setProcessedData(processed);
            setFilteredData(processed);

            const processedHeaders = [
                'SLNO',
                'FYP_Date',
                'AMST_AdmNo',
                'Student_Name',
                'FYP_Tot_Amount',
                'FYP_Bank_Or_Cash',
                'FYP_TranscationId',
                'Termname'
            ];
            setTableHeaders(processedHeaders);

            if (processed.length > 0) {
                toast.success(`Processed ${processed.length} valid records from "${sheetName}"`);
            } else if (parsingError) {
                toast.error(parsingError);
            }
        } catch (error) {
            console.error('Error loading sheet data:', error);
            toast.error(`Error loading sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setProcessedData([]);
            setFilteredData([]);
            setTableHeaders([]);
            setParsingError(`Failed to load sheet: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Clear all imported data
    const clearImportedData = () => {
        setExcelFile(null);
        setProcessedData([]);
        setFilteredData([]);
        setExcelSheets([]);
        setSelectedSheet('');
        setTableHeaders([]);
        setSearchQuery('');
        setFilename('');
        setParsingError('');
        setIsReportGenerated(false);
        setRequiredColumnsMissing([]);
    };

    // Handle search functionality on processed data
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredData(processedData);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = processedData.filter((row) => {
            return Object.values(row).some((value) => String(value).toLowerCase().includes(query));
        });
        setFilteredData(filtered);
    }, [searchQuery, processedData]);

    const handleSheetSelect = (sheetName: string) => {
        setSelectedSheet(sheetName);
        if (excelFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    if (data) {
                        const arrayBuffer = data instanceof ArrayBuffer ? data : new Uint8Array(data as unknown as ArrayBuffer).buffer;
                        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                        loadSheetData(workbook, sheetName);
                    }
                } catch (error) {
                    console.error('Error switching sheets:', error);
                    toast.error('Error loading sheet');
                }
            };
            reader.readAsArrayBuffer(excelFile);
        }
    };

    const handleReportClick = async () => {
        setIsSaving(true);

        if (!selectedAsmayId) {
            toast.error('Please select an Academic Year');
            setIsSaving(false);
            return;
        }

        if (!excelFile) {
            toast.error('Please select an Excel file');
            setIsSaving(false);
            return;
        }

        if (processedData.length === 0) {
            toast.error('No valid data found to save');
            setIsSaving(false);
            return;
        }

        if (requiredColumnsMissing.length > 0) {
            toast.error(`Missing required columns: ${requiredColumnsMissing.join(', ')}`);
            setIsSaving(false);
            return;
        }

        // const formatDateForAPI = (dateString: string) => {
        //     if (!dateString) return '';

        //     try {
        //         let date: Date;
        //         if (dateString.includes('T') && dateString.includes('Z')) {
        //             date = new Date(dateString);
        //         } else if (dateString.match(/^\d{1,2}[\/\.]\d{1,2}[\/\.]\d{4}/)) {
        //             const separator = dateString.includes('/') ? '/' : '.';
        //             const parts = dateString.split(separator);
        //             date = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T00:00:00.000Z`);
        //         } else if (dateString.match(/^\d{4}\/\d{1,2}\/\d{1,2}/)) {
        //             const parts = dateString.split('/');
        //             date = new Date(`${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}T00:00:00.000Z`);
        //         } else if (dateString.match(/^\d{4}-\d{1,2}-\d{1,2}/)) {
        //             date = new Date(`${dateString}T00:00:00.000Z`);
        //         } else if (!Number.isNaN(Number(dateString)) && Number(dateString) > 25569) {
        //             const excelDate = Number(dateString);
        //             const dateObj = new Date((excelDate - 25569) * 86400 * 1000);
        //             if (!Number.isNaN(dateObj.getTime())) {
        //                 date = dateObj;
        //             } else {
        //                 date = new Date(dateString);
        //             }
        //         } else {
        //             date = new Date(dateString);
        //         }

        //         if (Number.isNaN(date.getTime())) {
        //             console.warn(`Invalid date format: ${dateString}, using current date`);
        //             return new Date().toISOString();
        //         }

        //         return date.toISOString();
        //     } catch (error) {
        //         console.error('Error formatting date:', error, dateString);
        //         return new Date().toISOString();
        //     }
        // };
        const formatDateForAPI = (dateString: string): string => {
            if (!dateString) return '';

            try {
                // If date is already in YYYY-MM-DD format, return as is
                if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return dateString;
                }

                // If date is in DD/MM/YYYY format, convert to YYYY-MM-DD
                if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
                    const parts = dateString.split('/');
                    if (parts.length === 3) {
                        const day = parts[0].padStart(2, '0');
                        const month = parts[1].padStart(2, '0');
                        const year = parts[2];
                        return `${year}-${month}-${day}`;
                    }
                }

                // If date is in YYYY/MM/DD format, convert to YYYY-MM-DD
                if (dateString.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
                    const parts = dateString.split('/');
                    if (parts.length === 3) {
                        const year = parts[0];
                        const month = parts[1];
                        const day = parts[2];
                        return `${year}-${month}-${day}`;
                    }
                }

                // Try to parse as Date object for any other format
                const date = new Date(dateString);
                if (!Number.isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }

                // If all else fails, try to create a date from the string with time component
                const dateWithTime = new Date(dateString + 'T00:00:00');
                if (!Number.isNaN(dateWithTime.getTime())) {
                    const year = dateWithTime.getFullYear();
                    const month = String(dateWithTime.getMonth() + 1).padStart(2, '0');
                    const day = String(dateWithTime.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }

                return ''; // Return empty string if we can't parse it
            } catch (error) {
                console.error('Error formatting date:', error);
                return '';
            }
        };
        try {
            const feeReceiptimport = processedData.map((item) => ({
                amsT_AdmNo: item.AMST_AdmNo,
                fyP_Date: formatDateForAPI(item.FYP_Date),
                fyP_Tot_Amount: item.FYP_Tot_Amount,
                fyP_Bank_Or_Cash: item.FYP_Bank_Or_Cash,
                fyP_TransactionId: item.FYP_TranscationId,
                termname: item.Termname
            }));

            const payload = {
                asmaY_Id: selectedAsmayId,
                feeReceiptimportCommon: feeReceiptimport
            };

            console.log('payload', JSON.stringify(payload));

            const response = await savefeeReceiptimportCommon(payload);

            if (response) {
                if (response.returnval === true) {
                    const successMessage = `Data saved successfully! 
                    Saved: ${response.suscnt || 0}, 
                    Duplicates: ${response.dupcnt || 0}, 
                    Failed: ${response.failcnt || 0}`;
                    toast.success(successMessage);
                    setTimeout(() => {
                        clearImportedData();
                        window.location.reload();
                    }, 2000);
                } else {
                    toast.error('Failed to save data. Please try again.');
                }
            } else {
                toast.error('No response received from server');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error(`Error saving data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetClick = () => {
        clearImportedData();
        toast.info('Form reset successfully');
    };

    const handleRemoveFile = () => {
        clearImportedData();
        toast.info('File removed successfully');
    };

    return (
        <>
            <FormProvider<IFeeReceiptImportDelate>>
                <FeesReceiptImportBankCopyPageContent
                    selectedAsmayId={selectedAsmayId}
                    setSelectedAsmayId={setSelectedAsmayId}
                    academicYearData={academicYearData}
                    loadingYears={loadingYears}
                    isReportGenerated={isReportGenerated}
                    onSave={handleReportClick}
                    onResetClick={handleResetClick}
                    onRemoveFile={handleRemoveFile}
                    excelFile={excelFile}
                    onFileUpload={selectFileForUpload}
                    processedData={processedData}
                    filteredData={filteredData}
                    excelSheets={excelSheets}
                    selectedSheet={selectedSheet}
                    onSheetSelect={handleSheetSelect}
                    tableHeaders={tableHeaders}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filename={filename}
                    isSaving={isSaving}
                    parsingError={parsingError}
                    requiredColumnsMissing={requiredColumnsMissing}
                    isLoading={false}
                    error={undefined}
                />
            </FormProvider>
        </>
    );
}

function FeesReceiptImportBankCopyPageContent({
    academicYearData,
    loadingYears,
    selectedAsmayId,
    setSelectedAsmayId,
    isReportGenerated,
    onSave,
    onResetClick,
    onRemoveFile,
    excelFile,
    onFileUpload,
    processedData,
    filteredData,
    excelSheets,
    selectedSheet,
    onSheetSelect,
    tableHeaders,
    searchQuery,
    setSearchQuery,
    filename,
    isSaving,
    parsingError,
    requiredColumnsMissing
}: {
    isLoading: boolean;
    error: any;
    academicYearData: any;
    selectedAsmayId: number | null;
    setSelectedAsmayId: (id: number | null) => void;
    loadingYears: boolean;
    isReportGenerated: boolean;
    onSave: () => void;
    onResetClick: () => void;
    onRemoveFile: () => void;
    excelFile: File | null;
    onFileUpload: (input: HTMLInputElement) => void;
    processedData: ProcessedData;
    filteredData: ProcessedData;
    excelSheets: string[];
    selectedSheet: string;
    onSheetSelect: (sheetName: string) => void;
    tableHeaders: string[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filename: string;
    isSaving: boolean;
    parsingError: string;
    requiredColumnsMissing: string[];
}) {
    //   const { openAddForm } = useFormContext<IFeeReceiptImportDelate>();
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

    const shouldShowTableContent = processedData.length > 0;

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container space-y-6 p-4'>
                <div className='rounded-lg border bg-white shadow-sm'>
                    <div className='border-b p-4 text-center'>
                        <p className='mt-1 font-bold text-green-600 text-sm'>**Kindly Select Only One Excel Sheet To Import</p>
                    </div>

                    <div className='p-6'>
                        <div className='mb-4'>
                            <h2 className='font-semibold text-base text-gray-700'>IMPORTED DATA FROM EXCEL</h2>
                            {requiredColumnsMissing.length > 0 && (
                                <div className='mt-2 rounded-md bg-red-50 p-3'>
                                    <p className='font-medium text-red-700 text-sm'>Missing Required Columns:</p>
                                    <ul className='mt-1 list-disc pl-4 text-red-600 text-sm'>
                                        {requiredColumnsMissing.map((col, index) => (
                                            <li key={index}>{col}</li>
                                        ))}
                                    </ul>
                                    <p className='mt-1 text-red-600 text-sm'>
                                        Required columns: FYP_Date, AMST_AdmNo, Student_Name, FYP_Tot_Amount
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className='mb-6 grid grid-cols-2 gap-6'>
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
                                        Choose Excel File<span className='text-red-500'>*</span>
                                    </Label>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                ref={fileInputRef}
                                                type='file'
                                                accept='.xlsx,.xls,.csv,.xlsm'
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
                                        {filename && (
                                            <div className='text-sm'>
                                                <p className='text-green-600'>Selected: {filename}</p>
                                                {excelSheets.length > 0 && (
                                                    <p className='text-blue-600'>{excelSheets.length} sheet(s) available</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sheet selector if multiple sheets exist */}
                        {excelSheets.length > 1 && (
                            <div className='mb-4'>
                                <Label className='mb-2 block font-medium'>Select Sheet:</Label>
                                <div className='flex flex-wrap gap-2'>
                                    {excelSheets.map((sheet) => (
                                        <Button
                                            key={sheet}
                                            type='button'
                                            variant={selectedSheet === sheet ? 'default' : 'outline'}
                                            onClick={() => onSheetSelect(sheet)}
                                            size='sm'>
                                            {sheet}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Input - Only show when data is imported */}
                        {shouldShowTableContent && (
                            <div className='mb-4 flex'>
                                <div className='ml-auto'>
                                    <div className='relative w-48'>
                                        <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400' />
                                        <Input
                                            placeholder='Search Here...'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='pl-9'
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data Table for Processed Data */}
                        <div className='mb-6 overflow-hidden rounded-md border'>
                            <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200 text-center'>
                                    <thead className='bg-gray-50'>
                                        {shouldShowTableContent ? (
                                            <tr>
                                                {tableHeaders.map((header, index) => (
                                                    <th
                                                        key={index}
                                                        className='px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th
                                                    colSpan={8}
                                                    className='px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider'>
                                                    No Data Processed
                                                </th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className='divide-y divide-gray-200 bg-white'>
                                        {shouldShowTableContent ? (
                                            filteredData.length > 0 ? (
                                                filteredData.map((row, rowIndex) => (
                                                    <tr key={rowIndex} className='hover:bg-gray-50'>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {rowIndex + 1}
                                                        </td>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {row.FYP_Date || '-'}
                                                        </td>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {row.AMST_AdmNo || '-'}
                                                        </td>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {row.Student_Name || '-'}
                                                        </td>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {row.FYP_Tot_Amount.toLocaleString('en-IN', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}
                                                        </td>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {row.FYP_Bank_Or_Cash || 'C'}
                                                        </td>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {row.FYP_TranscationId || '-'}
                                                        </td>
                                                        <td className='whitespace-nowrap px-4 py-3 text-gray-900 text-sm'>
                                                            {row.Termname || '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={tableHeaders.length} className='px-6 py-3 text-gray-500 text-sm'>
                                                        No results found for "{searchQuery}"
                                                    </td>
                                                </tr>
                                            )
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className='px-6 py-24 text-center text-gray-500 text-sm'>
                                                    {excelFile
                                                        ? parsingError
                                                            ? parsingError
                                                            : 'Processing Excel file...'
                                                        : 'Please select an Excel file (.xlsx, .xls, .csv) to import'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='mt-6 flex flex-col items-center justify-center gap-4 rounded-lg border bg-white p-6 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                <Button
                                    type='button'
                                    onClick={onSave}
                                    disabled={!shouldShowTableContent || isSaving}
                                    className='shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'>
                                    {isSaving ? (
                                        <>
                                            <span className='mr-2'>⏳</span>
                                            Saving...
                                        </>
                                    ) : isReportGenerated ? (
                                        'Update'
                                    ) : (
                                        'Save Data'
                                    )}
                                </Button>
                                <Button variant='outline' onClick={onResetClick} type='button' disabled={isSaving}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
