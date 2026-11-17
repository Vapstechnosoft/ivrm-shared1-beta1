'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';
import { getInteractionDetails, saveInteraction, getSection, getStudent } from '../actions';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ComposeTabProps {
    roleFlg: string;
    configFlag: string;
    userHrmIds: number;
    onSuccess: () => void;
    isGroup: boolean;
    initialData: any;
}

export function ComposeTab({ roleFlg, configFlag, userHrmIds, onSuccess, isGroup, initialData }: ComposeTabProps) {
    const isStudent = roleFlg === 'Student';

    // User Flag (Who we are messaging)
    // For Student: SubjectTeacher, ClassTeacher, HOD, Principal
    // For Staff: Student, Teachers, HOD, Principal
    const [userFlag, setUserFlag] = useState<string>(isStudent ? 'SubjectTeacher' : 'Student');

    const [selectedRecipient, setSelectedRecipient] = useState<string>(''); // For single select
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]); // For group select

    // Staff Dropdown States (For Student Selection)
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');

    const [classList, setClassList] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');

    const [sectionList, setSectionList] = useState<any[]>([]);
    const [selectedSection, setSelectedSection] = useState<string>('');

    const [studentList, setStudentList] = useState<any[]>([]);

    // Generic Recipients (For Staff->Teacher or Student->Teacher)
    const [recipients, setRecipients] = useState<any[]>([]);

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Initial Data Loading
    useEffect(() => {
        if (initialData) {
            if (initialData.academicList) setAcademicYears(initialData.academicList);
            if (initialData.courselist) setClassList(initialData.courselist);
            // Set default year if available
            if (initialData.academicList && initialData.academicList.length > 0) {
                const currentYear = initialData.academicList.find((y: any) => y.asmaY_Id === initialData.asmaY_Id);
                if (currentYear) setSelectedYear(currentYear.asmaY_Id.toString());
                else setSelectedYear(initialData.academicList[0].asmaY_Id.toString());
            }
        }
    }, [initialData]);

    // Fetch Recipients when UserFlag changes (For everyone EXCEPT Staff->Student)
    useEffect(() => {
        // If Staff selecting Student, we use Class/Section dropdowns instead of generic fetch
        if (!isStudent && userFlag === 'Student') {
            setRecipients([]); // Clear recipients if we're going to use studentList
            return;
        }

        // For all other cases (Student messaging staff, or Staff messaging staff)
        if (userFlag) {
            fetchRecipients();
        }
    }, [userFlag, isStudent]);

    const fetchRecipients = async () => {
        try {
            const data = {
                roleflg: roleFlg,
                userflag: userFlag
            };
            const response = await getInteractionDetails(data);
            if (response && response.getdetails) {
                setRecipients(response.getdetails);
            } else {
                setRecipients([]);
            }
        } catch (error) {
            console.error("Error fetching details", error);
            setRecipients([]);
        }
    };

    // Staff Logic: Fetch Section when Class/Year changes (Only for Student selection)
    useEffect(() => {
        if (!isStudent && userFlag === 'Student' && selectedClass && selectedYear) {
            fetchSections();
        }
    }, [selectedClass, selectedYear, isStudent, userFlag]);

    // Staff Logic: Fetch Students when Section changes (Only for Student selection)
    useEffect(() => {
        if (!isStudent && userFlag === 'Student' && selectedSection && selectedClass && selectedYear) {
            fetchStudents();
        }
    }, [selectedSection, isStudent, userFlag]);


    const fetchSections = async () => {
        try {
            const payload = {
                ASMAY_Id: Number.parseInt(selectedYear),
                ASMCL_Id: Number.parseInt(selectedClass),
                roleflg: roleFlg
            };
            const response = await getSection(payload);
            if (response && response.sectionList) {
                setSectionList(response.sectionList);
            } else {
                setSectionList([]);
            }
        } catch (err) {
            console.error("Error fetching sections", err);
            setSectionList([]);
        }
    };

    const fetchStudents = async () => {
        try {
            const payload = {
                ASMAY_Id: Number.parseInt(selectedYear),
                ASMCL_Id: Number.parseInt(selectedClass),
                ASMS_Id: Number.parseInt(selectedSection),
                roleflg: roleFlg
            };
            const response = await getStudent(payload);
            if (response && response.studentList) {
                setStudentList(response.studentList);
            } else if (response && response.get_student) {
                setStudentList(response.get_student);
            } else {
                setStudentList([]);
            }
        } catch (err) {
            console.error("Error fetching students", err);
            setStudentList([]);
        }
    };

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            toast.error("Validation Error", { description: "Please enter subject and message." });
            return;
        }

        setIsSending(true);
        try {
            let recipientPayload: any[] = [];

            // Recipient Logic
            if (isStudent || (!isStudent && userFlag !== 'Student')) {
                // Using Generic Recipient List (Staff->Teacher/HOD/Principal or Student->Staff)
                if (!selectedRecipient) {
                    toast.error("Validation Error", { description: "Please select a recipient." });
                    setIsSending(false);
                    return;
                }
                // For Teacher/HOD/Principal, usually HRME_Id is the identifier
                recipientPayload.push({ hrme_Id: Number.parseInt(selectedRecipient) });
            } else {
                // Staff -> Student Logic
                if (isGroup) {
                    recipientPayload = selectedRecipients.map(id => ({ amst_Id: Number.parseInt(id) }));
                } else {
                    if (selectedRecipient) {
                        recipientPayload.push({ amst_Id: Number.parseInt(selectedRecipient) });
                    }
                }

                if (recipientPayload.length === 0) {
                    toast.error("Validation Error", { description: "Please select at least one recipient." });
                    setIsSending(false);
                    return;
                }
            }

            const payload: any = {
                ISMINT_InteractionId: 0,
                ISMINT_Subject: subject,
                ISMINT_Interaction: message,
                ISMINT_GroupOrIndFlg: isGroup ? 'Group' : 'Individual',
                ISMINT_ComposedByFlg: roleFlg,
                ISMINT_ComposedById: userHrmIds,
                arraystudent: recipientPayload, // This will contain either amst_Id or hrme_Id based on context
                roleflg: roleFlg,
                userflag: userFlag
            };

            // Adjust payload for Student -> Staff (legacy specific field)
            if (isStudent) {
                payload.ISTINT_ToId = Number.parseInt(selectedRecipient);
            }

            const response = await saveInteraction(payload);

            if (response && response.returnval === true) {
                toast.success("Success", { description: "Message sent successfully!" });
                setSubject('');
                setMessage('');
                setSelectedRecipients([]);
                setSelectedRecipient('');
                onSuccess();
            } else {
                toast.error("Error", { description: "Failed to send message." });
            }

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Error", { description: "Failed to send message." });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-primary shadow-md">
            <CardContent className="space-y-6 pt-6">

                {/* Role Selection Radio Group */}
                <div className="p-4 bg-slate-50 border rounded-md">
                    <Label className="mb-3 block text-base font-semibold">Select Recipient Type:</Label>
                    <RadioGroup value={userFlag} onValueChange={setUserFlag} className="flex flex-wrap gap-6">
                        {isStudent ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SubjectTeacher" id="r-st" />
                                    <Label htmlFor="r-st" className="cursor-pointer">Subject Teacher</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ClassTeacher" id="r-ct" />
                                    <Label htmlFor="r-ct" className="cursor-pointer">Class Teacher</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="HOD" id="r-hod" />
                                    <Label htmlFor="r-hod" className="cursor-pointer">HOD</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Principal" id="r-pri" />
                                    <Label htmlFor="r-pri" className="cursor-pointer">Principal</Label>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Student" id="r-std" />
                                    <Label htmlFor="r-std" className="cursor-pointer">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Teachers" id="r-tch" />
                                    <Label htmlFor="r-tch" className="cursor-pointer">Teachers</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="HOD" id="r-hod-s" />
                                    <Label htmlFor="r-hod-s" className="cursor-pointer">HOD</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Principal" id="r-pri-s" />
                                    <Label htmlFor="r-pri-s" className="cursor-pointer">Principal</Label>
                                </div>
                            </>
                        )}
                    </RadioGroup>
                </div>

                {/* Staff -> Student Dropdowns (Only when Staff selects Student) */}
                {!isStudent && userFlag === 'Student' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md bg-white">
                        <div className="space-y-2">
                            <Label>Academic Year <span className="text-red-500">*</span></Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((year: any) => (
                                        <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Class <span className="text-red-500">*</span></Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classList.map((cls: any) => (
                                        <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                            {cls.asmcL_ClassName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Section <span className="text-red-500">*</span></Label>
                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sectionList.map((sec: any) => (
                                        <SelectItem key={sec.asmS_Id} value={sec.asmS_Id.toString()}>
                                            {sec.asmC_SectionName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Recipient Selection */}
                <div className="space-y-2">
                    <Label className="text-lg font-semibold">
                        {isStudent ? 'Select Recipient' : (
                            userFlag === 'Student' ? (isGroup ? 'Select Students (Group)' : 'Select Student') : `Select ${userFlag}`
                        )} <span className="text-red-500">*</span>
                    </Label>

                    {/* If Logic: 
                        1. Staff -> Student -> Group: Show Checkbox List 
                        2. Staff -> Student -> Individual: Show Dropdown 
                        3. Everyone Else: Show Dropdown from 'recipients' list 
                    */}

                    {!isStudent && userFlag === 'Student' && isGroup ? (
                        // Multi-select for Group (Staff -> Student)
                        <div className="border rounded-md p-2 h-48 overflow-y-auto bg-white">
                            {studentList.length > 0 ? (
                                studentList.map((student: any) => (
                                    <div key={student.amsT_Id} className="flex items-center space-x-2 mb-2 p-1 hover:bg-slate-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={`st-${student.amsT_Id}`}
                                            checked={selectedRecipients.includes(student.amsT_Id.toString())}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRecipients([...selectedRecipients, student.amsT_Id.toString()]);
                                                } else {
                                                    setSelectedRecipients(selectedRecipients.filter(id => id !== student.amsT_Id.toString()));
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor={`st-${student.amsT_Id}`} className="text-sm cursor-pointer flex-1">
                                            {student.studentName} <span className="text-xs text-muted-foreground">({student.amsT_AdmNo || ''})</span>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground text-sm py-10 flex flex-col items-center">
                                    <span className="mb-2">No students found.</span>
                                    {(!selectedClass || !selectedSection) && <span className="text-xs">Please select Class & Section first.</span>}
                                </div>
                            )}
                        </div>
                    ) : (isStudent || userFlag !== 'Student' || (!isGroup && !isStudent)) ? (
                        // Dropdown for Individual (Student or Staff->User)
                        <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${userFlag}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {(!isStudent && userFlag === 'Student') ? (
                                    // Staff -> Student Individual List
                                    studentList.map((student: any) => (
                                        <SelectItem key={student.amsT_Id} value={student.amsT_Id.toString()}>
                                            {student.studentName}
                                        </SelectItem>
                                    ))
                                ) : (
                                    // Generic Recipients List
                                    recipients.map((rec: any) => (
                                        <SelectItem key={rec.HRME_Id || rec.hrMe_Id} value={(rec.HRME_Id || rec.hrMe_Id).toString()}>
                                            {rec.EmpName || rec.empName}
                                            {rec.ISMS_SubjectName ? ` - ${rec.ISMS_SubjectName}` : ''}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    ) : null}
                </div>

                <div className="space-y-2">
                    <Label className="font-bold">Subject <span className="text-red-500">*</span></Label>
                    <Input
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="font-bold">Message <span className="text-red-500">*</span></Label>
                    <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px] bg-white resize-y"
                    />
                </div>

                <div className="flex justify-center md:justify-end gap-3 pt-4 border-t">
                    <Button variant="destructive" onClick={onSuccess}>
                        <i className="fa fa-times mr-2" /> Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={isSending} className="min-w-[120px]">
                        {isSending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                        Send
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
