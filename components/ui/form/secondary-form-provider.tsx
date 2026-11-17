'use client';

import { type ReactNode, createContext, useCallback, useContext, useRef, useState } from 'react';

interface SecondaryFormContextType<T = any> {
    isAddFormOpen: boolean;
    isEditFormOpen: boolean;
    selectedRow: T | null;

    openAddForm: () => void;
    closeAddForm: () => void;

    openEditForm: (row: T) => void;
    closeEditForm: () => void;

    closeAllForms: () => void;

    addFormRef: React.RefObject<HTMLDivElement>;
    editFormRef: React.RefObject<HTMLDivElement>;
}

const SecondaryFormContext = createContext<SecondaryFormContextType | null>(null);

interface SecondaryFormProviderProps {
    children: ReactNode;
}

export function SecondaryFormProvider<T = any>({ children }: SecondaryFormProviderProps) {
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<T | null>(null);

    const addFormRef = useRef<HTMLDivElement>(null);
    const editFormRef = useRef<HTMLDivElement>(null);

    const closeAllForms = useCallback(() => {
        setIsAddFormOpen(false);
        setIsEditFormOpen(false);
        setSelectedRow(null);
    }, []);

    const openAddForm = useCallback(() => {
        setIsAddFormOpen(true);
        setIsEditFormOpen(false);
    }, []);

    const closeAddForm = useCallback(() => {
        setIsAddFormOpen(false);
    }, []);

    const openEditForm = useCallback((row: T) => {
        setSelectedRow(row);
        setIsEditFormOpen(true);
    }, []);

    const closeEditForm = useCallback(() => {
        setIsEditFormOpen(false);
        setSelectedRow(null);
    }, []);

    return (
        <SecondaryFormContext.Provider
            value={{
                isAddFormOpen,
                isEditFormOpen,
                selectedRow,
                openAddForm,
                closeAddForm,
                openEditForm,
                closeEditForm,
                closeAllForms,
                addFormRef,
                editFormRef
            }}>
            {children}
        </SecondaryFormContext.Provider>
    );
}

export function useSecondaryFormContext<T = any>() {
    const context = useContext(SecondaryFormContext) as SecondaryFormContextType<T> | null;
    if (!context) {
        throw new Error('useSecondaryFormContext must be used inside SecondaryFormProvider');
    }
    return context;
}
