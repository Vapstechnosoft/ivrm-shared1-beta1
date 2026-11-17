'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { InputText } from '@/components/ui/extension/input-text';
import { getRolePrivilegesList, savePrivileges, getOnLoadData, searchPages, deletePrivilege, getRoleDropdown, getModuleDropdown } from '@/server/super-admin/super-admin-module/general-setting/privileges';
import { IPrivilegeData, IPrivilegeModule, IPrivilegePage, IPrivilegeRole, IRolePrivilegeMapping } from '@/types/super-admin/super-admin-module/general-setting/privileges';
import { Search, Save, X, RefreshCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MasterPagesGrid } from './_components/master-pages-grid';
import { PrivilegesGrid } from './_components/privileges-grid';
//import { RolePrivilegesList } from './_components/role-privileges-list';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PageProvider } from '../master-role-type/_components/page-context';
import { parseAsInteger, useQueryState } from 'nuqs';
import { tableSearchVariables } from '@/lib/data-table.config';

export default function PrivilegesPage() {
    const [roles, setRoles] = useState<IPrivilegeRole[]>([]);
    const [modules, setModules] = useState<IPrivilegeModule[]>([]);

    // Selection State
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);

    // Grids State
    const [masterPages, setMasterPages] = useState<IPrivilegePage[]>([]); // Grid 1
    const [savedPrivileges, setSavedPrivileges] = useState<IPrivilegeData[]>([]); // Grid 2
    const [cartPrivileges, setCartPrivileges] = useState<IPrivilegeData[]>([]); // Grid 3 (Selected)

    const [rolePrivilegesList, setRolePrivilegesList] = useState<IRolePrivilegeMapping[]>([]); // Grid 4
    const [totalPrivilegesList, setTotalPrivilegesList] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [isListLoading, setIsListLoading] = useState(false);

    // Pagination for Grid 4
    const [page, setPage] = useQueryState(
        tableSearchVariables.page,
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [pageSize, setPageSize] = useQueryState(
        tableSearchVariables.page_size,
        parseAsInteger.withOptions({ shallow: false }).withDefault(10)
    );

    const fetchRolePrivilegesList = React.useCallback(async () => {
        setIsListLoading(true);
        const searchParams = {
            page: page,
            page_size: pageSize
        };
        try {
            const res = await getRolePrivilegesList(searchParams);
            if (res.success) {
                setRolePrivilegesList(res.data || []);
                setTotalPrivilegesList(res.total || 0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsListLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        const loadInitData = async () => {
            // Fetch Roles
            const rolesRes = await getRoleDropdown();
            if (rolesRes.success) {
                setRoles(rolesRes.roles || []);
            }

            // Fetch Modules
            const modRes = await getModuleDropdown();
            if (modRes.success) {
                setModules(modRes.modules || []);
            }
        };
        loadInitData();
        fetchRolePrivilegesList();
    }, [fetchRolePrivilegesList]);

    const handleSearch = async () => {
        if (!selectedRoleId || selectedModuleIds.length === 0) {
            toast.error('Please select a Role and at least one Module');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ivrmrT_Id: parseInt(selectedRoleId),
                ivrmM_Id: selectedModuleIds
            };
            const res = await searchPages(payload);
            if (res.success && res.pages && res.pages.length > 0) {
                setMasterPages(res.pages);
                setSavedPrivileges(res.savedPrivileges || []);
                setCartPrivileges([]); // Clear cart on new search
            } else {
                // FALLBACK STATIC DATA FOR TESTING
                const staticPages: IPrivilegePage[] = [
                    { ivrmmP_Id: 101, ivrmmP_PageName: 'Admission Form' },
                    { ivrmmP_Id: 102, ivrmmP_PageName: 'Student List' },
                    { ivrmmP_Id: 103, ivrmmP_PageName: 'Fee Collection' },
                    { ivrmmP_Id: 104, ivrmmP_PageName: 'Timetable Entry' },
                    { ivrmmP_Id: 105, ivrmmP_PageName: 'Attendance Report' },
                    { ivrmmP_Id: 106, ivrmmP_PageName: 'Exam Scheduling' },
                    { ivrmmP_Id: 107, ivrmmP_PageName: 'Transport Route' },
                    { ivrmmP_Id: 108, ivrmmP_PageName: 'Library Book Issue' },
                    { ivrmmP_Id: 109, ivrmmP_PageName: 'Staff Payroll' },
                    { ivrmmP_Id: 110, ivrmmP_PageName: 'Inventory Stock' },
                    { ivrmmP_Id: 111, ivrmmP_PageName: 'Hostel Room Allocation' },
                    { ivrmmP_Id: 112, ivrmmP_PageName: 'Alumni Registration' },
                ];
                setMasterPages(staticPages);
                toast.success('Loaded static data for testing (API returned empty)');
            }
        } catch (error) {
            console.error(error);
            toast.error('Search failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMasterPageSelect = (item: IPrivilegePage, isChecked: boolean) => {
        // Update check state in Master Grid
        const updatedMasterPages = masterPages.map(p =>
            p.ivrmmP_Id === item.ivrmmP_Id ? { ...p, checked: isChecked } : p
        );
        setMasterPages(updatedMasterPages);

        if (isChecked) {
            // Add to Cart if not already exists
            const exists = cartPrivileges.some(c => c.ivrmmP_Id === item.ivrmmP_Id);
            if (!exists) {
                const newPrivilege: IPrivilegeData = {
                    ivrmmP_Id: item.ivrmmP_Id,
                    ivrmmP_PageName: item.ivrmmP_PageName,
                    ivrmrP_AddFlag: false,
                    ivrmrP_DeleteFlag: false,
                    ivrmrP_UpdateFlag: false,
                    ivrmrP_ProcessFlag: false,
                    ivrmrP_ReportFlag: false,
                    isNew: true
                };
                setCartPrivileges([...cartPrivileges, newPrivilege]);
            }
        } else {
            // Remove from Cart
            setCartPrivileges(cartPrivileges.filter(c => c.ivrmmP_Id !== item.ivrmmP_Id));
        }
    };

    const handleDeleteFromCart = (item: IPrivilegeData) => {
        setCartPrivileges(cartPrivileges.filter(c => c.ivrmmP_Id !== item.ivrmmP_Id));
        // Uncheck in master grid
        setMasterPages(masterPages.map(p =>
            p.ivrmmP_Id === item.ivrmmP_Id ? { ...p, checked: false } : p
        ));
    };

    const handleSave = async () => {
        if (cartPrivileges.length === 0 && savedPrivileges.length === 0) {
            toast.warning('Nothing to save');
            return;
        }

        setIsLoading(true);
        try {
            // Combine saved (updates) and cart (inserts)
            // Backend usually expects 'secondgrid' (cart) and 'previousgrid' (saved)
            const payload = {
                roleId: parseInt(selectedRoleId),
                secondgrid: cartPrivileges,
                previousgrid: savedPrivileges
            };

            const res = await savePrivileges(payload);
            if (res.success) {
                toast.success(res.message);
                // Refresh data
                handleSearch();
                fetchRolePrivilegesList(); // Refresh bottom grid
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Save failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePrivilege = async (item: IRolePrivilegeMapping) => {
        if (!confirm('Are you sure you want to delete this privilege?')) return;

        try {
            const res = await deletePrivilege(item);
            if (res.success) {
                toast.success(res.message);
                fetchRolePrivilegesList();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleModuleCheck = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedModuleIds([...selectedModuleIds, id]);
        } else {
            setSelectedModuleIds(selectedModuleIds.filter(mId => mId !== id));
        }
    };

    return (
        <PageProvider refreshData={handleSearch}>
            <div className='container p-4 space-y-6'>
                <div className='p-4 border rounded-md shadow-sm bg-white'>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Master Role Privileges</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label>Role Name <span className="text-red-500">*</span></Label>
                            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.ivrmrT_Id} value={role.ivrmrT_Id.toString()}>
                                            {role.ivrmrT_Role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Module Selection */}
                        <div className="space-y-2">
                            <Label>Module Pages <span className="text-red-500">*</span></Label>
                            <div className="border rounded-md p-2 h-40 overflow-y-auto bg-gray-50">
                                {modules.map(mod => (
                                    <div key={mod.ivrmM_Id} className="flex items-center space-x-2 mb-2">
                                        <Checkbox
                                            id={`mod-${mod.ivrmM_Id}`}
                                            checked={selectedModuleIds.includes(mod.ivrmM_Id)}
                                            onCheckedChange={(c) => handleModuleCheck(mod.ivrmM_Id, c as boolean)}
                                        />
                                        <Label htmlFor={`mod-${mod.ivrmM_Id}`} className="font-normal cursor-pointer">
                                            {mod.ivrmM_ModuleName}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <Button onClick={handleSearch} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            <Search className="w-4 h-4 mr-2" /> Search
                        </Button>
                        <Button variant="destructive" onClick={() => window.location.reload()}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                    </div>
                </div>

                {/* Grid 1: Master Pages */}
                <MasterPagesGrid data={masterPages} onSelect={handleMasterPageSelect} />

                {/* Grid 2: Saved Privileges */}
                {savedPrivileges.length > 0 && (
                    <PrivilegesGrid
                        title="Saved Role Privileges"
                        data={savedPrivileges}
                        onChange={setSavedPrivileges}
                    />
                )}

                {/* Grid 3: Selected Privileges (Cart) */}
                {cartPrivileges.length > 0 && (
                    <div className="animate-in slide-in-from-bottom-2">
                        <PrivilegesGrid
                            title="Selected Master Pages"
                            data={cartPrivileges}
                            onChange={setCartPrivileges}
                            onDelete={handleDeleteFromCart}
                            isCart={true}
                        />
                        <div className="flex justify-center gap-4 mt-4">
                            <Button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-700 w-32">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                            <Button variant="outline" onClick={() => setCartPrivileges([])} className="w-32">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Clear
                            </Button>
                        </div>
                    </div>
                )}

                {/* Grid 4: Role Privileges List (OnLoad Grid) */}
                {/* <RolePrivilegesList
                    data={rolePrivilegesList}
                    onDelete={handleDeletePrivilege}
                    isLoading={isListLoading}
                    totalItems={totalPrivilegesList}
                    pagination={{
                        pageIndex: page,
                        pageSize: pageSize || 10,
                        onPageChange: setPage,
                        onPageSizeChange: setPageSize
                    }}
                /> */}
            </div>
        </PageProvider>
    );
}
