'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { getExamElectivesReport } from '@/server/exam/exam-module/reports/vvehpc_exam-report-card';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import BaldwinElectivesReportForm from './_components/add-form';
import ElectiveReportGridView from './_components/columns';
import ElectiveReportPrintView from './_components/elective-print-view';
import ElectiveReportExcel from './_components/elective-report-excel';

import type { ElectiveGroup, StudentRow } from '@/types/exam/exam-module/report';

export default function ExamElectivesReportPage() {
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [groupList, setGroupList] = useState<ElectiveGroup[]>([]);

    const [isReportVisible, setIsReportVisible] = useState(false);
    const [lastPayload, setLastPayload] = useState<any>(null); // ← NEW: Track last payload
    const printRef = useRef<HTMLDivElement>(null);

    const handleReportSuccess = async (payload: any) => {
        setLastPayload(payload); // ← Save payload to control column visibility

        try {
            const res = await getExamElectivesReport(payload);

            if (!res?.success || !Array.isArray(res.data) || res.data.length === 0) {
                toast.info('No students found for the selected criteria');
                setIsReportVisible(false);
                return;
            }

            // Step 1: Extract unique groups
            const groupMap = new Map<number, string>();
            res.data.forEach((row: any) => {
                if (row.emg_Id && row.emg_GroupName) {
                    groupMap.set(row.emg_Id, row.emg_GroupName.trim());
                }
            });

            const groups: ElectiveGroup[] = Array.from(groupMap.entries()).map(([emG_Id, emG_GroupName]) => ({
                emG_Id,
                emG_GroupName
            }));

            // Step 2: Group students and collect subjects per group
            const studentMap = new Map<number, any>();

            res.data.forEach((row: any) => {
                const studentId = row.amst_Id;
                if (!studentId) return;

                if (!studentMap.has(studentId)) {
                    studentMap.set(studentId, {
                        amsT_Id: row.amst_Id,
                        amsT_FirstName: (row.amst_FirstName || '').trim(),
                        amsT_AdmNo: row.amst_AdmNo,
                        amsT_MobileNo: row.amst_MobileNo === '0' ? '' : row.amst_MobileNo,
                        amsT_emailId: row.amst_EmailId || '',
                        asmcL_ClassName: row.asmcl_ClassName,
                        asmC_SectionName: row.asmc_SectionName,
                        subjectsByGroup: new Map<number, Set<string>>()
                    });
                }

                const student = studentMap.get(studentId)!;
                const groupId = row.emg_Id;
                const subjectName = (row.isms_SubjectName || '').trim();

                if (!student.subjectsByGroup.has(groupId)) {
                    student.subjectsByGroup.set(groupId, new Set<string>());
                }

                if (subjectName) {
                    student.subjectsByGroup.get(groupId)!.add(subjectName);
                }
            });

            // Step 3: Convert to final format
            const formattedStudents: StudentRow[] = Array.from(studentMap.values())
                .map((s) => ({
                    amsT_Id: s.amsT_Id,
                    amsT_FirstName: s.amsT_FirstName,
                    amsT_AdmNo: s.amsT_AdmNo,
                    amsT_MobileNo: s.amsT_MobileNo,
                    amsT_emailId: s.amsT_emailId,
                    asmcL_ClassName: s.asmcL_ClassName,
                    asmC_SectionName: s.asmC_SectionName,
                    sub_list: groups.map((grp) => {
                        const subjectsSet = s.subjectsByGroup.get(grp.emG_Id) || new Set<string>();
                        const subjectArray = Array.from(subjectsSet);

                        return {
                            ismS_Id: 0,
                            ismS_SubjectName: subjectArray.length > 0 ? subjectArray.join(', ') : '@#$%^&',
                            emG_GroupName: grp.emG_GroupName
                        };
                    })
                }))
                .sort((a, b) => a.amsT_FirstName.localeCompare(b.amsT_FirstName));

            setGroupList(groups);
            setStudents(formattedStudents);

            setIsReportVisible(true);

            toast.success(`Report generated: ${formattedStudents.length} students found`);
        } catch (err: any) {
            console.error('Report Error:', err);
            toast.error(err.message || 'Failed to generate report');
            setIsReportVisible(false);
        }
    };

    const handlePrint = () => window.print();

    const showMobile = !!lastPayload?.mob_flg;
    const showEmail = !!lastPayload?.mail_flg;

    useEffect(() => {
        if (isReportVisible && students.length > 0 && printRef.current) {
            printRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isReportVisible, students]);

    return (
        <div className='container mx-auto space-y-6 p-4'>
            <CollapsibleSection title='Elective Subjects Report' defaultOpen>
                <BaldwinElectivesReportForm onSuccess={handleReportSuccess} />
            </CollapsibleSection>

            {isReportVisible && students.length > 0 && (
                <CollapsibleSection title='Elective Subjects Report Result' defaultOpen>
                    <div ref={printRef}>
                        {/* Printable Version */}
                        <ElectiveReportPrintView students={students} groupList={groupList} showMobile={showMobile} showEmail={showEmail} />

                        {/* Screen View */}
                        <div className='print:hidden'>
                            <ElectiveReportGridView
                                students={students}
                                groupList={groupList}
                                showMobile={showMobile}
                                showEmail={showEmail}
                                onPrint={handlePrint}
                            />

                            <div className='mt-6 flex justify-end'>
                                <ElectiveReportExcel
                                    students={students}
                                    groupList={groupList}
                                    showMobile={showMobile}
                                    showEmail={showEmail}
                                />
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>
            )}
        </div>
    );
}
