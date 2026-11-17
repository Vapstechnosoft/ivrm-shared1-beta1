
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, X, List } from 'lucide-react';
import type {
    IStudentTransactionInitialData,
    IClass,
    ISection,
    IExamTerm,
    IExamMaster,
    ISkill,
    IActivity,
    IArea,
    IStudentTransactionSearchRequest
} from '@/types/staff-portal/student-transaction-cce';

interface FilterProps {
    initialData?: IStudentTransactionInitialData | null;
    onSearch: (params: IStudentTransactionSearchRequest) => void;
    onReset: () => void;
    isLoading: boolean;
    getClasses: (y: number, f: string) => Promise<IClass[]>;
    getSections: (y: number, c: number, f: string) => Promise<ISection[]>;
    getTermsOrExams: (y: number, c: number, s: number, f: string) => Promise<{ examTerms: IExamTerm[], exammaster: IExamMaster[] }>;
    getSkillsOrActivities: (sk: string, y: number, c: number, s: number, f: string) => Promise<{ skillsList: ISkill[], activitiesList: IActivity[] }>;
    getActivitiesAreas: (data: any) => Promise<IArea[]>;
    getSkillsAreas: (data: any) => Promise<IArea[]>;
}

export default function StudentTransactionFilter({
    initialData,
    onSearch,
    onReset,
    isLoading,
    getClasses,
    getSections,
    getTermsOrExams,
    getSkillsOrActivities,
    getActivitiesAreas,
    getSkillsAreas
}: FilterProps) {
    const [flag, setFlag] = useState<'TermWise' | 'ExamWise'>('TermWise');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [skillsType, setSkillsType] = useState<string>('');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedActivity, setSelectedActivity] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');

    const [classList, setClassList] = useState<IClass[]>([]);
    const [sectionList, setSectionList] = useState<ISection[]>([]);
    const [examTerms, setExamTerms] = useState<IExamTerm[]>([]);
    const [exammaster, setExammaster] = useState<IExamMaster[]>([]);
    const [skillsList, setSkillsList] = useState<ISkill[]>([]);
    const [activitiesList, setActivitiesList] = useState<IActivity[]>([]);
    const [areasList, setAreasList] = useState<IArea[]>([]);

    useEffect(() => {
        if (initialData?.academicYear) {
            // No auto-select for year as per Angular code unless ng-selected
        }
    }, [initialData]);

    const resetSelections = (level: 'flag' | 'year' | 'class' | 'section' | 'term' | 'skillType' | 'item' | 'area') => {
        if (level === 'flag') {
            setSelectedYear('');
            setClassList([]);
        }
        if (['flag', 'year'].includes(level)) {
            setSelectedClass('');
            setSectionList([]);
        }
        if (['flag', 'year', 'class'].includes(level)) {
            setSelectedSection('');
            setExamTerms([]);
            setExammaster([]);
        }
        if (['flag', 'year', 'class', 'section'].includes(level)) {
            setSelectedTerm('');
            setSelectedExam('');
            setSkillsType('');
        }
        if (['flag', 'year', 'class', 'section', 'term'].includes(level)) {
            setSkillsList([]);
            setActivitiesList([]);
            setSelectedSkill('');
            setSelectedActivity('');
        }
        if (['flag', 'year', 'class', 'section', 'term', 'skillType'].includes(level)) {
            setAreasList([]);
            setSelectedArea('');
        }
    };

    const handleFlagChange = (val: 'TermWise' | 'ExamWise') => {
        setFlag(val);
        resetSelections('flag');
    };

    const handleYearChange = async (val: string) => {
        setSelectedYear(val);
        resetSelections('year');
        const res = await getClasses(Number(val), flag);
        setClassList(res);
    };

    const handleClassChange = async (val: string) => {
        setSelectedClass(val);
        resetSelections('class');
        const res = await getSections(Number(selectedYear), Number(val), flag);
        setSectionList(res);
    };

    const handleSectionChange = async (val: string) => {
        setSelectedSection(val);
        resetSelections('section');
        const res = await getTermsOrExams(Number(selectedYear), Number(selectedClass), Number(val), flag);
        if (flag === 'TermWise') setExamTerms(res.examTerms);
        else setExammaster(res.exammaster);
    };

    const handleTermOrExamChange = (val: string) => {
        if (flag === 'TermWise') setSelectedTerm(val);
        else setSelectedExam(val);
        resetSelections('term');
    };

    const handleSkillsTypeChange = async (val: string) => {
        setSkillsType(val);
        resetSelections('skillType');
        const res = await getSkillsOrActivities(val, Number(selectedYear), Number(selectedClass), Number(selectedSection), flag);
        if (val === 'Skills') setSkillsList(res.skillsList);
        else setActivitiesList(res.activitiesList);
    };

    const handleItemChange = async (val: string) => {
        const payload: any = {
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection),
            exam_termwise_flag: flag
        };
        if (flag === 'TermWise') payload.ECT_Id = Number(selectedTerm);
        else payload.EME_Id = Number(selectedExam);

        if (skillsType === 'Skills') {
            setSelectedSkill(val);
            payload.ECS_Id = Number(val);
            const areas = await getSkillsAreas(payload);
            setAreasList(areas);
        } else {
            setSelectedActivity(val);
            payload.ECACT_Id = Number(val);
            const areas = await getActivitiesAreas(payload);
            setAreasList(areas);
        }
        setSelectedArea('');
    };

    const handleSearch = () => {
        const params: IStudentTransactionSearchRequest = {
            ASMAY_Id: Number(selectedYear),
            ASMCL_Id: Number(selectedClass),
            ASMS_Id: Number(selectedSection),
            Skills: skillsType as any,
            exam_termwise_flag: flag,
            ECS_Id: Number(selectedSkill || 0),
            ECACT_Id: Number(selectedActivity || 0),
            ECSA_Id: Number(skillsType === 'Skills' ? selectedArea : 0),
            ECACTA_Id: Number(skillsType === 'Activities' ? selectedArea : 0),
        };

        if (flag === 'TermWise') params.ECT_Id = Number(selectedTerm);
        else params.EME_Id = Number(selectedExam);

        onSearch(params);
    };

    return (
        <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-3 px-6">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                    <List className="h-5 w-5" />
                    Student Transaction Filter
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
                <div className="flex justify-center mb-6">
                    <RadioGroup
                        value={flag}
                        onValueChange={handleFlagChange as any}
                        className="flex items-center gap-8 bg-muted/40 p-3 rounded-full border border-primary/5 px-8"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="TermWise" id="term-wise" />
                            <Label htmlFor="term-wise" className="cursor-pointer font-medium">Term Wise</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ExamWise" id="exam-wise" />
                            <Label htmlFor="exam-wise" className="cursor-pointer font-medium">Exam Wise</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Select value={selectedYear} onValueChange={handleYearChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="--Select Year--" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData?.academicYear?.map(yr => (
                                    <SelectItem key={yr.asmaY_Id} value={yr.asmaY_Id.toString()}>{yr.asmaY_Year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={selectedClass} onValueChange={handleClassChange} disabled={!selectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="--Select Class--" />
                            </SelectTrigger>
                            <SelectContent>
                                {classList.map(cls => (
                                    <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>{cls.asmcL_ClassName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Section</Label>
                        <Select value={selectedSection} onValueChange={handleSectionChange} disabled={!selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="--Select Section--" />
                            </SelectTrigger>
                            <SelectContent>
                                {sectionList.map(sec => (
                                    <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>{sec.asmC_SectionName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{flag === 'TermWise' ? 'Exam Term' : 'Exam'}</Label>
                        <Select
                            value={flag === 'TermWise' ? selectedTerm : selectedExam}
                            onValueChange={handleTermOrExamChange}
                            disabled={!selectedSection}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="--Select--" />
                            </SelectTrigger>
                            <SelectContent>
                                {flag === 'TermWise' ? (
                                    examTerms.map(t => <SelectItem key={t.ecT_Id} value={t.ecT_Id.toString()}>{t.ecT_TermName}</SelectItem>)
                                ) : (
                                    exammaster.map(e => <SelectItem key={e.emE_Id} value={e.emE_Id.toString()}>{e.emE_ExamName}</SelectItem>)
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Skill / Activities</Label>
                        <Select value={skillsType} onValueChange={handleSkillsTypeChange} disabled={!(selectedTerm || selectedExam)}>
                            <SelectTrigger>
                                <SelectValue placeholder="--Select--" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Skills">Skills</SelectItem>
                                <SelectItem value="Activities">Activities</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{skillsType === 'Skills' ? 'Skills Name' : 'Activities Name'}</Label>
                        <Select
                            value={skillsType === 'Skills' ? selectedSkill : selectedActivity}
                            onValueChange={handleItemChange}
                            disabled={!skillsType}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="--Select--" />
                            </SelectTrigger>
                            <SelectContent>
                                {skillsType === 'Skills' ? (
                                    skillsList.map(s => <SelectItem key={s.ecS_Id} value={s.ecS_Id.toString()}>{s.ecS_SkillName}</SelectItem>)
                                ) : (
                                    activitiesList.map(a => <SelectItem key={a.ecacT_Id} value={a.ecacT_Id.toString()}>{a.ecacT_SkillName}</SelectItem>)
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 lg:col-span-1">
                        <Label>{skillsType === 'Skills' ? 'Skill Area' : 'Activities Area'}</Label>
                        <Select
                            value={selectedArea}
                            onValueChange={setSelectedArea}
                            disabled={!(selectedSkill || selectedActivity)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="--Select--" />
                            </SelectTrigger>
                            <SelectContent>
                                {areasList.map(area => {
                                    const id = (skillsType === 'Skills' ? area.ecsA_Id : area.ecactA_Id)?.toString() || '';
                                    return <SelectItem key={id} value={id}>{area.areaName}</SelectItem>;
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="flex items-center gap-2 hover:bg-destructive/10 text-destructive border border-destructive/20"
                    >
                        <X className="h-4 w-4" />
                        Clear Selections
                    </Button>
                    <Button
                        onClick={handleSearch}
                        disabled={isLoading || !selectedArea}
                        className="bg-primary hover:bg-primary/90 flex items-center gap-2 min-w-[160px] shadow-lg shadow-primary/20"
                    >
                        <Search className="h-4 w-4" />
                        {isLoading ? 'Loading List...' : 'Student List'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
