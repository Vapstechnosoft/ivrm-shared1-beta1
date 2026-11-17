'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInitialData, getReportData } from '@/server/alumni/alumni-report';
import type { IAlumniReportInitialData, IAlumniReportResultItem } from '@/types/alumni/alumni-report';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { AddressBookPrint } from './_components/address-book-print';
import { AlumniReportFilterForm } from './_components/alumni-report-filter-form';
import { AlumniReportPrint } from './_components/alumni-report-print';
import { AlumniReportResultsTable } from './_components/alumni-report-results-table';
import type { AlumniReportFormValues } from './_components/schema';

export default function AlumniReportPage() {
    const [initialData, setInitialData] = useState<IAlumniReportInitialData | null>(null);
    const [reportData, setReportData] = useState<IAlumniReportResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isReportView, setIsReportView] = useState(true);
    const [showEmail, setShowEmail] = useState(true);
    const [showPhone, setShowPhone] = useState(true);

    // Printing refs
    const printRef = useRef<HTMLDivElement>(null);
    const addressBookRef = useRef<HTMLDivElement>(null);
    const [selectedForPrint, setSelectedForPrint] = useState<IAlumniReportResultItem[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const initialRes = await getInitialData();
                console.log('Alumni Report Initial Data Response:', initialRes);

                const iRes = initialRes as any;
                if (iRes && iRes.success) {
                    const dataVal = iRes.data || iRes;
                    const data = { ...(dataVal.data || dataVal) };

                    // Initialize lists as empty or from initial response if present (default)
                    data.yearList = data.yearList || data.YearList || [];
                    data.classList = data.classList || data.ClassList || [];
                    data.countrylist = data.countrylist || data.countryList || data.CountryList || data.retObject || [];
                    data.citylist = data.citylist || data.cityList || data.CityList || [];
                    data.occupationlist = data.occupationlist || data.occupationList || data.OccupationList || [];

                    setInitialData(data);
                } else {
                    console.error('Failed response:', initialRes);
                    toast.error(iRes?.message || 'Failed to load initial data');
                }
            } catch (err) {
                console.error('Page fetch error:', err);
                toast.error('An unexpected error occurred');
            }
        };
        fetchInitialData();
    }, []);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Alumni_Report',
        pageStyle: `
          @page { size: A4; margin: 20mm; }
          @media print { 
            body { -webkit-print-color-adjust: exact; }
          }
        `
    });

    const handlePrintAddress = useReactToPrint({
        contentRef: addressBookRef,
        documentTitle: 'Alumni_Address_Book',
        pageStyle: `
          @page { size: A4; margin: 10mm; }
          @media print { 
            body { -webkit-print-color-adjust: exact; }
          }
        `
    });

    const handleSubmit = async (values: AlumniReportFormValues) => {
        setLoading(true);
        setIsReportView(values.sall === 1);
        setShowEmail(values.showEmail);
        setShowPhone(values.showPhone);

        const payload = {
            Occupation: values.occupation || '',
            city: values.city || '',
            statelistarray: values.stateIds?.map((id) => ({ IVRMMS_Id: id })) || [],
            classlistnew: values.classIds?.map((id) => ({ ASMCL_Id: id })) || [],
            countrylistarray: values.countryIds?.map((id) => ({ IVRMMC_Id: id })) || [],
            districtlistarray: values.districtIds?.map((id) => ({ IVRMMD_Id: id })) || [],
            multipleBatchs: values.batchIds.map((id) => ({ ASMAY_Id: id }))
        };

        try {
            const response = await getReportData(payload);
            if (response.success && response.data) {
                let rawData: any[] = [];
                if (Array.isArray(response.data)) {
                    rawData = response.data;
                } else if (response.data.searchstudentDetails) {
                    rawData = response.data.searchstudentDetails;
                }

                // Map API response to Component Interface
                const mappedData: IAlumniReportResultItem[] = rawData.map((item: any) => ({
                    almst_Id: item.almst_id || item.almst_Id,
                    amsT_FirstName: item.amst_firstname || item.amsT_FirstName,
                    amsT_DOB: item.amst_dob || item.amsT_DOB,
                    ALMST_FatherName: item.almst_fathername || item.ALMST_FatherName,
                    amsT_MobileNo: item.amst_mobileno || item.amsT_MobileNo,
                    amsT_emailId: item.amst_emailid || item.amsT_emailId,
                    ASMAY_Id_Join: item.asmay_join || item.ASMAY_Id_Join,
                    ASMAY_Id_Left: item.asmay_left || item.ASMAY_Id_Left,
                    JoinClass: item.join_class || item.JoinClass,
                    LeftClass: item.left_class || item.LeftClass,
                    ALMST_MembershipId: item.almst_membershipid || item.ALMST_MembershipId,
                    ALMMC_MembershipCategory: item.membership_category || item.ALMMC_MembershipCategory,
                    IVRMMD_Name: item.ivrmmD_Name || item.IVRMMD_Name || (item.almst_district ? item.almst_district.toString() : ''),
                    amsT_BloodGroup: item.amst_bloodgroup || item.amsT_BloodGroup,
                    ALSPR_Designation: item.alspr_designation || item.ALSPR_Designation,
                    city: item.city || item.almst_concity || '',
                    ALMST_FullAddess: item.almst_fulladdress || item.ALMST_FullAddess,
                    ALMST_ConPincode: item.almst_conpincode || item.ALMST_ConPincode,
                    ALMST_PerPincode: item.almst_perpincode || item.ALMST_PerPincode || '',
                    ASMAY_Id_NEW_Left: item.asmay_new_left || item.ASMAY_Id_NEW_Left
                }));

                setReportData(mappedData);
                if (mappedData.length === 0) {
                    toast.info('No records found for the selected filters');
                }
            } else {
                toast.error(response.message || 'Failed to fetch report data');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching report data');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setReportData([]);
    };

    const [printType, setPrintType] = useState<'report' | 'address' | null>(null);

    useEffect(() => {
        if (printType && selectedForPrint.length > 0) {
            // Small timeout to ensure the print template has rendered the new data
            const timer = setTimeout(() => {
                if (printType === 'report') {
                    handlePrint();
                } else if (printType === 'address') {
                    handlePrintAddress();
                }
                setPrintType(null);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [selectedForPrint, printType, handlePrint, handlePrintAddress]);

    const initiatePrint = (selected: IAlumniReportResultItem[]) => {
        setSelectedForPrint(selected);
        setPrintType('report');
    };

    const initiatePrintAddress = (selected: IAlumniReportResultItem[]) => {
        setSelectedForPrint(selected);
        setPrintType('address');
    };

    if (!initialData) {
        return <div className='p-8 text-center'>Loading initial data...</div>;
    }

    return (
        <div className='space-y-6 p-6'>
            <Card>
                <CardHeader>
                    <CardTitle className='font-bold text-2xl text-primary'>Alumni Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <AlumniReportFilterForm initialData={initialData} onSubmit={handleSubmit} onReset={handleReset} loading={loading} />
                </CardContent>
            </Card>

            {reportData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AlumniReportResultsTable
                            data={reportData}
                            showEmail={showEmail}
                            showPhone={showPhone}
                            onPrint={initiatePrint}
                            onPrintAddressBook={initiatePrintAddress}
                            isReportView={isReportView}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Print Templates - Rendered but invisible until printing */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    overflow: 'hidden',
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1
                }}>
                <div ref={printRef}>
                    <AlumniReportPrint
                        data={selectedForPrint}
                        institutionName='VAPS TECHNOSOFT'
                        showEmail={showEmail}
                        showPhone={showPhone}
                    />
                </div>
                <div ref={addressBookRef}>
                    <AddressBookPrint data={selectedForPrint} showEmail={showEmail} showPhone={showPhone} />
                </div>
            </div>
        </div>
    );
}
