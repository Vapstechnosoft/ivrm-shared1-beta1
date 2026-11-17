'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputText } from '@/components/ui/extension/input-text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IAlumniSearchResultItem } from '@/types/alumni/alumni-search';
import { BookOpen, FileDown, Printer, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface AlumniSearchResultsProps {
    data: IAlumniSearchResultItem[];
    showEmail: boolean;
    setShowEmail: (v: boolean) => void;
    showPhone: boolean;
    setShowPhone: (v: boolean) => void;
    onResetSelection: () => void;
}

export default function AlumniSearchResults({
    data,
    showEmail,
    setShowEmail,
    showPhone,
    setShowPhone,
    onResetSelection
}: AlumniSearchResultsProps) {
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [showAddressBook, setShowAddressBook] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchValue) return data;
        const lower = searchValue.toLowerCase();
        return data.filter(
            (item) =>
                (item.amsT_FirstName || item.studentname || '').toLowerCase().includes(lower) ||
                (item.ALMST_MembershipId || item.amst_admno || '').toLowerCase().includes(lower) ||
                (showEmail && (item.amsT_emailId || item.amst_emailid || '').toLowerCase().includes(lower)) ||
                (showPhone && (String(item.amsT_MobileNo || item.amst_mobileno || '')).toLowerCase().includes(lower))
        );
    }, [data, searchValue, showEmail, showPhone]);

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            const allIds = filteredData
                .map((item) => item.almst_id || item.amst_admno || item.student_id)
                .filter((id): id is number | string => id !== undefined && id !== null);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleToggleOne = (id: number | string, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        }
    };

    const handleVisibilityChange = (type: 'email' | 'phone', checked: boolean) => {
        if (type === 'email') setShowEmail(checked);
        else setShowPhone(checked);
        setSelectedIds([]);
        onResetSelection();
    };

    const handleExport = () => {
        const selectedData = data.filter((item) => selectedIds.includes(item.almst_id || item.amst_admno || item.student_id || 0));
        if (selectedData.length === 0) {
            toast.warning('Please select at least one record to export.');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(
            selectedData.map((item, index) => {
                const row: any = {
                    'SL NO': index + 1,
                    'Alumni Name': item.amsT_FirstName || item.studentname,
                    DOB: item.amsT_DOB || item.amst_dob
                };
                if (showPhone) row['Mobile No'] = item.amsT_MobileNo || item.amst_mobileno;
                if (showEmail) row['Email Id'] = item.amsT_emailId || item.amst_emailid;
                row['Joined Year'] = item.ASMAY_Id_Join || item.asmay_year;
                row['Left Year'] = item.ASMAY_Id_Left;
                row['Member Id'] = item.ALMST_MembershipId || item.amst_admno;
                row['Member Category'] = item.ALMMC_MembershipCategory;
                row['District'] = item.IVRMMD_Name;
                row['Blood Group'] = item.amsT_BloodGroup || item.amst_bloodgroup;
                row['Profession'] = item.ALSPR_Designation;
                row['City:State'] = `${item.ALMST_ConCity || ''}:${item.IVRMMS_Name || ''}`;
                row['Full Address'] = item.ALMST_FullAddess; // No fallback in JSON
                row['Pin Code'] = item.ALMST_PerPincode;
                return row;
            })
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'AlumniSearch');
        XLSX.writeFile(workbook, 'Alumni_Search_Results.xlsx');
    };

    const handlePrint = () => {
        if (filteredData.length === 0) {
            toast.warning('No records to print.');
            return;
        }
        window.print();
    };

    const allChecked = filteredData.length > 0 && selectedIds.length === filteredData.length;

    const PrintStyles = (
        <style jsx global>{`
            @media screen {
                .print-only {
                    display: none !important;
                }
            }
            @media print {
                @page {
                    margin: 5mm;
                    size: auto;
                }
                html, body {
                    height: auto !important;
                    min-height: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important; /* Hide non-print scrollbars */
                    background: white !important;
                }
                
                /* Hide everything by default */
                body * {
                    visibility: hidden;
                    height: 0; /* Try to collapse global layout space */
                }
                
                /* Reset visibility and height for print root */
                .print-root, .print-root * {
                    visibility: visible !important;
                    height: auto; /* Restore height */
                    color: black !important;
                }

                /* Absolute overlay to bypass global layout */
                div.print-root {
                    display: block !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    
                    /* Fit width exactly */
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    
                    /* Scale to fit single page */
                    zoom: 0.75; 
                    
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                    z-index: 2147483647 !important;
                }

                /* Address Book constraints */
                .print-root .address-card {
                    break-inside: avoid;
                    margin-bottom: 5px; /* Minimal margin */
                    min-height: 140px;
                    border: 1px solid #000;
                }
                
                .pagelayout {
                    page-break-before: avoid !important;
                    break-before: avoid !important;
                }

                /* Table adjustments */
                .print-only table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                }
                .print-only tr {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                .print-only td, .print-only th {
                    padding: 3px;
                    border: 1px solid #000;
                }
                thead {
                    display: table-header-group;
                }
                tfoot {
                    display: table-footer-group;
                }
            }
        `}</style>
    );

    if (showAddressBook) {
        return (
            <div className='fade-in animate-in space-y-4 duration-500 print-root pagelayout'>
                {PrintStyles}
                <div className='flex items-center justify-between px-2'>
                    <div className='flex items-center gap-3'>
                        <div className='rounded-lg bg-orange-100 p-2 text-orange-600'>
                            <BookOpen className='h-5 w-5' />
                        </div>
                        <h3 className='font-bold text-lg'>Address Book Directory</h3>
                    </div>
                    <Button variant='outline' onClick={() => setShowAddressBook(false)} className='h-9 print:hidden'>
                        Back to Data Grid
                    </Button>
                </div>
                <div className='grid grid-cols-1 gap-6 rounded-xl border bg-card p-6 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 print:border-none print:p-0'>
                    {data
                        .filter((item) => selectedIds.includes(item.almst_id || item.amst_admno || item.student_id || 0))
                        .map((item, index) => (
                            <div
                                key={item.almst_id || item.student_id || index}
                                className='address-card flex flex-col justify-between break-inside-avoid rounded-xl border border-dashed border-muted-foreground/30 p-5 transition-all hover:bg-muted/10 print:mb-6 print:min-h-[160px]'>
                                <div>
                                    <div className='mb-2 flex items-center justify-between'>
                                        <span className='font-mono font-semibold text-[10px] text-muted-foreground uppercase tracking-tight'>
                                            {item.ALMST_MembershipId || item.amst_admno || `ID:${item.student_id}`}
                                        </span>
                                        <span className='rounded bg-muted px-1.5 py-0.5 font-medium text-[9px] uppercase'>
                                            {item.ALMMC_MembershipCategory || 'Standard'}
                                        </span>
                                    </div>
                                    <h4 className='font-bold text-foreground text-lg leading-snug'>{item.amsT_FirstName || item.studentname}</h4>
                                    <p className='mt-2 font-medium text-muted-foreground text-sm uppercase'>
                                        Class {(item.Leftclass || item.asmcl_classname) || 'N/A'} • {item.ASMAY_Id_NEW_Left || item.ASMAY_Id_Left || item.asmay_year}
                                    </p>
                                    <p className='mt-3 line-clamp-3 text-muted-foreground text-sm leading-relaxed'>
                                        {item.ALMST_FullAddess || 'Address Not Available'}
                                        {item.ALMST_District && `, ${item.ALMST_District}`}
                                        {item.ALMST_PerPincode && ` - ${item.ALMST_PerPincode}`}
                                    </p>
                                </div>
                                <div className='mt-4 space-y-1.5 border-t pt-3'>
                                    {showPhone && (item.amsT_MobileNo || item.amst_mobileno) && (
                                        <p className='flex items-center text-primary text-xs'>
                                            <span className='font-bold'>M:</span> {item.amsT_MobileNo || item.amst_mobileno}
                                        </p>
                                    )}
                                    {showEmail && (item.amsT_emailId || item.amst_emailid) && (
                                        <p className='flex items-center truncate text-primary text-xs'>
                                            <span className='font-bold'>E:</span> {item.amsT_emailId || item.amst_emailid}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
                <div className='flex justify-center pt-6 print:hidden'>
                    <Button onClick={() => window.print()} className='h-11 px-8 shadow-lg shadow-primary/20'>
                        <Printer className='mr-2 h-5 w-5' /> Generate Print Version
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='fade-in animate-in space-y-6 duration-500'>
            {PrintStyles}
            <div className='flex flex-col items-center justify-between gap-6 px-2 sm:flex-row print:hidden'>
                <div className='flex items-center gap-6 rounded-lg bg-muted/40 p-2.5 px-4'>
                    <span className='font-semibold text-muted-foreground text-xs uppercase tracking-wider'>Display Options:</span>
                    <div className='flex items-center gap-6'>
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                id='email_toggle'
                                checked={showEmail}
                                onCheckedChange={(v) => handleVisibilityChange('email', !!v)}
                            />
                            <label htmlFor='email_toggle' className='cursor-pointer font-medium text-sm select-none'>
                                Email
                            </label>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                id='ph_toggle'
                                checked={showPhone}
                                onCheckedChange={(v) => handleVisibilityChange('phone', !!v)}
                            />
                            <label htmlFor='ph_toggle' className='cursor-pointer font-medium text-sm select-none'>
                                Phone No.
                            </label>
                        </div>
                    </div>
                </div>
                <div className='relative w-full sm:w-80'>
                    <Search className='-translate-y-1/2 absolute top-1/2 left-3.5 h-4 w-4 text-muted-foreground/70' />
                    <InputText
                        placeholder='Search results by name, mobile, id...'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className='h-10 pl-10 shadow-sm'
                    />
                </div>
            </div>

            <ScrollArea className='h-[550px] overflow-hidden rounded-xl border bg-card shadow-sm print:hidden'>
                <Table className='print:hidden'>
                    <TableHeader className='sticky top-0 z-20 bg-muted/90 backdrop-blur-md'>
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className='w-[60px] text-center'>
                                <Checkbox checked={allChecked} onCheckedChange={(v) => handleToggleAll(!!v)} />
                            </TableHead>
                            <TableHead className='w-[70px] text-center font-bold'>SL</TableHead>
                            <TableHead className='min-w-[200px] font-bold'>Alumni Name</TableHead>
                            <TableHead className='w-[100px] font-bold'>DOB</TableHead>
                            {showPhone && <TableHead className='min-w-[140px] font-bold'>Mobile No</TableHead>}
                            {showEmail && <TableHead className='min-w-[200px] font-bold'>Email Id</TableHead>}
                            <TableHead className='w-[110px] text-center font-bold'>Joined</TableHead>
                            <TableHead className='w-[110px] text-center font-bold'>Left</TableHead>
                            <TableHead className='min-w-[130px] font-bold'>Member Id</TableHead>
                            <TableHead className='min-w-[160px] font-bold'>Category</TableHead>
                            <TableHead className='min-w-[250px] font-bold'>Full Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={showEmail && showPhone ? 11 : showEmail || showPhone ? 10 : 9} className='h-48 text-center'>
                                    <div className='flex flex-col items-center justify-center space-y-2 opacity-50'>
                                        <Search className='h-12 w-12' />
                                        <p className='text-muted-foreground'>No matching records found in the database.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item, index) => (
                                <TableRow
                                    key={item.almst_id || item.student_id || index}
                                    className={selectedIds.includes(item.almst_id || item.amst_admno || item.student_id || 0) ? 'bg-primary/5 hover:bg-primary/10' : ''}>
                                    <TableCell className='text-center'>
                                        <Checkbox
                                            checked={selectedIds.includes(item.almst_id || item.amst_admno || item.student_id || 0)}
                                            onCheckedChange={(v) => handleToggleOne(item.almst_id || item.amst_admno || item.student_id || 0, !!v)}
                                        />
                                    </TableCell>
                                    <TableCell className='text-center font-medium text-muted-foreground'>{index + 1}</TableCell>
                                    <TableCell className='font-bold text-foreground'>{item.amsT_FirstName || item.studentname}</TableCell>
                                    <TableCell className='text-[11px] text-muted-foreground whitespace-nowrap'>{item.amsT_DOB || item.amst_dob}</TableCell>
                                    {showPhone && <TableCell className='font-mono text-xs text-primary'>{item.amsT_MobileNo || item.amst_mobileno}</TableCell>}
                                    {showEmail && <TableCell className='text-[11px] text-primary transition-colors hover:underline cursor-default'>{item.amsT_emailId || item.amst_emailid}</TableCell>}
                                    <TableCell className='text-center text-xs'>{item.ASMAY_Id_Join || item.asmay_year}</TableCell>
                                    <TableCell className='text-center text-xs'>{item.ASMAY_Id_Left}</TableCell>
                                    <TableCell className='font-mono text-[11px] font-bold text-muted-foreground'>{item.ALMST_MembershipId || item.amst_admno || item.student_id}</TableCell>
                                    <TableCell className='text-[11px] font-medium'>{item.ALMMC_MembershipCategory}</TableCell>
                                    <TableCell className='max-w-[250px] truncate text-[11px] text-muted-foreground leading-relaxed' title={item.ALMST_FullAddess}>
                                        {item.ALMST_FullAddess}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className='print-only print-root pagelayout'>
                <div className='mb-6 border-b pb-4 text-center'>
                    <h2 className='font-bold text-2xl text-black uppercase'>Alumni Search Directory</h2>
                    <p className='mt-1 font-medium text-black text-sm italic'>
                        Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                </div>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th className='border border-black bg-gray-100 p-2 font-bold text-xs uppercase'>SL</th>
                            <th className='border border-black bg-gray-100 p-2 font-bold text-xs uppercase'>Alumni Name</th>
                            <th className='border border-black bg-gray-100 p-2 font-bold text-xs uppercase'>DOB</th>
                            {showPhone && <th className='border border-black bg-gray-100 p-2 font-bold text-xs uppercase'>Mobile No</th>}
                            {showEmail && <th className='border border-black bg-gray-100 p-2 font-bold text-xs uppercase'>Email Id</th>}
                            <th className='border border-black bg-gray-100 p-2 font-bold text-xs uppercase'>Full Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(selectedIds.length > 0 ? data.filter((item) => selectedIds.includes(item.almst_id || item.amst_admno || item.student_id || 0)) : filteredData).map(
                            (item, index) => (
                                <tr key={item.almst_id || item.student_id || index} className='break-inside-avoid'>
                                    <td className='border border-black p-2 text-center'>{index + 1}</td>
                                    <td className='border border-black p-2 font-bold'>{item.amsT_FirstName || item.studentname}</td>
                                    <td className='border border-black p-2 text-center'>{item.amsT_DOB || item.amst_dob}</td>
                                    {showPhone && <td className='border border-black p-2 text-center'>{item.amsT_MobileNo || item.amst_mobileno}</td>}
                                    {showEmail && <td className='border border-black p-2 truncate'>{item.amsT_emailId || item.amst_emailid}</td>}
                                    <td className='border border-black p-2 leading-tight'>{item.ALMST_FullAddess}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            <div className='flex flex-wrap justify-center gap-4 pt-4 print:hidden'>
                <Button
                    variant='outline'
                    onClick={handleExport}
                    disabled={selectedIds.length === 0}
                    className='h-11 min-w-[170px] border-primary/20 bg-background/50 text-primary shadow-sm transition-all hover:bg-primary/5 active:scale-95'>
                    <FileDown className='mr-2.5 h-5 w-5' /> Export Data (Excel)
                </Button>
                <Button
                    variant='outline'
                    onClick={handlePrint}
                    disabled={selectedIds.length === 0}
                    className='h-11 min-w-[150px] shadow-sm transition-all active:scale-95'>
                    <Printer className='mr-2.5 h-5 w-5' /> Print Selection
                </Button>
                <Button
                    variant='outline'
                    onClick={() => setShowAddressBook(true)}
                    disabled={selectedIds.length === 0}
                    className='h-11 min-w-[180px] border-orange-200 bg-orange-50/30 text-orange-600 shadow-sm transition-all hover:bg-orange-50 active:scale-95'>
                    <BookOpen className='mr-2.5 h-5 w-5' /> {selectedIds.length > 0 ? 'Open Selection' : 'Open Address Book'}
                </Button>
            </div>
        </div>
    );
}
