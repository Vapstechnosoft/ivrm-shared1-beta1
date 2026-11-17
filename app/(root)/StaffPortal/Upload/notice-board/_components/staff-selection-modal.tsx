'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck } from 'lucide-react';

interface Department {
  HRMDC_ID: number;
  HRMDC_Name: string;
  selected?: boolean;
}

interface Designation {
  HRMDES_Id: number;
  HRMDES_DesignationName: string;
  selected?: boolean;
}

interface Employee {
  HRME_Id: number;
  userEmpName: string;
  HRMD_DepartmentName: string;
  empck?: boolean;
}

interface StaffSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  designations: Designation[];
  employees: Employee[];
  selectedDepartments: number[];
  selectedDesignations: number[];
  selectedEmployees: number[];
  onDepartmentsChange: (departments: number[]) => void;
  onDesignationsChange: (designations: number[]) => void;
  onEmployeesChange: (employees: number[]) => void;
}

export function StaffSelectionModal({
  isOpen,
  onClose,
  departments,
  designations,
  employees,
  selectedDepartments,
  selectedDesignations,
  selectedEmployees,
  onDepartmentsChange,
  onDesignationsChange,
  onEmployeesChange
}: StaffSelectionModalProps) {
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [designationSearchTerm, setDesignationSearchTerm] = useState('');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  const filteredDepartments = departments.filter(dept =>
    dept.HRMDC_Name.toLowerCase().includes(departmentSearchTerm.toLowerCase())
  );

  const filteredDesignations = designations.filter(desg =>
    desg.HRMDES_DesignationName.toLowerCase().includes(designationSearchTerm.toLowerCase())
  );

  const filteredEmployees = employees.filter(emp =>
    emp.userEmpName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.HRMD_DepartmentName.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const toggleAllDepartments = (checked: boolean) => {
    const newSelected = checked ? departments.map(dept => dept.HRMDC_ID) : [];
    onDepartmentsChange(newSelected);
  };

  const toggleDepartment = (departmentId: number, checked: boolean) => {
    if (checked) {
      onDepartmentsChange([...selectedDepartments, departmentId]);
    } else {
      onDepartmentsChange(selectedDepartments.filter(id => id !== departmentId));
    }
  };

  const toggleAllDesignations = (checked: boolean) => {
    const newSelected = checked ? designations.map(desg => desg.HRMDES_Id) : [];
    onDesignationsChange(newSelected);
  };

  const toggleDesignation = (designationId: number, checked: boolean) => {
    if (checked) {
      onDesignationsChange([...selectedDesignations, designationId]);
    } else {
      onDesignationsChange(selectedDesignations.filter(id => id !== designationId));
    }
  };

  const toggleAllEmployees = (checked: boolean) => {
    const newSelected = checked ? employees.map(emp => emp.HRME_Id) : [];
    onEmployeesChange(newSelected);
  };

  const toggleEmployee = (employeeId: number, checked: boolean) => {
    if (checked) {
      onEmployeesChange([...selectedEmployees, employeeId]);
    } else {
      onEmployeesChange(selectedEmployees.filter(id => id !== employeeId));
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
          <DialogTitle>Staff Selection</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Selection Summary */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Badge variant="secondary">
              Departments: {selectedDepartments.length}
            </Badge>
            <Badge variant="secondary">
              Designations: {selectedDesignations.length}
            </Badge>
            <Badge variant="secondary">
              Employees: {selectedEmployees.length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Departments Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <Label className="font-medium">Department</Label>
              </div>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  <Input
                    placeholder="Search departments..."
                    value={departmentSearchTerm}
                    onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="selectAllDepartments"
                      checked={selectedDepartments.length === departments.length && departments.length > 0}
                      onCheckedChange={toggleAllDepartments}
                    />
                    <Label htmlFor="selectAllDepartments" className="font-medium">All Departments</Label>
                  </div>
                  {filteredDepartments.map((dept) => (
                    <div key={dept.HRMDC_ID} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        id={`dept-${dept.HRMDC_ID}`}
                        checked={selectedDepartments.includes(dept.HRMDC_ID)}
                        onCheckedChange={(checked) => toggleDepartment(dept.HRMDC_ID, checked as boolean)}
                      />
                      <Label htmlFor={`dept-${dept.HRMDC_ID}`} className="flex-1">
                        {dept.HRMDC_Name} Department
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Designations Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <Label className="font-medium">Designation</Label>
              </div>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  <Input
                    placeholder="Search designations..."
                    value={designationSearchTerm}
                    onChange={(e) => setDesignationSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="selectAllDesignations"
                      checked={selectedDesignations.length === designations.length && designations.length > 0}
                      onCheckedChange={toggleAllDesignations}
                    />
                    <Label htmlFor="selectAllDesignations" className="font-medium">All Designations</Label>
                  </div>
                  {filteredDesignations.map((desg) => (
                    <div key={desg.HRMDES_Id} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        id={`desg-${desg.HRMDES_Id}`}
                        checked={selectedDesignations.includes(desg.HRMDES_Id)}
                        onCheckedChange={(checked) => toggleDesignation(desg.HRMDES_Id, checked as boolean)}
                      />
                      <Label htmlFor={`desg-${desg.HRMDES_Id}`} className="flex-1">
                        {desg.HRMDES_DesignationName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Employees Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <Label className="font-medium">Employee</Label>
              </div>
              <div className="border rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  <Input
                    placeholder="Search employees..."
                    value={employeeSearchTerm}
                    onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="selectAllEmployees"
                      checked={selectedEmployees.length === employees.length && employees.length > 0}
                      onCheckedChange={toggleAllEmployees}
                    />
                    <Label htmlFor="selectAllEmployees" className="font-medium">All Employees</Label>
                  </div>
                  {filteredEmployees.map((emp) => (
                    <div key={emp.HRME_Id} className="flex items-center space-x-2 p-2">
                      <Checkbox
                        id={`emp-${emp.HRME_Id}`}
                        checked={selectedEmployees.includes(emp.HRME_Id)}
                        onCheckedChange={(checked) => toggleEmployee(emp.HRME_Id, checked as boolean)}
                      />
                      <Label htmlFor={`emp-${emp.HRME_Id}`} className="flex-1">
                        <div>
                          <div className="font-medium">{emp.userEmpName}</div>
                          <div className="text-sm text-gray-500">{emp.HRMD_DepartmentName}</div>
                        </div>
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
