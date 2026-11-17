'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Users } from 'lucide-react';

interface Class {
  asmcL_Id: number;
  asmcL_ClassName: string;
  selected?: boolean;
}

interface Section {
  asmS_Id: number;
  asmcL_ClassName: string;
  ASMC_SectionName: string;
  selected?: boolean;
}

interface Student {
  amsT_Id: number;
  studentname: string;
  AMST_AdmNo: string;
  selected?: boolean;
}

interface StudentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  sections: Section[];
  students: Student[];
  selectedClasses: number[];
  selectedSections: number[];
  selectedStudents: number[];
  onClassesChange: (classes: number[]) => void;
  onSectionsChange: (sections: number[]) => void;
  onStudentsChange: (students: number[]) => void;
}

export function StudentSelectionModal({
  isOpen,
  onClose,
  classes,
  sections,
  students,
  selectedClasses,
  selectedSections,
  selectedStudents,
  onClassesChange,
  onSectionsChange,
  onStudentsChange
}: StudentSelectionModalProps) {
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [sectionSearchTerm, setSectionSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  const filteredClasses = classes.filter(cls =>
    cls.asmcL_ClassName.toLowerCase().includes(classSearchTerm.toLowerCase())
  );

  const filteredSections = sections.filter(sec =>
    sec.asmcL_ClassName.toLowerCase().includes(sectionSearchTerm.toLowerCase()) ||
    sec.ASMC_SectionName.toLowerCase().includes(sectionSearchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(stu =>
    stu.studentname.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    stu.AMST_AdmNo.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const toggleAllClasses = (checked: boolean) => {
    const newSelected = checked ? classes.map(cls => cls.asmcL_Id) : [];
    onClassesChange(newSelected);
  };

  const toggleClass = (classId: number, checked: boolean) => {
    if (checked) {
      onClassesChange([...selectedClasses, classId]);
    } else {
      onClassesChange(selectedClasses.filter(id => id !== classId));
    }
  };

  const toggleAllSections = (checked: boolean) => {
    const newSelected = checked ? sections.map(sec => sec.asmS_Id) : [];
    onSectionsChange(newSelected);
  };

  const toggleSection = (sectionId: number, checked: boolean) => {
    if (checked) {
      onSectionsChange([...selectedSections, sectionId]);
    } else {
      onSectionsChange(selectedSections.filter(id => id !== sectionId));
    }
  };

  const toggleAllStudents = (checked: boolean) => {
    const newSelected = checked ? students.map(stu => stu.amsT_Id) : [];
    onStudentsChange(newSelected);
  };

  const toggleStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      onStudentsChange([...selectedStudents, studentId]);
    } else {
      onStudentsChange(selectedStudents.filter(id => id !== studentId));
    }
  };

  const handleSave = () => {
    // Save selections and close modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Selection</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Selection Summary */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Badge variant="secondary">
              Classes: {selectedClasses.length}
            </Badge>
            <Badge variant="secondary">
              Sections: {selectedSections.length}
            </Badge>
            <Badge variant="secondary">
              Students: {selectedStudents.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Classes Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <Label className="font-medium">Class Name</Label>
              </div>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  <Input
                    placeholder="Search classes..."
                    value={classSearchTerm}
                    onChange={(e) => setClassSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="selectAllClasses"
                      checked={selectedClasses.length === classes.length && classes.length > 0}
                      onCheckedChange={toggleAllClasses}
                    />
                    <Label htmlFor="selectAllClasses" className="font-medium">All</Label>
                  </div>
                  {filteredClasses.map((cls) => (
                    <div key={cls.asmcL_Id} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        id={`class-${cls.asmcL_Id}`}
                        checked={selectedClasses.includes(cls.asmcL_Id)}
                        onCheckedChange={(checked) => toggleClass(cls.asmcL_Id, checked as boolean)}
                      />
                      <Label htmlFor={`class-${cls.asmcL_Id}`} className="flex-1">
                        {cls.asmcL_ClassName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <Label className="font-medium">Section Name</Label>
              </div>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  <Input
                    placeholder="Search sections..."
                    value={sectionSearchTerm}
                    onChange={(e) => setSectionSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="selectAllSections"
                      checked={selectedSections.length === sections.length && sections.length > 0}
                      onCheckedChange={toggleAllSections}
                    />
                    <Label htmlFor="selectAllSections" className="font-medium">All</Label>
                  </div>
                  {filteredSections.map((sec) => (
                    <div key={sec.asmS_Id} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        id={`section-${sec.asmS_Id}`}
                        checked={selectedSections.includes(sec.asmS_Id)}
                        onCheckedChange={(checked) => toggleSection(sec.asmS_Id, checked as boolean)}
                      />
                      <Label htmlFor={`section-${sec.asmS_Id}`} className="flex-1">
                        {sec.asmcL_ClassName} - {sec.ASMC_SectionName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Students Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <Label className="font-medium">Student Name</Label>
              </div>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  <Input
                    placeholder="Search students..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="selectAllStudents"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onCheckedChange={toggleAllStudents}
                    />
                    <Label htmlFor="selectAllStudents" className="font-medium">All</Label>
                  </div>
                  {filteredStudents.map((stu) => (
                    <div key={stu.amsT_Id} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        id={`student-${stu.amsT_Id}`}
                        checked={selectedStudents.includes(stu.amsT_Id)}
                        onCheckedChange={(checked) => toggleStudent(stu.amsT_Id, checked as boolean)}
                      />
                      <Label htmlFor={`student-${stu.amsT_Id}`} className="flex-1">
                        {stu.studentname} - {stu.AMST_AdmNo}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
