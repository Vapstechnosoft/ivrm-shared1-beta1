'use client';

import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import {
    deactivateMapping,
    getInitialDetails,
    getTopics,
    saveMapping
} from '@/server/lesson-planner/transactions/school-master-unit-topic-mapping';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddForm from './_components/add-form';
import MappingList from './_components/mapping-list';

import type { IMappingGridItem, IUnit } from '@/types/lesson-planner/transactions/school-master-unit-topic-mapping';

export default function SchoolMasterUnitTopicMappingPage() {
    const [units, setUnits] = useState<IUnit[]>([]);
    const [gridData, setGridData] = useState<IMappingGridItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const findValue = (obj: any, keys: string[]) => {
        if (!obj) return null;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
        }
        return null;
    };

    const getList = (res: any, key: string, alternatives: string[]) => {
        if (!res) return [];

        const extract = (obj: any): any[] | null => {
            if (Array.isArray(obj)) return obj;
            if (obj?.$values && Array.isArray(obj.$values)) return obj.$values;

            const val = findValue(obj, [key, ...alternatives]);
            if (Array.isArray(val)) return val;
            if (val?.$values && Array.isArray(val.$values)) return val.$values;

            return null;
        };

        const fromRoot = extract(res);
        if (fromRoot) return fromRoot;

        if (res.data) {
            const fromData = extract(res.data);
            if (fromData) return fromData;
        }

        return [];
    };

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const res = await getInitialDetails({ page: 1, page_size: 20 }); // Using 2 as per legacy code default

            const unitList = getList(res, 'getunitdetails', ['units', 'unitDetails', 'data']);
            const gridList = getList(res, 'getgriddetails', ['griddata', 'mappingDetails', 'data']);

            setUnits(unitList);
            setGridData(gridList);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Failed to load initial data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleUnitChange = async (unitId: string) => {
        try {
            const res = await getTopics(Number(unitId));
            const topicList = getList(res, 'gettopicdetails', ['topics', 'topicList', 'data']);
            return topicList;
        } catch (error) {
            console.error('Error fetching topics:', error);
            throw error;
        }
    };

    const handleSave = async (data: any) => {
        setIsLoading(true);
        try {
            const res = await saveMapping(data);
            if (res.success || res.returnval === true) {
                toast.success(res.message || 'Saved successfully');
                fetchInitialData(); // Refresh grid
            } else if (res.message === 'Duplicate') {
                toast.warning('Record already exists');
            } else {
                toast.error(res.message || 'Failed to save record');
            }
        } catch (error) {
            console.error('Error saving mapping:', error);
            toast.error('An error occurred while saving');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (item: IMappingGridItem) => {
        const lpmuT_Id = findValue(item, ['lpmuT_Id', 'LPMUT_Id', 'id']);
        const lpmU_Id = findValue(item, ['lpmU_Id', 'LPMU_Id', 'unitId']);
        const lpmT_Id = findValue(item, ['lpmT_Id', 'LPMT_Id', 'topicId']);

        const payload = {
            LPMTU_Id: lpmuT_Id,
            LPMU_Id: lpmU_Id,
            LPMT_Id: lpmT_Id,
            LPMUT_ActiveFlag: item.lpmuT_ActiveFlag
        };

        console.log('Deactivate Payload:', payload);

        try {
            const res = await deactivateMapping(payload);

            if (res.returnval === true || res.success || res.message?.toLowerCase().includes('successfully')) {
                toast.success(res.message || `Record ${item.lpmuT_ActiveFlag ? 'Deactivated' : 'Activated'} successfully`);
                fetchInitialData();
            } else if (res.message === 'Exists') {
                toast.warning('You Can Not Deactivate This Record, It Has Dependency');
            } else {
                toast.error(res.message || 'Failed to change status');
            }
        } catch (error) {
            console.error('Error deactivating:', error);
            toast.error('An error occurred');
        }
    };

    const handleCancel = () => {
        fetchInitialData();
    };

    return (
        <div className='container mx-auto space-y-6 py-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='font-bold text-2xl tracking-tight'>Master Topic Unit Mapping</h1>
            </div>

            <CollapsibleSection title='Master Topic Unit Mapping' defaultOpen={true}>
                <AddForm units={units} onUnitChange={handleUnitChange} onSave={handleSave} onCancel={handleCancel} isLoading={isLoading} />
            </CollapsibleSection>

            <CollapsibleSection title='Master Topic Unit Mapping List' defaultOpen={true}>
                <MappingList data={gridData} onToggleActive={handleToggleActive} />
            </CollapsibleSection>
        </div>
    );
}
