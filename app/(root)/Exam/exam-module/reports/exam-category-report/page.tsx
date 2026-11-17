'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMasterCategoryDropdownList } from '@/hooks/exam/exammodule/usemasters';
import { useAcademicYearDropdown } from '@/hooks/fees/useMasters';
import { type ExamCategoryReportFormValues, examCategoryReportSchema } from '@/schemas/exam/exam-module/reports';
import { getReportData } from '@/server/exam/exam-module/reports/exam-category-report';
import { getMasterInstitution } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import type { IMasterInstitution, Institution } from '@/types/exam/exam-module/report';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveAs } from 'file-saver';
import { Check, FileSpreadsheet, Loader2, Printer, Search, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export default function ExamCategoryReportPage() {
    // Grid flags and data
    const [gridFlag, setGridFlag] = useState(false);
    const [finalDetailsList, setFinalDetailsList] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState('');

    const [reportHeader, setReportHeader] = useState('');
    const [institution, setInstitution] = useState<IMasterInstitution | Institution | null>(null);
    const { data: academicYear, isLoading: academicYearLoading, error: academicYearError } = useAcademicYearDropdown();
    const { data: masterCategory, isLoading: masterCategoryLoading, error: masterCategoryError } = useMasterCategoryDropdownList();
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridFlag && printRef.current) {
            printRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [gridFlag]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await getMasterInstitution();
                if (res?.success) {
                    setInstitution(res.data);
                }
            } catch (error) {
                console.error('Error fetching institution:', error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!academicYearLoading && academicYear?.data && academicYear.data.length === 0) {
            toast.info('No Academic Years found');
        }
    }, [academicYear, academicYearLoading]);

    useEffect(() => {
        if (!masterCategoryLoading && masterCategory?.data && masterCategory.data.length === 0) {
            toast.info('No Categories found');
        }
    }, [masterCategory, masterCategoryLoading]);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ExamCategoryReportFormValues>({
        resolver: zodResolver(examCategoryReportSchema),
        defaultValues: {
            type: '1',
            asmaY_Id: '',
            emcA_Id: ''
        }
    });

    const typeValue = watch('type');
    const selectedYearId = watch('asmaY_Id');
    const selectedCategoryId = watch('emcA_Id');

    // Handle Type Change logic
    useEffect(() => {
        setGridFlag(false);
        setFinalDetailsList([]);
        if (typeValue === '1') {
            setValue('emcA_Id', '');
        }
    }, [typeValue, setValue]);

    // Handle Dropdown Change logic
    useEffect(() => {
        setGridFlag(false);
    }, [selectedYearId, selectedCategoryId]);

    const onSubmit = async (data: ExamCategoryReportFormValues) => {
        try {
            console.log('Exam Category Report payload:', {
                type: data.type,
                asmaY_Id: data.asmaY_Id,
                emcA_Id: data.type === '1' ? undefined : data.emcA_Id
            });
            setGridFlag(false);

            const response_ = await getReportData({
                type: data.type,
                asmaY_Id: data.asmaY_Id,
                emcA_Id: data.type === '1' ? undefined : data.emcA_Id
            });

            const records = Array.isArray(response_.data) ? response_.data : [];

            if (records.length === 0) {
                toast.info('No data found for the selected criteria');
                return;
            }

            // -----------------------------
            // 1. Get unique Categories
            // -----------------------------
            const categoriesMap = new Map<number, any>();

            records.forEach((item: any) => {
                if (!categoriesMap.has(item.emcA_Id)) {
                    categoriesMap.set(item.emcA_Id, {
                        emcA_Id: item.emcA_Id,
                        emcA_CategoryName: item.emcA_CategoryName,
                        cat_grp_list: []
                    });
                }
            });

            // -----------------------------
            // 2. Build Groups under Category
            // -----------------------------
            categoriesMap.forEach((category) => {
                const groupsMap = new Map<number, any>();

                records
                    .filter((r: any) => r.emcA_Id === category.emcA_Id)
                    .forEach((r: any) => {
                        if (!groupsMap.has(r.emG_Id)) {
                            groupsMap.set(r.emG_Id, {
                                emG_Id: r.emG_Id,
                                emG_GroupName: r.emG_GroupName,
                                grp_subjs: []
                            });
                        }

                        groupsMap.get(r.emG_Id).grp_subjs.push({
                            ismS_Id: r.ismS_Id,
                            ismS_SubjectName: r.ismS_SubjectName,
                            ismS_OrderFlag: r.ismS_OrderFlag
                        });
                    });

                // Optional: sort subjects by order flag
                groupsMap.forEach((grp) => {
                    grp.grp_subjs.sort((a: any, b: any) => a.ismS_OrderFlag - b.ismS_OrderFlag);
                    category.cat_grp_list.push(grp);
                });
            });

            const finalDetailsList = Array.from(categoriesMap.values());

            setFinalDetailsList(finalDetailsList);
            setGridFlag(true);

            // -----------------------------
            // 3. Report Header
            // -----------------------------
            const yearName =
                (Array.isArray(academicYear?.data) &&
                    academicYear?.data.find((y: any) => String(y.asmaY_Id) === data.asmaY_Id)?.asmaY_Year) ||
                '';

            let header = `Academic Year: ${yearName}`;

            if (data.type === '2') {
                const catName =
                    (Array.isArray(masterCategory?.data) &&
                        masterCategory?.data.find((c: any) => String(c.emcA_Id) === data.emcA_Id)?.emcA_CategoryName) ||
                    '';
                header += ` | Category: ${catName}`;
            }

            setReportHeader(header);
        } catch (error) {
            console.error('Error fetching report', error);
            toast.error('Failed to generate report');
            setGridFlag(false);
        }
    };

    const handleCancel = () => {
        reset({
            type: '1',
            asmaY_Id: '',
            emcA_Id: ''
        });
        setGridFlag(false);
        setFinalDetailsList([]);
    };

    const handlePrint = () => {
        const tableContent = document.getElementById('reportTable');
        const printHeader = `
            <div class="header-container">
                <div class="logo-container" style="position: static; display: flex; justify-content: center;">
                    <img src="${institution?.mI_Logo || '/assets/tunbridge_logo.png'}" alt="${institution?.mI_Name || 'Logo'}" class="logo" style="margin: 0 auto;">
                </div>
            </div>
            <div class="report-title">Exam Category Group Wise Subject Wise Report</div>
            <div class="sub-title">${reportHeader}</div>
        `;

        if (tableContent) {
            const popupWindow = window.open('', '_blank', 'width=1000,height=1000');
            if (popupWindow) {
                popupWindow.document.open();
                popupWindow.document.write(`
                    <html>
                        <head>
                            <title>Exam Category Report</title>
                            <style>
                                body { font-family: 'Times New Roman', serif; padding: 20px; }
                                .header-container { display: flex; align-items: center; justify-content: center; margin-bottom: 10px; border-bottom: 2px solid #ccc; padding-bottom: 15px; position: relative; }
                                .logo-container { position: absolute; left: 0; top: 0; }
                                .logo { height: 100px; width: auto; }
                                .school-details { text-align: center; width: 100%; }
                                .school-name { font-size: 32px; font-weight: bold; color: #2e57a0; margin: 0; text-transform: capitalize; font-family: sans-serif;}
                                .address, .email { margin: 5px 0; font-size: 14px; }
                                .report-title { text-align: center; font-weight: bold; font-size: 16px; margin-top: 10px; text-decoration: underline; }
                                .sub-title { text-align: center; font-weight: bold; font-size: 14px; margin: 5px 0 20px 0; }
                                
                                table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
                                th { border: 1px solid black; padding: 8px; text-align: center; font-weight: bold; background-color: #f2f2f2; }
                                td { border: 1px solid black; padding: 8px; vertical-align: top; }
                                .text-center { text-align: center; }
                                .font-medium { font-weight: 500; }
                            </style>
                        </head>
                        <body onload="window.print(); window.close();">
                            ${printHeader}
                            ${tableContent.outerHTML}
                            <div style="margin-top: 20px; font-size: 10px;">Date: ${new Date().toLocaleDateString('en-GB')} UserName: ${'Administrator'}</div>
                        </body>
                    </html>
                `);
                popupWindow.document.close();
            }
        }
    };

    const handleExcel = () => {
        const table = document.getElementById('reportTable');
        if (table) {
            const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            saveAs(blob, 'Exam_Category_Report.xlsx');
        }
    };

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <Card className='w-full shadow-md'>
                <CardHeader className='border-b bg-primary/5'>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='font-bold text-primary text-xl'>Exam Category Report</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className='pt-6'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='mb-6 flex justify-center'>
                            <div className='rounded-lg bg-muted/50 p-4'>
                                <Controller
                                    name='type'
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                if (value === '1')
                                                    // update this field
                                                    setValue('emcA_Id', ''); // reset other field to default
                                            }}
                                            defaultValue={field.value}
                                            value={field.value}
                                            className='flex space-x-6'>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='1' id='r1' />
                                                <Label htmlFor='r1' className='cursor-pointer font-medium'>
                                                    All
                                                </Label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <RadioGroupItem value='2' id='r2' />
                                                <Label htmlFor='r2' className='cursor-pointer font-medium'>
                                                    Individual
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label htmlFor='asmaY_Id'>
                                    Academic Year <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='asmaY_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={academicYearLoading ? 'Loading Academic Year...' : 'Select Academic Year'}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {academicYearLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Academic Years are loading...
                                                    </SelectItem>
                                                ) : academicYearError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Academic Year
                                                    </SelectItem>
                                                ) : academicYear?.data?.length === 0 ? (
                                                    <SelectItem value='none' disabled>
                                                        No Academic Years found
                                                    </SelectItem>
                                                ) : (
                                                    academicYear?.data?.map((item) => (
                                                        <SelectItem key={item.asmaY_Id} value={item.asmaY_Id.toString()}>
                                                            {item.asmaY_Year}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.asmaY_Id && <p className='text-destructive text-sm'>{errors.asmaY_Id.message}</p>}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='emcA_Id'>
                                    Category <span className='text-destructive'>*</span>
                                </Label>
                                <Controller
                                    name='emcA_Id'
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={typeValue === '1'}>
                                            <SelectTrigger className={errors.emcA_Id ? 'border-destructive' : ''}>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {masterCategoryLoading ? (
                                                    <SelectItem value='loading' disabled>
                                                        Categories are loading...
                                                    </SelectItem>
                                                ) : masterCategoryError ? (
                                                    <SelectItem value='error' disabled>
                                                        Error loading Master Categories
                                                    </SelectItem>
                                                ) : masterCategory?.data?.length === 0 ? (
                                                    <SelectItem value='none' disabled>
                                                        No Categories found
                                                    </SelectItem>
                                                ) : (
                                                    masterCategory?.data?.map((item) => (
                                                        <SelectItem key={item.emcA_Id} value={item.emcA_Id.toString()}>
                                                            {item.emcA_CategoryName}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.emcA_Id && <p className='text-destructive text-sm'>{errors.emcA_Id.message}</p>}
                            </div>
                        </div>

                        <div className='flex justify-center gap-4 border-t pt-4'>
                            <Button type='submit' disabled={isSubmitting} className='w-32 bg-primary hover:bg-primary/90'>
                                {isSubmitting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Check className='mr-2 h-4 w-4' />}
                                Report
                            </Button>
                            <Button type='button' variant='destructive' onClick={handleCancel} className='w-32'>
                                <X className='mr-2 h-4 w-4' />
                                Cancel
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleExcel}
                                className='w-32 border-primary text-primary hover:bg-primary/10'>
                                <FileSpreadsheet className='mr-2 h-4 w-4' />
                                Excel
                            </Button>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handlePrint}
                                className='w-32 border-primary text-primary hover:bg-primary/10'>
                                <Printer className='mr-2 h-4 w-4' />
                                Print
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {gridFlag && (
                <Card ref={printRef} className='fade-in-50 slide-in-from-bottom-5 w-full animate-in shadow-lg'>
                    <CardHeader className='border-b bg-primary/5'>
                        <div className='flex items-center justify-between'>
                            <CardTitle className='font-bold text-primary text-xl'>EXAM CATEGORY REPORT</CardTitle>
                            <div className='relative w-64'>
                                <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground' />
                                <Input
                                    type='search'
                                    placeholder='Search...'
                                    className='bg-background pl-8'
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className='pt-6'>
                        <div className='overflow-hidden rounded-md border'>
                            <Table id='reportTable'>
                                <TableHeader className='bg-primary/10'>
                                    <TableRow>
                                        <TableHead className='w-[80px] border-r text-center font-bold'>SL.No.</TableHead>
                                        <TableHead className='border-r font-bold'>CATEGORY</TableHead>
                                        <TableHead className='border-r font-bold'>GROUPS</TableHead>
                                        <TableHead className='font-bold'>SUBJECTS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {finalDetailsList
                                    .filter(
                                        (rt: any) =>
                                            rt.emcA_CategoryName.toLowerCase().includes(searchValue.toLowerCase()) ||
                                            rt.cat_grp_list.some((g: any) =>
                                                g.emG_GroupName.toLowerCase().includes(searchValue.toLowerCase())
                                            )
                                    )
                                    .map((rt: any, index: number) => {
                                        // To replicate the angular nested logic with table constraints
                                        // Angular:
                                        // TBody for each RT
                                        //   TR (rowspan cells)
                                        //   TR-repeat (group cells)
                                        return (
                                            <tbody key={index} className='border-b last:border-0 hover:bg-muted/5'>
                                                {/* Row 1: Category Header / Spanner */}
                                                <TableRow>
                                                    <TableCell
                                                        rowSpan={rt.cat_grp_list.length + 1}
                                                        className='border-r text-center align-middle font-medium'>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell
                                                        rowSpan={rt.cat_grp_list.length + 1}
                                                        className='border-r align-middle font-medium'>
                                                        {rt.emcA_CategoryName}
                                                    </TableCell>
                                                    {/* Empty cells for group/subject in this structural row or we could merge? 
                                                             The HTML had specific TRs.
                                                             If I put nothing here, the row is effectively just the two visible cells?
                                                             We need to render at least empty cells or not? 
                                                             Wait, if I have 4 columns, and I define 2 cells, the other 2 are empty?
                                                             Correct HTML table behavior: if I have a row with 2 cells, and they don't span across the other columns, it might look broken.
                                                             However, the other columns are for Groups/Subjects.
                                                             The HTML Example:
                                                             <tr> 
                                                               <td rowspan>1</td> <td rowspan>Cat</td> 
                                                             </tr>
                                                             <tr ng-repeat>
                                                                <td>Group</td> <td>Subjects</td>
                                                             </tr>
                                                             This means the first row has only 2 TDs. 
                                                             Since the table has 4 columns (thead), 
                                                             the first row effectively has 2 missing cells. 
                                                             This visually creates an empty space in the last 2 columns for that first row line.
                                                             If `cat_grp_list` has items, they appear below.
                                                             This mimics the provided HTML structure.
                                                         */}
                                                </TableRow>
                                                {/* Group Rows */}
                                                {rt.cat_grp_list.map((group: any, gIndex: number) => (
                                                    <TableRow key={gIndex}>
                                                        <TableCell className='border-r'>{group.emG_GroupName}</TableCell>
                                                        <TableCell>
                                                            {group.grp_subjs.map((subj: any, sIndex: number) => (
                                                                <div key={sIndex}>{subj.ismS_SubjectName}</div>
                                                            ))}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </tbody>
                                        );
                                    })}
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
