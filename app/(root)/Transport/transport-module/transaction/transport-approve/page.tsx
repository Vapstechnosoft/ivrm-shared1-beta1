'use client';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { useState } from 'react';
import AddForm from './_components/add-form';
import ApprovedList from './_components/approved-list';
import StudentList from './_components/student-list';

export default function TransportApprovePage() {
    const [studentData, setStudentData] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState<any>(null);

    const handleSearch = (data: any[], params: any) => {
        setStudentData(data);
        setSearchParams(params); // Store params for save action
    };

    return (
        <div className='container min-h-screen space-y-4 p-4'>
            <CollapsibleSection title='Transport Approve Form' defaultOpen={true}>
                <AddForm
                    onSearch={(data: any[]) =>
                        handleSearch(data, {
                            /* Pass current form values if needed */
                        })
                    }
                />
            </CollapsibleSection>

            {studentData.length > 0 && (
                <CollapsibleSection title='Student List' defaultOpen={true}>
                    <StudentList
                        data={studentData}
                        searchParams={searchParams}
                        onRefresh={() => {
                            /* re-trigger search */
                        }}
                    />
                </CollapsibleSection>
            )}

            <CollapsibleSection title='Approved/Rejected List' defaultOpen={false}>
                <ApprovedList />
            </CollapsibleSection>
        </div>
    );
}
