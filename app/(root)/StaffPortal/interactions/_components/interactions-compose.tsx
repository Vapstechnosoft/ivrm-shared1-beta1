
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Send,
    X,
    Eye,
    Upload,
    User,
    Users,
    GraduationCap,
    Clock,
    FileText,
    AlertCircle,
    Search,
    MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type {
    IInteractionsInitialData,
    IRecipient,
    ISaveInteractionRequest
} from '@/types/staff-portal/interactions';

interface ComposeProps {
    initialData?: IInteractionsInitialData;
    mode: 'Group' | 'Individual';
    onSend: (data: ISaveInteractionRequest) => void;
    onCancel: () => void;
    getRecipients: (role: string) => Promise<any[]>;
    getSections: (clsId: number) => Promise<any[]>;
    getStudents: (clsId: number, secId: number) => Promise<any[]>;
}

export default function InteractionsCompose({
    initialData,
    mode,
    onSend,
    onCancel,
    getRecipients,
    getSections,
    getStudents
}: ComposeProps) {
    const [userFlag, setUserFlag] = useState<string>("");
    const [recipients, setRecipients] = useState<IRecipient[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSection, setSelectedSection] = useState<string>("");
    const [selectedRecipientId, setSelectedRecipientId] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [recipientsSearch, setRecipientsSearch] = useState("");
    const [allChecked, setAllChecked] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const config = initialData?.configflag?.[0];
    const role = initialData?.roletype?.[0]?.ivrmrT_Role;

    const showStudentRadio = role === 'Student' ? false : config?.ivrmgC_EnableCTSTIntFlg || config?.ivrmgC_EnableStaffwiseIntFlg; // Simplified
    const showTeachersRadio = role === 'Student' ? false : config?.ivrmgC_EnableStaffwiseIntFlg;

    useEffect(() => {
        setUserFlag("");
        setRecipients([]);
        setClasses([]);
        setSections([]);
    }, [mode]);

    const handleRoleChange = async (val: string) => {
        setUserFlag(val);
        setSelectedClass("");
        setSelectedSection("");
        setSelectedRecipientId("");
        setRecipients([]);

        if (val === 'Principal' || val === 'HOD' || val === 'AS' || val === 'EC') {
            const res = await getRecipients(val);
            if (res && res.length > 0) {
                setRecipients(res.map(r => ({ ...r, tck: false, stuck: false })));
            }
        } else if (val === 'Student') {
            const res = await getRecipients(val);
            setClasses(res || []);
        } else if (val === 'Teachers') {
            const res = await getRecipients(val);
            setRecipients(res || []);
        } else if (val === 'SubjectTeacher' || val === 'ClassTeacher') {
            const res = await getRecipients(val);
            setRecipients(res || []);
        }
    };

    const handleClassChange = async (val: string) => {
        setSelectedClass(val);
        setSelectedSection("");
        setRecipients([]);
        const res = await getSections(Number(val));
        setSections(res || []);
    };

    const handleSectionChange = async (val: string) => {
        setSelectedSection(val);
        const res = await getStudents(Number(selectedClass), Number(val));
        setRecipients(res || []);
    };

    const toggleAllRecipients = (checked: boolean) => {
        setAllChecked(checked);
        setRecipients(prev => prev.map(r => ({ ...r, tck: checked, stuck: checked })));
    };

    const toggleRecipient = (id: number, type: 'tck' | 'stuck', checked: boolean) => {
        setRecipients(prev => prev.map(r => {
            const rId = r.HRME_Id || r.AMST_Id;
            if (rId === id) return { ...r, [type]: checked };
            return r;
        }));
    };

    const handleSend = () => {
        if (!subject || !message) {
            toast.error("Subject and Message are required");
            return;
        }

        const data: ISaveInteractionRequest = {
            roleflg: role || 'Staff',
            userflag: userFlag,
            ISMINT_ComposedByFlg: role || 'Staff',
            ISMINT_GroupOrIndFlg: mode,
            ISMINT_Subject: subject,
            ISMINT_Interaction: message,
            images_paths: []
        };

        if (mode === 'Individual') {
            if (userFlag === 'Student') {
                data.student_Id = Number(selectedRecipientId);
            } else if (userFlag === 'Teachers' || userFlag === 'SubjectTeacher' || userFlag === 'ClassTeacher') {
                data.employee_Id = Number(selectedRecipientId);
            } else {
                data.ISTINT_ToId = recipients[0]?.HRME_Id; // For Principal/HOD auto-selected
            }
        } else {
            if (userFlag === 'Student') {
                data.arrayStudent = recipients.filter(r => r.stuck);
                if (data.arrayStudent.length === 0) return toast.error("Select at least one student");
            } else {
                data.arrayTeachers = recipients.filter(r => r.tck);
                if (data.arrayTeachers.length === 0) return toast.error("Select at least one teacher");
            }
        }

        setIsSending(true);
        onSend(data);
    };

    const filteredRecipients = recipients.filter(r =>
        (r.studentName || r.EmpName || "").toLowerCase().includes(recipientsSearch.toLowerCase())
    );

    return (
        <Card className="shadow-xl border-primary/10 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            {mode === 'Group' ? <Users className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-primary">Compose Message</CardTitle>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">{mode} Interaction</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="h-7 gap-2 bg-background border-primary/20 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(), 'dd/MM/yyyy hh:mm a')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                    {/* Left Panel: Recipients Config */}
                    <div className="lg:col-span-5 p-6 border-r border-primary/5 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase text-muted-foreground mb-3 block">Recipients Role</Label>
                            <div className="bg-muted/30 p-4 rounded-xl border border-primary/5">
                                <RadioGroup value={userFlag} onValueChange={handleRoleChange} className="grid grid-cols-1 gap-3">
                                    {role === 'Student' ? (
                                        <>
                                            {config?.ivrmgC_EnableSTSUBTIntFlg && (
                                                <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border hover:border-primary/30 transition-all">
                                                    <RadioGroupItem value="SubjectTeacher" id="role-st" />
                                                    <Label htmlFor="role-st" className="cursor-pointer text-sm font-medium flex-1">Subject Teacher</Label>
                                                </div>
                                            )}
                                            {config?.ivrmgC_EnableSTCTIntFlg && (
                                                <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border hover:border-primary/30 transition-all">
                                                    <RadioGroupItem value="ClassTeacher" id="role-ct" />
                                                    <Label htmlFor="role-ct" className="cursor-pointer text-sm font-medium flex-1">Class Teacher</Label>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border hover:border-primary/30 transition-all">
                                                <RadioGroupItem value="Student" id="role-student" />
                                                <Label htmlFor="role-student" className="cursor-pointer text-sm font-medium flex-1">Student</Label>
                                                <GraduationCap className="h-4 w-4 text-blue-500 mr-2" />
                                            </div>
                                            <div className="flex items-center space-x-2 bg-background p-3 rounded-lg border hover:border-primary/30 transition-all">
                                                <RadioGroupItem value="Teachers" id="role-teachers" />
                                                <Label htmlFor="role-teachers" className="cursor-pointer text-sm font-medium flex-1">Teachers</Label>
                                                <Users className="h-4 w-4 text-orange-500 mr-2" />
                                            </div>
                                            {mode === 'Individual' && (
                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    <div className="flex items-center space-x-2 bg-background/50 p-2 rounded-lg border text-xs">
                                                        <RadioGroupItem value="Principal" id="role-principal" />
                                                        <Label htmlFor="role-principal" className="cursor-pointer font-medium">Principal</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2 bg-background/50 p-2 rounded-lg border text-xs">
                                                        <RadioGroupItem value="HOD" id="role-hod" />
                                                        <Label htmlFor="role-hod" className="cursor-pointer font-medium">HOD</Label>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </RadioGroup>
                            </div>
                        </div>

                        {userFlag === 'Student' && (
                            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Class</Label>
                                    <Select value={selectedClass} onValueChange={handleClassChange}>
                                        <SelectTrigger className="h-10 text-xs">
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => <SelectItem key={c.ASMCL_Id} value={c.ASMCL_Id.toString()}>{c.ASMCL_ClassName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground">Section</Label>
                                    <Select value={selectedSection} onValueChange={handleSectionChange} disabled={!selectedClass}>
                                        <SelectTrigger className="h-10 text-xs">
                                            <SelectValue placeholder="Select Section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections.map(s => <SelectItem key={s.asmS_Id} value={s.asmS_Id.toString()}>{s.asmC_SectionName}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {userFlag && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-muted-foreground">{userFlag === 'Student' ? 'Student List' : 'Recipient List'}</Label>
                                    {mode === 'Group' && (
                                        <div className="flex items-center gap-2 pr-1">
                                            <Checkbox id="all-rec" checked={allChecked} onCheckedChange={toggleAllRecipients} />
                                            <Label htmlFor="all-rec" className="text-[10px] font-bold uppercase cursor-pointer">All</Label>
                                        </div>
                                    )}
                                </div>
                                {mode === 'Individual' ? (
                                    <div className="space-y-2">
                                        {(userFlag === 'Principal' || userFlag === 'HOD') ? (
                                            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3">
                                                <User className="h-5 w-5 text-primary" />
                                                <div className="text-sm font-bold text-primary">{recipients[0]?.EmpName || "Loading..."}</div>
                                            </div>
                                        ) : (
                                            <Select value={selectedRecipientId} onValueChange={setSelectedRecipientId}>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder={`Search ${userFlag}...`} />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    {recipients.map(r => (
                                                        <SelectItem key={r.HRME_Id || r.AMST_Id} value={(r.HRME_Id || r.AMST_Id || "").toString()}>
                                                            {r.EmpName || r.studentName} {r.AMST_AdmNo ? `: ${r.AMST_AdmNo}` : ""}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                                            <Input
                                                className="pl-9 h-9 text-xs mb-2"
                                                placeholder="Filter list..."
                                                value={recipientsSearch}
                                                onChange={(e) => setRecipientsSearch(e.target.value)}
                                            />
                                        </div>
                                        <ScrollArea className="h-48 border rounded-xl p-2 bg-muted/20">
                                            {filteredRecipients.map(r => {
                                                const id = r.HRME_Id || r.AMST_Id!;
                                                const isChecked = userFlag === 'Student' ? r.stuck : r.tck;
                                                return (
                                                    <div key={id} className="flex items-center space-x-3 p-2 hover:bg-background rounded-lg transition-colors group">
                                                        <Checkbox
                                                            id={`r-${id}`}
                                                            checked={isChecked}
                                                            onCheckedChange={(val) => toggleRecipient(id, userFlag === 'Student' ? 'stuck' : 'tck', !!val)}
                                                        />
                                                        <Label htmlFor={`r-${id}`} className="text-xs cursor-pointer flex-1 group-hover:text-primary truncate">
                                                            {r.EmpName || r.studentName} <span className="text-[10px] text-muted-foreground font-normal ml-1">{(r.AMST_AdmNo || r.HRME_EmployeeCode) ? `(${r.AMST_AdmNo || r.HRME_EmployeeCode})` : ""}</span>
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Message Content */}
                    <div className="lg:col-span-7 p-8 space-y-8 bg-muted/5">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary/50" /> Subject <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    placeholder="Enter interaction subject here..."
                                    className="h-12 text-base border-primary/10 shadow-sm focus:border-primary/30 font-medium"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary/50" /> Message <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    placeholder="Write your message here..."
                                    className="min-h-[220px] text-base border-primary/10 shadow-sm focus:border-primary/30 p-5 leading-relaxed"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 border-t border-primary/5">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <input type="file" id="comp-attach" className="hidden" multiple />
                                            <Button variant="outline" size="sm" className="h-10 gap-2 border-primary/20 text-muted-foreground hover:text-primary hover:border-primary/40 group bg-background" asChild>
                                                <label htmlFor="comp-attach" className="cursor-pointer">
                                                    <Upload className="h-4 w-4 group-hover:animate-bounce" /> Browse Attachment
                                                </label>
                                            </Button>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground/60 max-w-[200px] leading-tight flex items-center gap-2">
                                            <AlertCircle className="h-3 w-3 shrink-0" />
                                            Allowed: JPG, PNG, DOC, PDF, EXCEL (Single file supported for message preview)
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="ghost" onClick={onCancel} className="h-11 px-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                            <X className="mr-2 h-4 w-4" /> Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSend}
                                            disabled={!userFlag || !subject || !message || isSending}
                                            className="h-11 px-10 gap-3 bg-primary hover:bg-primary/90 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                        >
                                            <Send className="h-4 w-4" />
                                            {isSending ? "Sending..." : "Send Message"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
