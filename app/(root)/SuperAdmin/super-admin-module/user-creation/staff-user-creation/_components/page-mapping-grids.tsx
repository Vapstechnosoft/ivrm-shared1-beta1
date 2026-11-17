'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import type { PageDTO, MobilePageDTO, SavedMobilePageDTO, SavedPageDTO } from '@/types/super-admin/user-creation/staff-user-creation';
import type { ApiSearchparams } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PageMappingGridsProps {
    webPages: PageDTO[];
    onWebPageUpdate: Dispatch<SetStateAction<PageDTO[]>>;
    webPageTotal: number;
    onWebPageParamsChange: Dispatch<SetStateAction<ApiSearchparams>>;
    currentWebPageParams: ApiSearchparams;
    isWebPageLoading: boolean;

    stagedWebPages: PageDTO[];
    onStagedWebPageUpdate: Dispatch<SetStateAction<PageDTO[]>>;

    savedGrid: SavedPageDTO[];
    onSavedGridUpdate: Dispatch<SetStateAction<SavedPageDTO[]>>;
    savedGridTotal: number;
    onSavedGridParamsChange: Dispatch<SetStateAction<ApiSearchparams>>;
    currentSavedGridParams: ApiSearchparams;
    isSavedGridLoading: boolean;

    savedMobilePages: SavedMobilePageDTO[];
    onSavedMobileUpdate: Dispatch<SetStateAction<SavedMobilePageDTO[]>>;
    savedMobilePageTotal: number;
    onSavedMobilePageParamsChange: Dispatch<SetStateAction<ApiSearchparams>>;
    currentSavedMobilePageParams: ApiSearchparams;
    isSavedMobilePageLoading: boolean;

    mobilePages: MobilePageDTO[];
    onMobilePageUpdate: Dispatch<SetStateAction<MobilePageDTO[]>>;
    mobilePageTotal: number;
    onMobilePageParamsChange: Dispatch<SetStateAction<ApiSearchparams>>;
    currentMobilePageParams: ApiSearchparams;
    isMobilePageLoading: boolean;

    showInstitution?: boolean;
}

export default function PageMappingGrids({
    webPages,
    onWebPageUpdate,
    webPageTotal,
    onWebPageParamsChange,
    currentWebPageParams,
    isWebPageLoading,

    stagedWebPages,
    onStagedWebPageUpdate,

    savedGrid,
    onSavedGridUpdate,
    savedGridTotal,
    onSavedGridParamsChange,
    currentSavedGridParams,
    isSavedGridLoading,

    mobilePages,
    onMobilePageUpdate,
    mobilePageTotal,
    onMobilePageParamsChange,
    currentMobilePageParams,
    isMobilePageLoading,

    savedMobilePages,
    onSavedMobileUpdate,
    savedMobilePageTotal,
    onSavedMobilePageParamsChange,
    currentSavedMobilePageParams,
    isSavedMobilePageLoading,

    showInstitution = false
}: PageMappingGridsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [searchWeb, setSearchWeb] = useState(currentWebPageParams.search_query || '');
    const [searchMobile, setSearchMobile] = useState(currentMobilePageParams.search_query || '');
    const [searchSavedWeb, setSearchSavedWeb] = useState(currentSavedGridParams.search_query || '');
    const [searchSavedMobile, setSearchSavedMobile] = useState(currentSavedMobilePageParams.search_query || '');
    const [searchStaged, setSearchStaged] = useState(''); // Added for staged web pages
    const [stagedPage, setStagedPage] = useState(1);
    const stagedPageSize = 10;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleWebCheck = (index: number, field: keyof PageDTO, value: boolean) => {
        const updated = [...webPages];
        const page = updated[index];
        (page as any)[field] = value;

        if (field === 'checked') {
            if (value) {
                // Add to staged if not already there
                if (!stagedWebPages.some(p => p.pageMappingId === page.pageMappingId)) {
                    onStagedWebPageUpdate([...stagedWebPages, { ...page }]);
                }
            } else {
                // Remove from staged
                onStagedWebPageUpdate(stagedWebPages.filter(p => p.pageMappingId !== page.pageMappingId));
            }
        }
        onWebPageUpdate(updated);
    };

    const handleStagedCheck = (index: number, field: keyof PageDTO, value: boolean) => {
        // Need to find the actual index in the full stagedWebPages array, not just the paginated view
        const actualIndex = stagedWebPages.findIndex(p => p.pageMappingId === paginatedStaged[index].pageMappingId);
        if (actualIndex > -1) {
            const updated = [...stagedWebPages];
            (updated[actualIndex] as any)[field] = value;
            onStagedWebPageUpdate(updated);
        }
    };

    const handleRemoveStaged = (pageMappingId: number) => {
        onStagedWebPageUpdate(stagedWebPages.filter(p => p.pageMappingId !== pageMappingId));
        // Also uncheck in master list if present
        onWebPageUpdate(webPages.map(p => p.pageMappingId === pageMappingId ? { ...p, checked: false } : p));
    };

    const handleToggleAll = (field: keyof PageDTO, value: boolean) => {
        const updated = webPages.map((p) => ({ ...p, [field]: value }));
        onWebPageUpdate(updated);

        if (field === 'checked') {
            if (value) {
                // Add all to staged (avoiding duplicates)
                const newStaged = [...stagedWebPages];
                updated.forEach(p => {
                    if (!newStaged.some(s => s.pageMappingId === p.pageMappingId)) {
                        newStaged.push({ ...p });
                    }
                });
                onStagedWebPageUpdate(newStaged);
            } else {
                // Remove all from staged if they are in the current master page view
                const masterIds = new Set(webPages.map(p => p.pageMappingId));
                onStagedWebPageUpdate(stagedWebPages.filter(p => !masterIds.has(p.pageMappingId)));
            }
        }
    };

    const handleMobileToggleAll = (field: keyof MobilePageDTO, value: boolean) => {
        const updated = mobilePages.map((p) => ({ ...p, [field]: value }));
        onMobilePageUpdate(updated);
    };

    const handleMobileCheck = (index: number, field: keyof MobilePageDTO, value: boolean) => {
        const updated = [...mobilePages];
        (updated[index] as any)[field] = value;
        onMobilePageUpdate(updated);
    };

    const handleSavedCheck = (index: number, field: keyof SavedPageDTO, value: boolean) => {
        const updated = [...savedGrid];
        (updated[index] as any)[field] = value;
        onSavedGridUpdate(updated);
    };

    const handleSavedMobileCheck = (index: number, field: keyof SavedMobilePageDTO, value: boolean) => {
        const updated = [...savedMobilePages];
        (updated[index] as any)[field] = value;
        onSavedMobileUpdate(updated);
    };

    // Debounce search input for server-side search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchWeb !== (currentWebPageParams.search_query || '')) {
                onWebPageParamsChange((prev) => ({ ...prev, page: 1, search_query: searchWeb }));
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchWeb, onWebPageParamsChange, currentWebPageParams.search_query]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchMobile !== (currentMobilePageParams.search_query || '')) {
                onMobilePageParamsChange((prev) => ({ ...prev, page: 1, search_query: searchMobile }));
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchMobile, onMobilePageParamsChange, currentMobilePageParams.search_query]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchSavedWeb !== (currentSavedGridParams.search_query || '')) {
                onSavedGridParamsChange((prev) => ({ ...prev, page: 1, search_query: searchSavedWeb }));
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchSavedWeb, onSavedGridParamsChange, currentSavedGridParams.search_query]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchSavedMobile !== (currentSavedMobilePageParams.search_query || '')) {
                onSavedMobilePageParamsChange((prev) => ({ ...prev, page: 1, search_query: searchSavedMobile }));
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchSavedMobile, onSavedMobilePageParamsChange, currentSavedMobilePageParams.search_query]);

    const totalPagesWeb = Math.ceil(webPageTotal / (currentWebPageParams.page_size || 10));
    const totalPagesSaved = Math.ceil(savedGridTotal / (currentSavedGridParams.page_size || 10));
    const totalPagesMobile = Math.ceil(mobilePageTotal / (currentMobilePageParams.page_size || 10));
    const totalPagesSavedMobile = Math.ceil(savedMobilePageTotal / (currentSavedMobilePageParams.page_size || 10));

    const handleSort = (column: string, grid: 'web' | 'saved' | 'mobile' | 'savedMobile') => {
        const paramsMap = {
            web: { params: currentWebPageParams, set: onWebPageParamsChange },
            saved: { params: currentSavedGridParams, set: onSavedGridParamsChange },
            mobile: { params: currentMobilePageParams, set: onMobilePageParamsChange },
            savedMobile: { params: currentSavedMobilePageParams, set: onSavedMobilePageParamsChange }
        };
        const { params, set } = paramsMap[grid];
        const isAsc = params.sort_column === column && params.sort_direction === 'asc';
        set((prev) => ({
            ...prev,
            sort_column: column,
            sort_direction: isAsc ? 'desc' : 'asc'
        }));
    };

    // Pagination Component Helper
    const PaginationControls = ({ total, params, setParams, totalPages, isLoading }: { total: number, params: ApiSearchparams, setParams: (p: ApiSearchparams | ((prev: ApiSearchparams) => ApiSearchparams)) => void, totalPages: number, isLoading: boolean }) => (
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-t border-blue-100">
            <div className="text-xs text-gray-500 font-medium">
                Showing {Math.min((params.page! - 1) * params.page_size! + 1, total)} to {Math.min(params.page! * params.page_size!, total)} of {total} entries
            </div>
            <div className="flex items-center space-x-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setParams({ ...params, page: 1 })}
                    disabled={params.page === 1 || isLoading}
                >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setParams({ ...params, page: params.page! - 1 })}
                    disabled={params.page === 1 || isLoading}
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <div className="flex items-center justify-center h-7 px-3 bg-white border border-gray-200 rounded text-xs font-bold text-blue-600">
                    {params.page} / {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setParams({ ...params, page: params.page! + 1 })}
                    disabled={params.page === totalPages || totalPages === 0 || isLoading}
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setParams({ ...params, page: totalPages })}
                    disabled={params.page === totalPages || totalPages === 0 || isLoading}
                >
                    <ChevronsRight className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );

    // For webPages, we use server-side search, others use client-side search (searchParams)
    // but the mobile master grid and saved grid are also server-side in this implementation
    const filteredWeb = webPages;

    // Client-side pagination for staged list
    const filteredStaged = stagedWebPages.filter(p =>
        p.pageName.toLowerCase().includes(searchStaged.toLowerCase()) ||
        p.moduleName.toLowerCase().includes(searchStaged.toLowerCase())
    );
    const totalPagesStaged = Math.ceil(filteredStaged.length / stagedPageSize);
    const paginatedStaged = filteredStaged.slice((stagedPage - 1) * stagedPageSize, stagedPage * stagedPageSize);

    const filteredMobile = mobilePages;
    const filteredSavedWeb = savedGrid;
    const filteredSavedMobile = savedMobilePages;

    if (!isMounted) return null;

    return (
        <div className="space-y-6">
            <Tabs defaultValue="web" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                    <TabsTrigger value="web" className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">Web Mapping</TabsTrigger>
                    <TabsTrigger value="mobile" className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">Mobile Mapping</TabsTrigger>
                </TabsList>

                {/* Web Mapping Tab */}
                <TabsContent value="web" className="space-y-6 pt-4">
                    {/* Master Page List */}
                    <div className="rounded-xl border border-blue-100 bg-white overflow-hidden shadow-sm">
                        <div className="bg-blue-600 px-4 py-2 flex justify-between items-center text-white">
                            <h3 className="font-bold text-sm">Master Page List</h3>
                            <div className="relative w-48">
                                <Search className="absolute left-2 top-1.5 h-3 w-3 text-white/70" />
                                <Input
                                    placeholder="Search.."
                                    className="h-7 pl-8 bg-white/10 border-none text-white placeholder:text-white/50 text-xs focus-visible:ring-1 focus-visible:ring-white/30"
                                    value={searchWeb}
                                    onChange={(e) => setSearchWeb(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="h-64">
                            {isWebPageLoading ? (
                                <div className="p-4 space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="w-12 text-center text-[10px] font-bold uppercase">SL.NO</TableHead>
                                            {showInstitution && (
                                                <TableHead className="text-[10px] font-bold uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('institutionName', 'web')}>
                                                    Institution {currentWebPageParams.sort_column === 'institutionName' && (currentWebPageParams.sort_direction === 'asc' ? '▲' : '▼')}
                                                </TableHead>
                                            )}
                                            <TableHead className="text-[10px] font-bold uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('moduleName', 'web')}>
                                                Module {currentWebPageParams.sort_column === 'moduleName' && (currentWebPageParams.sort_direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('pageName', 'web')}>
                                                Page Name {currentWebPageParams.sort_column === 'pageName' && (currentWebPageParams.sort_direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-1">Add <Checkbox onCheckedChange={(v) => handleToggleAll('addFlag', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-1">Del <Checkbox onCheckedChange={(v) => handleToggleAll('deleteFlag', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-1">Upd <Checkbox onCheckedChange={(v) => handleToggleAll('updateFlag', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-1">Proc <Checkbox onCheckedChange={(v) => handleToggleAll('processFlag', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-1">Rep <Checkbox onCheckedChange={(v) => handleToggleAll('reportFlag', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-1">Select <Checkbox onCheckedChange={(v) => handleToggleAll('checked', !!v)} /></div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredWeb.map((page, idx) => (
                                            <TableRow key={page.pageMappingId} className="hover:bg-blue-50/30 transition-colors">
                                                <TableCell className="text-center text-xs py-2">
                                                    {(currentWebPageParams.page! - 1) * currentWebPageParams.page_size! + idx + 1}
                                                </TableCell>
                                                {showInstitution && <TableCell className="text-xs py-2">{page.institutionName}</TableCell>}
                                                <TableCell className="text-xs py-2">{page.moduleName}</TableCell>
                                                <TableCell className="text-xs py-2 font-medium">{page.pageName}</TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.addFlag} onCheckedChange={(v) => handleWebCheck(idx, 'addFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.deleteFlag} onCheckedChange={(v) => handleWebCheck(idx, 'deleteFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.updateFlag} onCheckedChange={(v) => handleWebCheck(idx, 'updateFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.processFlag} onCheckedChange={(v) => handleWebCheck(idx, 'processFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.reportFlag} onCheckedChange={(v) => handleWebCheck(idx, 'reportFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.checked} onCheckedChange={(v) => handleWebCheck(idx, 'checked', !!v)} className="border-blue-500 data-[state=checked]:bg-blue-500" /></div></TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredWeb.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={showInstitution ? 10 : 9} className="text-center py-4 text-gray-500">No pages found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </ScrollArea>
                        <PaginationControls
                            total={webPageTotal}
                            params={currentWebPageParams}
                            setParams={onWebPageParamsChange}
                            totalPages={totalPagesWeb}
                            isLoading={isWebPageLoading}
                        />
                    </div>

                    {/* Add New Pages Grid (staged) */}
                    {stagedWebPages.length > 0 && (
                        <div className="rounded-xl border border-orange-100 bg-white overflow-hidden shadow-sm mt-6">
                            <div className="bg-orange-600 px-4 py-2 flex justify-between items-center text-white">
                                <h3 className="font-bold text-sm">Add New Pages</h3>
                                <div className="relative w-48">
                                    <Search className="absolute left-2 top-1.5 h-3 w-3 text-white/70" />
                                    <Input
                                        placeholder="Search staged..."
                                        className="h-7 pl-8 bg-white/10 border-none text-white placeholder:text-white/50 text-xs focus-visible:ring-1 focus-visible:ring-white/30"
                                        value={searchStaged}
                                        onChange={(e) => { setSearchStaged(e.target.value); setStagedPage(1); }}
                                    />
                                </div>
                            </div>
                            <ScrollArea className="h-64">
                                {filteredStaged.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">No staged pages match your search.</div>
                                ) : (
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow>
                                                <TableHead className="w-12 text-center text-[10px] font-bold uppercase">SNO</TableHead>
                                                {showInstitution && (
                                                    <TableHead className="text-[10px] font-bold uppercase px-4">Institution</TableHead>
                                                )}
                                                <TableHead className="text-[10px] font-bold uppercase px-4">Module</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase px-4">Page Name</TableHead>
                                                <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Add</TableHead>
                                                <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Delete</TableHead>
                                                <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Update</TableHead>
                                                <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Process</TableHead>
                                                <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Report</TableHead>
                                                <TableHead className="w-16 text-center text-[10px] font-bold uppercase text-red-600">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedStaged.map((page, idx) => (
                                                <TableRow key={page.pageMappingId} className="hover:bg-orange-50/30 transition-colors">
                                                    <TableCell className="text-center text-xs py-2">
                                                        {(stagedPage - 1) * stagedPageSize + idx + 1}
                                                    </TableCell>
                                                    {showInstitution && <TableCell className="text-xs py-2 px-4 italic text-gray-400">{page.institutionName}</TableCell>}
                                                    <TableCell className="text-xs py-2 px-4">{page.moduleName}</TableCell>
                                                    <TableCell className="text-xs py-2 px-4 font-medium">{page.pageName}</TableCell>
                                                    <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.addFlag} onCheckedChange={(v) => handleStagedCheck(idx, 'addFlag', !!v)} /></div></TableCell>
                                                    <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.deleteFlag} onCheckedChange={(v) => handleStagedCheck(idx, 'deleteFlag', !!v)} /></div></TableCell>
                                                    <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.updateFlag} onCheckedChange={(v) => handleStagedCheck(idx, 'updateFlag', !!v)} /></div></TableCell>
                                                    <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.processFlag} onCheckedChange={(v) => handleStagedCheck(idx, 'processFlag', !!v)} /></div></TableCell>
                                                    <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.reportFlag} onCheckedChange={(v) => handleStagedCheck(idx, 'reportFlag', !!v)} /></div></TableCell>
                                                    <TableCell className="text-center py-2">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveStaged(page.pageMappingId)}>
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </ScrollArea>
                            <PaginationControls
                                total={filteredStaged.length}
                                params={{ page: stagedPage, page_size: stagedPageSize } as any}
                                setParams={(p: any) => setStagedPage(p.page)}
                                totalPages={totalPagesStaged}
                                isLoading={false}
                            />
                        </div>
                    )}

                    {/* Saved List */}
                    <div className="rounded-xl border border-green-100 bg-white overflow-hidden shadow-sm">
                        <div className="bg-green-600 px-4 py-2 flex justify-between items-center text-white">
                            <h3 className="font-bold text-sm">Saved List (Existing Privileges)</h3>
                            <div className="relative w-48">
                                <Search className="absolute left-2 top-1.5 h-3 w-3 text-white/70" />
                                <Input
                                    placeholder="Search.."
                                    className="h-7 pl-8 bg-white/10 border-none text-white placeholder:text-white/50 text-xs focus-visible:ring-1 focus-visible:ring-white/30"
                                    value={searchSavedWeb}
                                    onChange={(e) => setSearchSavedWeb(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="h-64">
                            {isSavedGridLoading ? (
                                <div className="p-4 space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="w-12 text-center text-[10px] font-bold uppercase">SL.NO</TableHead>
                                            {showInstitution && (
                                                <TableHead className="text-[10px] font-bold uppercase px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('institution', 'saved')}>
                                                    Institution {currentSavedGridParams.sort_column === 'institution' && (currentSavedGridParams.sort_direction === 'asc' ? '▲' : '▼')}
                                                </TableHead>
                                            )}
                                            <TableHead className="text-[10px] font-bold uppercase px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('module', 'saved')}>
                                                Module {currentSavedGridParams.sort_column === 'module' && (currentSavedGridParams.sort_direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('pageName', 'saved')}>
                                                Page Name {currentSavedGridParams.sort_column === 'pageName' && (currentSavedGridParams.sort_direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Add</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Del</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Upd</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Proc</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Rep</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase text-red-600">Rem</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {savedGrid.map((page, idx) => (
                                            <TableRow key={page.ivrmstauP_Id} className="hover:bg-green-50/30 transition-colors">
                                                <TableCell className="text-center text-xs py-2">
                                                    {(currentSavedGridParams.page! - 1) * currentSavedGridParams.page_size! + idx + 1}
                                                </TableCell>
                                                {showInstitution && <TableCell className="text-xs py-2 px-4"></TableCell>}
                                                <TableCell className="text-xs py-2 px-4"></TableCell>
                                                <TableCell className="text-xs py-2 px-4 font-medium">{page.ivrmmP_PageName}</TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmrP_AddFlag} onCheckedChange={(v) => handleSavedCheck(idx, 'ivrmrP_AddFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmrP_DeleteFlag} onCheckedChange={(v) => handleSavedCheck(idx, 'ivrmrP_DeleteFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmrP_UpdateFlag} onCheckedChange={(v) => handleSavedCheck(idx, 'ivrmrP_UpdateFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmrP_ProcessFlag} onCheckedChange={(v) => handleSavedCheck(idx, 'ivrmrP_ProcessFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmrP_ReportFlag} onCheckedChange={(v) => handleSavedCheck(idx, 'ivrmrP_ReportFlag', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.checked} onCheckedChange={(v) => handleSavedCheck(idx, 'checked', !!v)} className="border-red-500 data-[state=checked]:bg-red-500" /></div></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </ScrollArea>
                        <PaginationControls
                            total={savedGridTotal}
                            params={currentSavedGridParams}
                            setParams={onSavedGridParamsChange}
                            totalPages={totalPagesSaved}
                            isLoading={isSavedGridLoading}
                        />
                    </div>
                </TabsContent>

                {/* Mobile Mapping Tab */}
                <TabsContent value="mobile" className="space-y-6 pt-4">
                    {/* Mobile Master List */}
                    <div className="rounded-xl border border-purple-100 bg-white overflow-hidden shadow-sm">
                        <div className="bg-purple-600 px-4 py-2 flex justify-between items-center text-white">
                            <h3 className="font-bold text-sm">Mobile App Master Page List</h3>
                            <div className="relative w-48">
                                <Search className="absolute left-2 top-1.5 h-3 w-3 text-white/70" />
                                <Input
                                    placeholder="Search.."
                                    className="h-7 pl-8 bg-white/10 border-none text-white placeholder:text-white/50 text-xs focus-visible:ring-1 focus-visible:ring-white/30"
                                    value={searchMobile}
                                    onChange={(e) => setSearchMobile(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="h-64">
                            {isMobilePageLoading ? (
                                <div className="p-4 space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="w-12 text-center text-[10px] font-bold uppercase">SL.NO</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('pageName', 'mobile')}>
                                                Page Name {currentMobilePageParams.sort_column === 'pageName' && (currentMobilePageParams.sort_direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">
                                                <div className="flex flex-col items-center gap-1">Add <Checkbox onCheckedChange={(v) => handleMobileToggleAll('ivrmmaP_AddFlg', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">
                                                <div className="flex flex-col items-center gap-1">Upd <Checkbox onCheckedChange={(v) => handleMobileToggleAll('ivrmmaP_UpdateFlg', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">
                                                <div className="flex flex-col items-center gap-1">Del <Checkbox onCheckedChange={(v) => handleMobileToggleAll('ivrmmaP_DeleteFlg', !!v)} /></div>
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">
                                                <div className="flex flex-col items-center gap-1">Select <Checkbox onCheckedChange={(v) => handleMobileToggleAll('checked', !!v)} /></div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mobilePages.map((page, idx) => (
                                            <TableRow key={page.ivrmmaP_Id} className="hover:bg-purple-50/30 transition-colors">
                                                <TableCell className="text-center text-xs py-2">
                                                    {(currentMobilePageParams.page! - 1) * currentMobilePageParams.page_size! + idx + 1}
                                                </TableCell>
                                                <TableCell className="text-xs py-2 px-4 font-medium">{page.ivrmmaP_AppPageName}</TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmmaP_AddFlg} onCheckedChange={(v) => handleMobileCheck(idx, 'ivrmmaP_AddFlg', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmmaP_UpdateFlg} onCheckedChange={(v) => handleMobileCheck(idx, 'ivrmmaP_UpdateFlg', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.ivrmmaP_DeleteFlg} onCheckedChange={(v) => handleMobileCheck(idx, 'ivrmmaP_DeleteFlg', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2">
                                                    <div className="flex justify-center"><Checkbox checked={page.checked} onCheckedChange={(v) => handleMobileCheck(idx, 'checked', !!v)} className="border-purple-500 data-[state=checked]:bg-purple-500" /></div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </ScrollArea>
                        <PaginationControls
                            total={mobilePageTotal}
                            params={currentMobilePageParams}
                            setParams={onMobilePageParamsChange}
                            totalPages={totalPagesMobile}
                            isLoading={isMobilePageLoading}
                        />
                    </div>

                    {/* Saved Mobile List */}
                    <div className="rounded-xl border border-orange-100 bg-white overflow-hidden shadow-sm">
                        <div className="bg-orange-600 px-4 py-2 flex justify-between items-center text-white">
                            <h3 className="font-bold text-sm">Saved Mobile App Page List</h3>
                            <div className="relative w-48">
                                <Search className="absolute left-2 top-1.5 h-3 w-3 text-white/70" />
                                <Input
                                    placeholder="Search.."
                                    className="h-7 pl-8 bg-white/10 border-none text-white placeholder:text-white/50 text-xs focus-visible:ring-1 focus-visible:ring-white/30"
                                    value={searchSavedMobile}
                                    onChange={(e) => setSearchSavedMobile(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="h-64">
                            {isSavedMobilePageLoading ? (
                                <div className="p-4 space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead className="w-12 text-center text-[10px] font-bold uppercase">SL.NO</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase px-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('pageName', 'savedMobile')}>
                                                Page Name {currentSavedMobilePageParams.sort_column === 'pageName' && (currentSavedMobilePageParams.sort_direction === 'asc' ? '▲' : '▼')}
                                            </TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Add</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Del</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase">Upd</TableHead>
                                            <TableHead className="w-16 text-center text-[10px] font-bold uppercase text-red-600">Rem</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {savedMobilePages.map((page, idx) => (
                                            <TableRow key={page.ivrmumalP_Id} className="hover:bg-orange-50/30 transition-colors">
                                                <TableCell className="text-center text-xs py-2">
                                                    {(currentSavedMobilePageParams.page! - 1) * currentSavedMobilePageParams.page_size! + idx + 1}
                                                </TableCell>
                                                <TableCell className="text-xs py-2 px-4 font-medium">{page.ivrmmaP_AppPageName}</TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={!!page.ivrmumalP_AddFlg} onCheckedChange={(v) => handleSavedMobileCheck(idx, 'ivrmumalP_AddFlg', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={!!page.ivrmumalP_DeleteFlg} onCheckedChange={(v) => handleSavedMobileCheck(idx, 'ivrmumalP_DeleteFlg', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={!!page.ivrmumalP_UpdateFlg} onCheckedChange={(v) => handleSavedMobileCheck(idx, 'ivrmumalP_UpdateFlg', !!v)} /></div></TableCell>
                                                <TableCell className="text-center py-2"><div className="flex justify-center"><Checkbox checked={page.checked} onCheckedChange={(v) => handleSavedMobileCheck(idx, 'checked', !!v)} className="border-red-500 data-[state=checked]:bg-red-500" /></div></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </ScrollArea>
                        <PaginationControls
                            total={savedMobilePageTotal}
                            params={currentSavedMobilePageParams}
                            setParams={onSavedMobilePageParamsChange}
                            totalPages={totalPagesSavedMobile}
                            isLoading={isSavedMobilePageLoading}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
