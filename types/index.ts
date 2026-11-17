import type { Role } from '@/constants';

export interface Option {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    count?: number;
}

export interface CalculatedAgeDetails {
    years: number;
    months: number;
    days: number;
    ageInYears: number;
    ageString: string;
}

export interface DataTableFilterField<TData> {
    id: keyof TData;
    label: string;
    placeholder?: string;
    options?: Option[];
}

export type UserResponseData = {
    mi_id: number;
    name: string;
    email: string;
    token: string;
    user: string;
    role: Role;
    roleId?: number;
    designation: string;
    user_image: string | null;
    [key: string]: any;
};

export type ApiSearchparams = {
    page?: number;
    page_size?: number;
    search_query?: string;
    search_column?: string;
    sort_column?: string;
    sort_direction?: string;
    search_columns?: string;
};

export interface IDropdown {
    id: number;
    code: string;
    name: string;
    isSelected?: boolean;
    mapping_order?: number;
    drop_down_name?: string;
    [key: string]: any;
}

export interface UserNotification {
    id: number;
    user_code: string;
    user_name: string;
    title: string;
    message: string;
    link?: string | null;
    created_timestamp: string;
    priority: string;
}

export interface IUserAccessibleModules {
    id: number;
    name: string;
    icon: string;
    menu: AccessibleMenu[];
}

export interface AccessibleMenu {
    id: number;
    name: string;
    icon: string;
    sub_menu: AccessibleSubMenu[];
}

export interface AccessibleSubMenu {
    id: number;
    name: string;
    icon: string;
    pages: AccessiblePage[];
}

export interface AccessiblePage {
    id: number;
    name: string;
    icon: string;
    url: string;
    title?: string;
    description?: string;
}
