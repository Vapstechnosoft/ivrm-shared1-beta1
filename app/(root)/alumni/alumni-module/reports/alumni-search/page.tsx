'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getAlumniSearchDropdownData, performAlumniSearch } from '@/server/alumni/alumni-search';
import type { IAlumniAcademicYear, IAlumniClass, IAlumniSearchResultItem } from '@/types/alumni/alumni-search';
import { Loader2, Search as SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AlumniSearchCriteriaBuilder from './_components/alumni-search-criteria-builder';
import AlumniSearchResults from './_components/alumni-search-results';

export default function AlumniSearchPage() {
    const [years, setYears] = useState<IAlumniAcademicYear[]>([]);
    const [classes, setClasses] = useState<IAlumniClass[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [occupations, setOccupations] = useState<string[]>([]);
    const [results, setResults] = useState<IAlumniSearchResultItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [showEmail, setShowEmail] = useState(true);
    const [showPhone, setShowPhone] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch initial dropdown data (Years, Classes)
            const initialRes = await getAlumniSearchDropdownData({});

            if (initialRes.success && initialRes.data) {
                setYears(initialRes.data.yearList || []);
                setClasses(initialRes.data.classList || []);

                // Legacy code also shows loading cities/occupations might not be needed initially
                // or were handled differently. For now, we restore base dropdowns.
            }
        } catch (error) {
            toast.error('Failed to load search preferences');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = async (criteria: any[]) => {
        setIsSearching(true);
        try {
            const payload = {
                field: criteria.map((c) => c.field),
                operator: criteria.map((c) => c.operator),
                value: criteria.map((c) => c.value),
                condition: criteria.map((c) => {
                    const cond = c.condition || 'AND';
                    return cond.charAt(0).toUpperCase() + cond.slice(1).toLowerCase();
                })
            };

            const res = await performAlumniSearch(payload);
            if (res.success && res.data) {
                const rawData = Array.isArray(res.data) ? res.data : res.data.searchResult || [];

                const mappedData: IAlumniSearchResultItem[] = rawData.map((item: any) => ({
                    almst_id: Number(
                        item.almst_id || item.almsT_Id || item.amst_Id || item.student_id || item.ALMST_Id || item.amst_admno || 0
                    ),
                    amsT_FirstName: item.studentname || item.amsT_FirstName || item.ALMST_FirstName || '',
                    amsT_DOB:
                        item.amst_dob || item.amsT_DOB || item.ALMST_DOB
                            ? new Date(item.amst_dob || item.amsT_DOB || item.ALMST_DOB).toLocaleDateString()
                            : '',
                    amsT_MobileNo:
                        item.amst_mobileno || item.amsT_MobileNo || item.ALMST_MobileNo
                            ? (item.amst_mobileno || item.amsT_MobileNo || item.ALMST_MobileNo).toString()
                            : '',
                    amsT_emailId: item.amst_emailid || item.amsT_emailId || item.amst_emailid || item.ALMST_emailId || '',
                    ASMAY_Id_Join:
                        item.ASMAY_Id_Join ||
                        item.asmaY_Year ||
                        item.asmay_year ||
                        (item.amst_date ? new Date(item.amst_date).getFullYear().toString() : '') ||
                        '',
                    ASMAY_Id_Left: item.ASMAY_Id_Left || '',
                    ALMST_MembershipId: item.amst_registrationno || item.ALMST_MembershipId || item.amst_admno || '',
                    amst_admno: item.amst_admno || '',
                    ALMMC_MembershipCategory: item.ALMMC_MembershipCategory || '',
                    IVRMMD_Name: item.IVRMMD_Name || '',
                    amsT_BloodGroup: item.amst_bloodgroup || item.amsT_BloodGroup || item.ALMST_BloodGroup || '',
                    ALSPR_Designation: item.ALSPR_Designation || '',
                    IVRMMS_Name: item.IVRMMS_Name || '',
                    ALMST_ConCity: item.ALMST_ConCity || '',
                    ALMST_FullAddess: item.ALMST_FullAddess || item.amst_p_address || '',
                    ALMST_PerPincode: item.ALMST_PerPincode || '',
                    ASMAY_Id_NEW_Left: item.ASMAY_Id_NEW_Left || item.ASMAY_Id_Left || '',
                    Leftclass: item.asmcl_classname || item.Leftclass || ''
                }));

                setResults(mappedData);
                if (mappedData.length === 0) {
                    toast.info('No alumni records match your criteria.');
                }
            } else {
                toast.error(res.message || 'Search failed');
            }
        } catch (error: any) {
            console.error('Search error:', error);
            toast.error('An error occurred during search');
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setResults([]);
    };

    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center bg-background'>
                <div className='flex flex-col items-center gap-4'>
                    <Loader2 className='h-10 w-10 animate-spin text-primary' />
                    <p className='animate-pulse text-muted-foreground text-sm'>Initializing research engine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto min-h-screen max-w-7xl space-y-8 p-6'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-3'>
                    <div className='rounded-xl bg-primary/10 p-2.5 text-primary shadow-inner'>
                        <SearchIcon className='h-7 w-7' />
                    </div>
                    <h2 className='bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight'>
                        Alumni Search Report
                    </h2>
                </div>
                <p className='ml-14 text-muted-foreground text-sm'>
                    Dynamic query tool for deep alumni database exploration and reporting.
                </p>
            </div>

            <div className='grid grid-cols-1 gap-8'>
                <CollapsibleSection title='Search Criteria Engine' defaultOpen={true} variant='outline'>
                    <div className='p-2'>
                        <AlumniSearchCriteriaBuilder
                            years={years}
                            classes={classes}
                            cities={cities}
                            occupations={occupations}
                            onSearch={handleSearch}
                            onClear={handleClear}
                        />
                    </div>
                </CollapsibleSection>

                {(isSearching || results.length > 0) && (
                    <CollapsibleSection title='Reporting & Analytics' defaultOpen={true} variant='outline'>
                        {isSearching ? (
                            <div className='flex flex-col items-center justify-center space-y-6 p-20'>
                                <div className='relative'>
                                    <div className='absolute inset-0 animate-ping rounded-full bg-primary/20' />
                                    <Loader2 className='relative z-10 h-12 w-12 animate-spin text-primary' />
                                </div>
                                <p className='animate-pulse font-medium text-muted-foreground tracking-wide'>
                                    Retrieving matching profiles...
                                </p>
                            </div>
                        ) : (
                            <AlumniSearchResults
                                data={results}
                                showEmail={showEmail}
                                setShowEmail={setShowEmail}
                                showPhone={showPhone}
                                setShowPhone={setShowPhone}
                                onResetSelection={() => {
                                    // Clear selection when toggling email/phone
                                }}
                            />
                        )}
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
}
