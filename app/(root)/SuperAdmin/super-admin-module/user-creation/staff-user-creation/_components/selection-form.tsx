'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import type { RoleTypeDTO, TrustDTO, InstitutionDTO, StaffDTO } from '@/types/super-admin/user-creation/staff-user-creation';

interface SelectionFormProps {
    roleTypes: RoleTypeDTO[];
    trusts: TrustDTO[];
    institutions: InstitutionDTO[];
    staffList: StaffDTO[];
    onStaffCheckboxChange?: (id: number, checked: boolean) => void;
    onSelectAllStaff?: () => void;
    onViewUsernames?: () => void;
    showViewUsernames?: boolean;
    onInstitutionCheckboxChange?: (id: number, checked: boolean) => void;
    onSelectAllInstitutions?: () => void;
}

export default function SelectionForm({
    roleTypes,
    trusts,
    institutions,
    staffList,
    onStaffCheckboxChange,
    onSelectAllStaff,
    onViewUsernames,
    showViewUsernames,
    onInstitutionCheckboxChange,
    onSelectAllInstitutions
}: SelectionFormProps) {
    const { control, watch, formState: { errors } } = useFormContext();
    const [staffSearch, setStaffSearch] = useState('');

    const filterData = watch('filterData');
    const roleType = watch('roleType');

    const selectedRole = roleTypes.find(r => String(r.ivrmrT_Id) === roleType);
    const roleName = selectedRole?.ivrmrT_Role || '';
    const roleFlag = selectedRole?.flag || '';
    const isAdmin = roleName.toUpperCase() === 'ADMIN' || roleName.toUpperCase() === 'SUPER ADMIN';
    const showStaffSelection = roleFlag ? roleFlag.toUpperCase() === 'S' : true;

    const filteredStaff = staffList.filter(s =>
        s.stafname.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.hrmE_EmployeeCode?.toLowerCase().includes(staffSearch.toLowerCase())
    );

    const allSelected = staffList.length > 0 && staffList.every(s => s.Selected);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            {/* Role Type */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold">Select Role Type: <span className="text-red-500">*</span></Label>
                <Controller
                    control={control}
                    name="roleType"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="-- SELECT ROLE --" />
                            </SelectTrigger>
                            <SelectContent>
                                {roleTypes.map((role) => (
                                    <SelectItem key={role.ivrmrT_Id} value={String(role.ivrmrT_Id)}>
                                        {role.ivrmrT_Role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.roleType && <p className="text-xs text-red-500 font-medium">{errors.roleType.message as string}</p>}
            </div>

            {/* Selection Mode (Single/Multiple) */}
            <div className="space-y-4">
                <Label className="text-sm font-semibold italic">Individual Or Multiple Staff Mapping:</Label>
                <Controller
                    control={control}
                    name="filterData"
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Single" id="r1" />
                                <Label htmlFor="r1" className="cursor-pointer">Individual Staff</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Multiple" id="r2" />
                                <Label htmlFor="r2" className="cursor-pointer">Multiple Staff</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
            </div>

            {/* Add/Remove Pages (Only for Multiple) */}
            {filterData === 'Multiple' && (
                <div className="space-y-4 md:col-span-2 bg-blue-50/50 p-4 rounded border border-blue-100">
                    <Label className="text-sm font-semibold text-blue-800">Permission Action:</Label>
                    <Controller
                        control={control}
                        name="adddelte"
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-10 pt-1">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Add" id="a1" className="text-blue-600 border-blue-400" />
                                    <Label htmlFor="a1" className="cursor-pointer font-medium">Add Pages / Permissions</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Del" id="a2" className="text-red-500 border-red-400" />
                                    <Label htmlFor="a2" className="cursor-pointer font-medium">Remove Pages / Permissions</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>
            )}

            {/* Trust */}
            <div className="space-y-2">
                <Label className="text-sm font-semibold">Select Trust Name:</Label>
                <Controller
                    control={control}
                    name="trust"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="-- SELECT TRUST --" />
                            </SelectTrigger>
                            <SelectContent>
                                {trusts.map((trust) => (
                                    <SelectItem key={trust.mO_Id} value={String(trust.mO_Id)}>
                                        {trust.mO_Name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Institution */}
            <div className={`space-y-4 ${isAdmin && filterData === 'Multiple' ? 'md:col-span-2' : ''}`}>
                <Label className="text-sm font-semibold">Select Institution Name: <span className="text-red-500">*</span></Label>

                {isAdmin && filterData === 'Multiple' ? (
                    <div className="border rounded-md bg-white">
                        <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                            <Label className="text-xs font-bold text-primary">INSTITUTIONS LIST</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="all-inst"
                                    checked={institutions.length > 0 && institutions.every(i => i.Selected)}
                                    onCheckedChange={onSelectAllInstitutions}
                                />
                                <Label htmlFor="all-inst" className="text-xs font-bold cursor-pointer">ALL</Label>
                            </div>
                        </div>
                        <ScrollArea className="h-32">
                            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {institutions.map((inst) => (
                                    <div key={inst.mI_Id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded border border-gray-100 transition-colors">
                                        <Checkbox
                                            id={`inst-${inst.mI_Id}`}
                                            checked={inst.Selected}
                                            onCheckedChange={(checked) => onInstitutionCheckboxChange?.(inst.mI_Id, !!checked)}
                                        />
                                        <Label htmlFor={`inst-${inst.mI_Id}`} className="text-xs cursor-pointer select-none leading-none">
                                            {inst.mI_Name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <Controller
                        control={control}
                        name="institution"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="-- SELECT INSTITUTION --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {institutions.map((inst) => (
                                        <SelectItem key={inst.mI_Id} value={String(inst.mI_Id)}>
                                            {inst.mI_Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                )}
                {errors.institution && <p className="text-xs text-red-500 font-medium">{errors.institution.message as string}</p>}

                {/* VIEW ADMIN USERNAMES!! - Strictly for Admin/Super Admin as requested */}
                {isAdmin && watch('institution') && (
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={onViewUsernames}
                            className="text-red-500 hover:text-red-700 text-xs font-bold uppercase underline decoration-2 underline-offset-4"
                        >
                            VIEW ADMIN USERNAMES!!
                        </button>
                    </div>
                )}
            </div>

            {/* Staff Selection */}
            <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold">
                    {filterData === 'Single' ? 'Select Staff Name:' : "Staff's Name:"} <span className="text-red-500">*</span>
                </Label>

                {filterData === 'Single' ? (
                    <Controller
                        control={control}
                        name="staffId"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-white max-w-md">
                                    <SelectValue placeholder="-- SELECT STAFF --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffList.map((staff) => (
                                        <SelectItem key={staff.hrmE_Id} value={String(staff.hrmE_Id)}>
                                            {staff.stafname}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                ) : (
                    <div className="border rounded-md bg-white">
                        <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                            <div className="relative flex-1 max-w-sm">
                                <Input
                                    placeholder="Search Employee here..."
                                    className="h-8 pl-8 text-xs"
                                    value={staffSearch}
                                    onChange={(e) => setStaffSearch(e.target.value)}
                                />
                                <div className="absolute left-2.5 top-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="all-staff"
                                    checked={allSelected}
                                    onCheckedChange={onSelectAllStaff}
                                />
                                <Label htmlFor="all-staff" className="text-xs font-bold cursor-pointer">ALL</Label>
                            </div>
                        </div>
                        <ScrollArea className="h-48">
                            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {filteredStaff.map((staff) => (
                                    <div key={staff.hrmE_Id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded border border-gray-100 transition-colors">
                                        <Checkbox
                                            id={`staff-${staff.hrmE_Id}`}
                                            checked={staff.Selected}
                                            onCheckedChange={(checked) => onStaffCheckboxChange?.(staff.hrmE_Id, !!checked)}
                                        />
                                        <Label htmlFor={`staff-${staff.hrmE_Id}`} className="text-xs cursor-pointer select-none leading-none">
                                            {staff.stafname}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </div>
        </div>
    );
}
