'use client';

import { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEventsStudentMapping } from '@/hooks/sports/useEventsStudentMapping';
import { eventsStudentMappingSchema, EventsStudentMappingFormSchema, IStudentValues } from '@/types/sports/events-student-mapping';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentEntryGrid } from './student-entry-grid';
import { MultiSelect } from '@/components/ui/multi-select'; // Assuming this exists or we use standard select for now
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface AddMappingFormProps {
    onSuccess: () => void;
}

export default function EventsStudentMappingForm({ onSuccess }: AddMappingFormProps) {
    const { dropdowns, fetchStudents, saveData } = useEventsStudentMapping();
    const dropdownData = dropdowns.data;

    // Local state for the "Add" process
    const [fetchedStudents, setFetchedStudents] = useState<IStudentValues[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [entryGridStudents, setEntryGridStudents] = useState<IStudentValues[]>([]);
    const [studentSearch, setStudentSearch] = useState('');

    const form = useForm<EventsStudentMappingFormSchema>({
        resolver: zodResolver(eventsStudentMappingSchema),
        defaultValues: {
            spccmsccG_SCCFlag: 'Sports',
            spccesT_House_Class_Flag: 'CC',
            selectedHouses: [],
            selectedClasses: [],
            selectedSections: [],
        }
    });

    const { watch, setValue } = form;
    const watchFlag = watch('spccesT_House_Class_Flag');

    // Handlers
    const handleFetchStudents = () => {
        const formData = form.getValues();
        fetchStudents.mutate({
            ASMAY_Id: formData.asmaY_Id,
            SPCCMSCCG_SCCFlag: formData.spccmsccG_SCCFlag,
            SPCCEST_House_Class_Flag: formData.spccesT_House_Class_Flag,
            SPCCMCC_Id: formData.spccmcC_Id,
            SPCCMH_Id: formData.selectedHouses,
            ASMCL_Id: formData.selectedClasses,
            ASMS_Id: formData.selectedSections
        }, {
            onSuccess: (res) => {
                if (res.success && res.data) {
                    setFetchedStudents(res.data);
                    setSelectedStudentIds([]); // Reset selection on new fetch
                }
            }
        });
    };

    const handleAddToGrid = () => {
        if (selectedStudentIds.length === 0) {
            toast.warning('Please select at least one student');
            return;
        }

        const newStudents = fetchedStudents.filter(s => selectedStudentIds.includes(s.amsT_Id));

        // Avoid duplicates
        const existingIds = new Set(entryGridStudents.map(s => s.amsT_Id));
        const uniqueNewStudents = newStudents.filter(s => !existingIds.has(s.amsT_Id));

        if (uniqueNewStudents.length === 0) {
            toast.info('Selected students are already added');
            return;
        }

        setEntryGridStudents(prev => [...prev, ...uniqueNewStudents]);
        toast.success(`Added ${uniqueNewStudents.length} students`);
    };

    // Grid student updates
    const updateGridStudent = (id: number, field: keyof IStudentValues, value: any) => {
        setEntryGridStudents(prev => prev.map(s =>
            s.amsT_Id === id ? { ...s, [field]: value } : s
        ));
    };

    const removeGridStudent = (id: number) => {
        setEntryGridStudents(prev => prev.filter(s => s.amsT_Id !== id));
    };

    const toggleGridStudentSelect = (id: number, checked: boolean) => {
        setEntryGridStudents(prev => prev.map(s =>
            s.amsT_Id === id ? { ...s, selected: checked } : s
        ));
    }

    // Filtered student list for the selection area
    const filteredFetchedStudents = useMemo(() => {
        if (!studentSearch) return fetchedStudents;
        return fetchedStudents.filter(s =>
            s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
            s.amsT_AdmNo.toLowerCase().includes(studentSearch.toLowerCase())
        );
    }, [fetchedStudents, studentSearch]);


    const onSubmit = (data: EventsStudentMappingFormSchema) => {
        const selectedForSave = entryGridStudents.filter(s => s.selected);
        if (selectedForSave.length === 0) {
            toast.error('Please select at least one student from the grid to save');
            return;
        }

        const payload = {
            ...data,
            students: selectedForSave
        };

        saveData.mutate(payload, {
            onSuccess: () => {
                onSuccess();
            }
        });
    };

    if (dropdowns.isLoading) return <div>Loading form data...</div>;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">

                {/* 1. Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="spccmsccG_SCCFlag"
                        render={({ field }) => (
                            <FormItem className="border p-4 rounded-md text-center">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex justify-center space-x-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Sports" id="r1" />
                                            <Label htmlFor="r1">Sports Activities</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Co-Curricular" id="r2" />
                                            <Label htmlFor="r2">Co-Curricular Activities</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="spccesT_House_Class_Flag"
                        render={({ field }) => (
                            <FormItem className="border p-4 rounded-md text-center">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setFetchedStudents([]); // Clear list on mode change
                                            setSelectedStudentIds([]);
                                        }}
                                        defaultValue={field.value}
                                        className="flex justify-center space-x-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="CC" id="rf1" />
                                            <Label htmlFor="rf1">Competition Category</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="House" id="rf2" />
                                            <Label htmlFor="rf2">House</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="CS" id="rf3" />
                                            <Label htmlFor="rf3">Class</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* 2. Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="asmaY_Id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Academic Year <span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dropdownData?.academicYear.map(item => (
                                            <SelectItem key={item.asmaY_Id} value={String(item.asmaY_Id)}>
                                                {item.asmaY_Year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Conditional Fields based on Flag */}
                    {watchFlag === 'CC' && (
                        <FormField
                            control={form.control}
                            name="spccmcC_Id" // Category
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Competition Category <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={String(field.value)}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {dropdownData?.categoryList.map(item => (
                                                <SelectItem key={item.spccmcC_Id} value={String(item.spccmcC_Id)}>{item.spccmcC_CompitionCategory}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* MultiSelects would go here using a proper MultiSelect component. 
                        For now, simulating simpler selects or using the simulated logic. 
                        In a real app, use the `components/ui/multi-select` if available.
                    */}
                </div>

                <div className="flex justify-end">
                    <Button type="button" onClick={handleFetchStudents} disabled={fetchStudents.isPending}>
                        {fetchStudents.isPending ? 'Fetching...' : 'Get Student List'}
                    </Button>
                </div>

                {/* 3. Student Selection Area */}
                <div className="grid grid-cols-1 gap-4 border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-lg font-semibold">Select Students</Label>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-8" value={studentSearch} onChange={e => setStudentSearch(e.target.value)} />
                        </div>
                    </div>

                    <ScrollArea className="h-[200px] border rounded-md p-2">
                        {fetchedStudents.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">No students found. Use filters to fetch.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                <div className="col-span-full pb-2 border-b mb-2 flex items-center space-x-2">
                                    <Checkbox
                                        id="select-all-source"
                                        checked={fetchedStudents.length > 0 && selectedStudentIds.length === fetchedStudents.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedStudentIds(fetchedStudents.map(s => s.amsT_Id));
                                            else setSelectedStudentIds([]);
                                        }}
                                    />
                                    <Label htmlFor="select-all-source">Select All</Label>
                                </div>
                                {filteredFetchedStudents.map(student => (
                                    <div key={student.amsT_Id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`student-${student.amsT_Id}`}
                                            checked={selectedStudentIds.includes(student.amsT_Id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) setSelectedStudentIds(prev => [...prev, student.amsT_Id]);
                                                else setSelectedStudentIds(prev => prev.filter(id => id !== student.amsT_Id));
                                            }}
                                        />
                                        <Label htmlFor={`student-${student.amsT_Id}`} className="text-sm font-normal cursor-pointer">
                                            {student.studentName} ({student.amsT_AdmNo})
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <div className="flex justify-center mt-2">
                        <Button type="button" variant="secondary" onClick={handleAddToGrid}>
                            Add Selected to List <i className="fa fa-arrow-down ml-2"></i>
                        </Button>
                    </div>
                </div>

                {/* 4. Entry Grid */}
                {entryGridStudents.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <Label className="text-lg font-semibold">Student Entry Details</Label>
                        </div>

                        <StudentEntryGrid
                            students={entryGridStudents}
                            onUpdateStudent={updateGridStudent}
                            onRemoveStudent={removeGridStudent}
                            onToggleSelect={toggleGridStudentSelect}
                            onToggleSelectAll={(checked) => setEntryGridStudents(prev => prev.map(s => ({ ...s, selected: checked })))}
                            globalSelectState={entryGridStudents.length > 0 && entryGridStudents.every(s => s.selected)}
                        />

                        {/* 5. Common Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border p-4 rounded-md">

                            <FormField
                                control={form.control}
                                name="spccmcL_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Competition Level <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dropdownData?.competitionLevelList.map(item => (
                                                    <SelectItem key={item.spccmcL_Id} value={String(item.spccmcL_Id)}>{item.spccmcL_CompitionLevel}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="spccmE_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Name <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select Event" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dropdownData?.eventsList.map(item => (
                                                    <SelectItem key={item.spccmE_Id} value={String(item.spccmE_Id)}>{item.spccmE_EventName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="spccmsccG_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select Group" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dropdownData?.groupList.map(item => (
                                                    <SelectItem key={item.spccmsccG_Id} value={String(item.spccmsccG_Id)}>{item.spccmsccG_SportsCCGroupName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="spccmscC_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sports Name <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select Sports" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dropdownData?.sportsList.map(item => (
                                                    <SelectItem key={item.spccmscC_Id} value={String(item.spccmscC_Id)}>{item.spccmscC_SportsCCName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="spccmuoM_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>UOM <span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select UOM" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dropdownData?.uomList.map(item => (
                                                    <SelectItem key={item.spccmuoM_Id} value={String(item.spccmuoM_Id)}>{item.spccmuoM_UOMName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="spccesT_Remarks"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Remarks</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Enter Remarks..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="spccesT_OldRecord"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Record</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter New Record..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* 6. Action Buttons */}
                        <div className="flex justify-center space-x-4 mt-8">
                            <Button type="submit" disabled={saveData.isPending}>
                                {saveData.isPending ? 'Saving...' : 'Save'}
                            </Button>
                            <Button type="button" variant="destructive" onClick={onSuccess}>Cancel</Button>
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}
