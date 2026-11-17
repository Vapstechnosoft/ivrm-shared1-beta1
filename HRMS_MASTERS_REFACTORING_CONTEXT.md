# HRMS Masters Refactoring - Context Document

## Overview
This document outlines the architectural pattern and conventions used for refactoring HRMS master modules to follow the "clean and simple" pattern established by the `preadmission` module masters.

## Reference Module
**Pattern Source:** `app/(root)/admission/preadmission/masters/document`

## Core Architectural Pattern

### 1. Server Actions Pattern (`server/hrms/hrmsConfig/master/[module].ts`)
```typescript
'use server';
import { api, getSearchParamsUrl } from '@/lib/apiService';
import type { ApiSearchparams } from '@/types';
import type { IMaster[Module]List } from '@/types/hrms/hrms-config/master';

// GET listing with search params
export async function getMaster[Module](searchParams?: ApiSearchparams) {
    const urlParams = getSearchParamsUrl(searchParams ?? {}, 'searchableColumns');
    const url = `/api/Master[Module]Facade/onloadgetdetails?${urlParams}`;
    return await api.get<IMaster[Module]List[]>('hrms', url);
}

// POST add/update
export async function addOrUpdateMaster[Module](data: any) {
    const url = '/api/Master[Module]Facade';
    return await api.post<any>('hrms', url, data);
}

// PUT toggle (activate/deactivate)
export async function toggleMaster[Module](id: number) {
    const url = `/api/Master[Module]Facade/deactivateRecordById/${id}`;
    return await api.put('hrms', url);
}

// DELETE
export async function deleteMaster[Module](id: number) {
    const url = `/api/Master[Module]Facade/delete/${id}`;
    return await api.delete<any>('hrms', url);
}
```

**Key Points:**
- Use GET for listing (not POST)
- Use `getSearchParamsUrl` helper for query parameters
- No `roleId` parameter in listing function
- Simple, direct API calls without complex transformations

### 2. Type Definitions (`types/hrms/hrms-config/master.ts`)
```typescript
export interface IMaster[Module]List {
    [idKey]: number;           // e.g., hrmeT_Id, hrmpT_Id
    mI_Id: number;
    [nameKey]: string;         // e.g., hrmeT_EmployeeType, hrmpT_SalaryFrom
    [activeFlagKey]: boolean;  // e.g., hrmeT_ActiveFlag, hrmpT_ActiveFlag
    createdDate: string;
    updatedDate: string;
}
```

**Key Points:**
- All keys in **camelCase** matching API response exactly
- Consolidated in single file: `types/hrms/hrms-config/master.ts`
- No client-side transformations needed
- Property names match API contract directly

### 3. Zod Schemas (`schemas/hrms/masters.ts`)
```typescript
export const [module]MasterSchema = z.object({
    [idKey]: z.number().optional(),
    [fieldKey]: z.string()...
    // NO mI_Id in schema (handled by backend)
    // NO [activeFlagKey] in schema (handled by backend)
});

export const hrmsMasterSchemas = {
    [module]: {
        add: [module]MasterSchema,
        update: [module]MasterSchema
    }
};
```

**Key Points:**
- Use camelCase keys matching API
- Exclude `mI_Id` and `[activeFlagKey]` (backend handles)
- Exclude auto-generated fields (`createdDate`, `updatedDate`)
- Validation rules match field requirements

### 4. React Query Hooks (`hooks/hrms/useMasters.ts`)
```typescript
export function useMaster[Module](searchParams?: ApiSearchparams) {
    const queryClient = useQueryClient();

    return {
        ...useQuery({
            queryKey: [HRMS_QUERY_KEYS.MASTER_[MODULE], searchParams ?? {}],
            queryFn: async () => getMaster[Module](searchParams),
            staleTime: 0
        }),
        refetchAll: () => {
            return queryClient.invalidateQueries({
                queryKey: [HRMS_QUERY_KEYS.MASTER_[MODULE]]
            });
        }
    };
}
```

**Key Points:**
- No `roleId` parameter
- Only `searchParams` for listing
- Returns spread `useQuery` with `refetchAll` helper
- Simple, consistent pattern

### 5. Form Components Pattern

#### Add Form (`_components/add-form.tsx`)
```typescript
'use client';
import { InputText } from '@/components/ui/extension/input-text';
import { InputNumber } from '@/components/ui/extension/input-number';
import { hrmsMasterSchemas } from '@/schemas/hrms/masters';
import { addOrUpdateMaster[Module] } from '@/server/hrms/hrmsConfig/master/[module]';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Add[Module]Form({ onSuccess, className = '' }) {
    const { refetchAll } = useMaster[Module]();
    
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = 
        useForm<FormFields>({
            resolver: zodResolver(hrmsMasterSchemas.[module].add),
            mode: 'onChange'
        });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const payload = {
            // Only send necessary fields, NO IDs, NO mI_Id, NO ActiveFlag
            [fieldKey]: data.[fieldKey]?.trim() || ''
        };
        const response = await addOrUpdateMaster[Module](payload);
        // Handle response...
    };
}
```

**Key Points:**
- Use global UI components: `InputText`, `InputNumber`, `InputTextarea`, `Checkbox`, `DateField`
- Payload excludes: auto-generated IDs, `mI_Id`, `ActiveFlag`, `createdDate`, `updatedDate`
- Use `zodResolver` with schema from `hrmsMasterSchemas`
- Call `refetchAll()` after success

#### Update Form (`_components/update-form.tsx`)
- Similar to Add Form
- Include `[idKey]` in payload for updates
- Use `useEffect` to reset form with `selectedRow` data

#### Toggle Form (`_components/toggle-form.tsx`)
```typescript
export default function ToggleMaster[Module]Form({ rowData, onClose }) {
    const { refetchAll } = useMaster[Module]();
    const isActive = rowData.[activeFlagKey];

    const onSubmit = async () => {
        const response = await toggleMaster[Module](Number(rowData.[idKey]));
        // Handle response...
    };
}
```

**Key Points:**
- Use `AdaptiveDialog`, `AdaptiveBody`, `AdaptiveFooter`
- Simple `z.object({ [idKey]: z.number() })` schema
- Call `toggleMaster[Module](id)` server action
- Display descriptive confirmation message

### 6. Columns Component (`_components/columns.tsx`)
```typescript
export const columns: ColumnDef<IMaster[Module]List>[] = [
    {
        accessorKey: '[camelCaseField]',  // Match API response keys
        header: ({ column }) => <DataTableColumnHeader column={column} title='Field Name' />
    }
];

function ActionButtonsCell({ rowData }: { rowData: IMaster[Module]List }) {
    const { openEditForm, openToggleForm } = useFormContext<IMaster[Module]List>();
    
    const handleToggle = useCallback((data: IMaster[Module]List) => {
        openToggleForm(data);  // Use form context, not inline logic
    }, [openToggleForm]);
}
```

**Key Points:**
- Use `IMaster[Module]List` type from `types/hrms/hrms-config/master`
- `accessorKey` uses camelCase matching API
- `toggleConditionKey` uses camelCase (e.g., `hrmeT_ActiveFlag`)
- Use `useFormContext` for form state management
- No inline toggle logic - delegate to form context

### 7. Page Component (`page.tsx`)
```typescript
export default function Master[Module]Page(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useMaster[Module](searchParams);

    return (
        <FormProvider<IMaster[Module]List>>
            <Master[Module]PageContent response={response} isLoading={isLoading} error={error} />
        </FormProvider>
    );
}

function FormSections() {
    const { isAddFormOpen, isEditFormOpen, isToggleFormOpen, selectedRow, 
            closeAddForm, closeEditForm, closeToggleForm, addFormRef, editFormRef } = 
        useFormContext<IMaster[Module]List>();

    return (
        <>
            {isAddFormOpen && <Add[Module]Form onSuccess={closeAddForm} />}
            {isEditFormOpen && selectedRow && <Update[Module]Form selectedRow={selectedRow} onSuccess={closeEditForm} />}
            {isToggleFormOpen && selectedRow && <ToggleMaster[Module]Form rowData={selectedRow} onClose={closeToggleForm} />}
        </>
    );
}
```

**Key Points:**
- No manual search params conversion
- No `HRMS_MI_ID` usage
- Use `FormProvider` with `IMaster[Module]List` type
- Forms handle their own refetch via `refetchAll()`
- No `refetch` prop needed in `FormSections`

## Key Conventions

### API Integration
- **GET** for listing: `/api/Master[Module]Facade/onloadgetdetails?[searchParams]`
- **POST** for add/update: `/api/Master[Module]Facade`
- **PUT** for toggle: `/api/Master[Module]Facade/deactivateRecordById/{id}`
- **DELETE** for delete: `/api/Master[Module]Facade/delete/{id}`

### Data Handling
- **No client-side transformations** - use API response keys directly
- **No `mI_Id` in payloads** - backend extracts from JWT
- **No `ActiveFlag` in add/update payloads** - backend handles defaults
- **No auto-generated IDs** in add payloads (send `0` or omit)
- **Include ID in update payloads** - backend uses it to determine update vs insert

### File Structure
```
app/(root)/hrms/masters/[module]/
  ├── _components/
  │   ├── add-form.tsx
  │   ├── update-form.tsx
  │   ├── toggle-form.tsx
  │   └── columns.tsx
  └── page.tsx

server/hrms/hrmsConfig/master/
  └── [module].ts

types/hrms/hrms-config/
  └── master.ts (consolidated types)

schemas/hrms/
  └── masters.ts (consolidated schemas)

hooks/hrms/
  └── useMasters.ts (consolidated hooks)
```

### Naming Conventions
- **Types:** `IMaster[Module]List` (e.g., `IMasterEmployeeTypeList`)
- **Server Actions:** `getMaster[Module]`, `addOrUpdateMaster[Module]`, `toggleMaster[Module]`, `deleteMaster[Module]`
- **Hooks:** `useMaster[Module]`
- **Schemas:** `[module]MasterSchema` (e.g., `employeeTypeMasterSchema`)
- **Keys:** camelCase matching API exactly (e.g., `hrmeT_Id`, `hrmeT_EmployeeType`)

## Completed Modules
- Bank
- Course
- Department
- Designation
- Gender
- Grade
- Group Type
- Leave Year
- Marital Status
- Professional Tax
- Employee Type

## Common Issues to Avoid
1. ❌ Don't include `mI_Id` in form payloads
2. ❌ Don't include `ActiveFlag` in add/update schemas
3. ❌ Don't use POST for listing - use GET with query params
4. ❌ Don't transform API response keys - use them directly
5. ❌ Don't use `HRMS_MI_ID` constant in hooks/pages
6. ❌ Don't create duplicate schema definitions
7. ❌ Don't include legacy functions in server files
8. ❌ Don't use custom/legacy UI components - use global ones

## Quick Checklist for New Module
- [ ] Server actions: GET listing, POST add/update, PUT toggle, DELETE delete
- [ ] Type: Add `IMaster[Module]List` to `types/hrms/hrms-config/master.ts` with camelCase keys
- [ ] Schema: Add `[module]MasterSchema` to `schemas/hrms/masters.ts`, exclude `mI_Id` and `ActiveFlag`
- [ ] Hook: Add `useMaster[Module]` to `hooks/hrms/useMasters.ts`, no `roleId` param
- [ ] Forms: Use global UI components, minimal payload (no IDs/auto-fields)
- [ ] Columns: Use camelCase `accessorKey`, `useFormContext` for actions
- [ ] Page: No `HRMS_MI_ID`, simplified search params, `FormProvider` with correct type
