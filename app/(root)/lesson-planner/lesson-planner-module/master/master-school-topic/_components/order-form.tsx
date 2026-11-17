'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getClassesByYear, getSubjectsByClass, getTopicsForOrder, saveTopicOrder } from '@/server/lesson-planner/master/school-topic';
import type { IMasterClass, IMasterSchoolTopic, IMasterSubject, IMasterYear } from '@/types/lesson-planner/master/school-topic';
import { DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OrderMasterSchoolTopicFormProps {
    isOpen: boolean;
    onClose: () => void;
    masterYear: IMasterYear[];
    onSuccess: () => void;
}

function SortableRow({ topic, index }: { topic: IMasterSchoolTopic; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: topic.lpmmT_Id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <tr ref={setNodeRef} style={style} className='border-b transition-colors hover:bg-muted/30'>
            <td className='p-2 text-left'>{index + 1}</td>
            <td className='p-2 text-left font-medium'>{topic.lpmmT_TopicName}</td>
            <td className='p-2 text-left'>{topic.lpmmT_TopicDescription || '-'}</td>
            <td className='p-2 text-center'>{topic.lpmmT_Order || index + 1}</td>
            <td className='p-2 text-center'>
                <button type='button' {...attributes} {...listeners} className='cursor-grab active:cursor-grabbing'>
                    <GripVertical className='h-5 w-5 text-muted-foreground' />
                </button>
            </td>
        </tr>
    );
}

export default function OrderMasterSchoolTopicForm({ isOpen, onClose, masterYear, onSuccess }: OrderMasterSchoolTopicFormProps) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [classes, setClasses] = useState<IMasterClass[]>([]);
    const [subjects, setSubjects] = useState<IMasterSubject[]>([]);
    const [topics, setTopics] = useState<IMasterSchoolTopic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    // Fetch classes when year changes
    useEffect(() => {
        if (selectedYear) {
            const fetchClasses = async () => {
                const res: any = await getClassesByYear(Number(selectedYear));
                setClasses((res?.data || []) as IMasterClass[]);
            };
            fetchClasses();
        } else {
            setClasses([]);
            setSelectedClass('');
        }
    }, [selectedYear]);

    // Fetch subjects when class changes
    useEffect(() => {
        if (selectedYear && selectedClass) {
            const fetchSubjects = async () => {
                const res: any = await getSubjectsByClass(Number(selectedYear), Number(selectedClass));
                setSubjects((res?.data || []) as IMasterSubject[]);
            };
            fetchSubjects();
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedYear, selectedClass]);

    // Fetch topics when subject changes
    useEffect(() => {
        if (selectedYear && selectedClass && selectedSubject) {
            const fetchTopics = async () => {
                setIsLoading(true);
                try {
                    const res: any = await getTopicsForOrder({
                        ISMS_Id: Number(selectedSubject),
                        ASMAY_Id: Number(selectedYear),
                        ASMCL_Id: Number(selectedClass)
                    });
                    setTopics((res?.data?.getsubjecttopicdetails || res?.data || []) as IMasterSchoolTopic[]);
                } catch (error) {
                    toast.error('Failed to fetch topics');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTopics();
        } else {
            setTopics([]);
        }
    }, [selectedYear, selectedClass, selectedSubject]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTopics((items) => {
                const oldIndex = items.findIndex((item) => item.lpmmT_Id === active.id);
                const newIndex = items.findIndex((item) => item.lpmmT_Id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                // Update order numbers
                return newItems.map((item, index) => ({ ...item, lpmmT_Order: index + 1 }));
            });
        }
    };

    const handleSaveOrder = async () => {
        if (topics.length === 0) return;
        setIsSaving(true);
        try {
            const orderArray = topics.map((topic) => ({
                lpmmT_Id: topic.lpmmT_Id
            }));

            const res: any = await saveTopicOrder(orderArray);
            if (res?.success || res?.returnval || res?.data?.returnval) {
                toast.success('Order updated successfully');
                onSuccess();
                onClose();
            } else {
                toast.error('Failed to update order');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='flex max-h-[80vh] max-w-4xl flex-col'>
                <DialogHeader>
                    <DialogTitle>Set Topic Order</DialogTitle>
                </DialogHeader>

                <div className='mb-4 grid grid-cols-3 gap-4'>
                    {/* Academic Year */}
                    <div className='space-y-2'>
                        <label className='font-medium text-sm'>
                            Academic Year <span className='text-red-500'>*</span>
                        </label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Year' />
                            </SelectTrigger>
                            <SelectContent>
                                {masterYear.map((year) => (
                                    <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                        {year.asmaY_Year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Class */}
                    <div className='space-y-2'>
                        <label className='font-medium text-sm'>
                            Class <span className='text-red-500'>*</span>
                        </label>
                        <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!selectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Class' />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.asmcL_Id} value={cls.asmcL_Id.toString()}>
                                        {cls.asmcL_ClassName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subject */}
                    <div className='space-y-2'>
                        <label className='font-medium text-sm'>
                            Subject Name <span className='text-red-500'>*</span>
                        </label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select Subject' />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map((subj) => (
                                    <SelectItem key={subj.ismS_Id} value={subj.ismS_Id.toString()}>
                                        {subj.ismS_SubjectName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className='flex-1 overflow-auto rounded-lg border'>
                    {isLoading ? (
                        <div className='flex justify-center p-8'>Loading topics...</div>
                    ) : topics.length === 0 ? (
                        <div className='flex justify-center p-8 text-muted-foreground'>
                            No topics found. Select year, class and subject.
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <table className='w-full border-collapse text-sm'>
                                <thead className='sticky top-0 bg-muted/50'>
                                    <tr>
                                        <th className='border-b p-2 text-left font-medium'>SLNO</th>
                                        <th className='border-b p-2 text-left font-medium'>Topic Name</th>
                                        <th className='border-b p-2 text-left font-medium'>Topic Description</th>
                                        <th className='border-b p-2 text-center font-medium'>Topic Order</th>
                                        <th className='border-b p-2 text-center font-medium'>Drag</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <SortableContext items={topics.map((t) => t.lpmmT_Id)} strategy={verticalListSortingStrategy}>
                                        {topics.map((topic, index) => (
                                            <SortableRow key={topic.lpmmT_Id} topic={topic} index={index} />
                                        ))}
                                    </SortableContext>
                                </tbody>
                            </table>
                        </DndContext>
                    )}
                </div>

                <div className='flex justify-end gap-3 pt-4'>
                    <Button type='button' variant='outline' onClick={onClose} disabled={isSaving}>
                        Close
                    </Button>
                    <Button type='button' onClick={handleSaveOrder} disabled={isSaving || topics.length === 0} isLoading={isSaving}>
                        <Save className='mr-2 h-4 w-4' /> Save Order
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
