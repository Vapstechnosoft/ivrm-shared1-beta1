'use client';

import { Button } from '@/components/ui/button';
import { GenericDataTable, useDataTableProps } from '@/components/ui/data-table/generic-data-table';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { FormProvider, useFormContext } from '@/components/ui/form/form-provider';
import type { IHallTicketGeneratedItem } from '@/types/exam/exam-module/exam-mapping';
import { Plus, X } from 'lucide-react';
import { use } from 'react';
import { HallTicketGeneratedColumns } from './_components/columns';
import AddHallTicketGenerated from './_components/add-form';
import { useHallTicketGeneratedList } from '@/hooks/exam/exammodule/exam-mapping';
import AddExamHallTicketGeneration from './_components/add-form';
import HallTicketGeneratedDetailsPage from './_components/hallticket-generation-details';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// -------------------------
// MAIN PAGE
// -------------------------
export default function HallTicketGeneratedPage(props: { searchParams: SearchParams }) {
    const searchParams = use(props.searchParams);
    const { data: response, isLoading, error } = useHallTicketGeneratedList(searchParams);

    return (
        <FormProvider<IHallTicketGeneratedItem>>
            <HallTicketGeneratedPageContent
                response={response}
                isLoading={isLoading}
                error={error}
            />
        </FormProvider>
    );
}

// -------------------------
// PAGE CONTENT
// -------------------------
function HallTicketGeneratedPageContent({
    response,
    isLoading,
    error
}: {
    response: any;
    isLoading: boolean;
    error: any;
}) {
    const { openAddForm } = useFormContext<IHallTicketGeneratedItem>();
    const tableProps = useDataTableProps(response);

    return (
        <div className="min-h-screen">
            <div className="container space-y-4 p-1">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-self-end">
                    <Button
                        type="button"
                        onClick={openAddForm}
                        className="w-fit shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Hall Ticket Generation
                    </Button>
                </div>

                {/* GRID */}
                <CollapsibleSection
                    defaultOpen={true}
                    variant="default"
                    size="lg"
                    className="shadow-lg transition-shadow duration-300 hover:shadow-xl"
                >
                    <GenericDataTable<IHallTicketGeneratedItem>
                        {...tableProps}
                        columns={HallTicketGeneratedColumns}
                        isLoading={isLoading}
                        error={error}
                        columnPinning={{ right: ['actions'] }}
                        loadingMessage="Loading hall ticket data..."
                        noDataTitle="No Hall Ticket Records Found"
                        noDataDescription="Click Add to generate a new record."
                        errorTitle="Error Loading Hall Ticket Generated List"
                    />
                </CollapsibleSection>

                <FormSections />
            </div>
        </div>
    );
}

// -------------------------
// FORM SECTIONS
// -------------------------
function FormSections() {
    const {
        isAddFormOpen,
        isDetailsViewOpen,
        selectedRow,
        closeAddForm,
        closeDetailsView,
        addFormRef
    } = useFormContext<IHallTicketGeneratedItem>();

    return (
        <>
            {/* ADD FORM */}
            {isAddFormOpen && (
                <div ref={addFormRef}>
                    <CollapsibleSection
                        title="Generate Hall Ticket"
                        description="Fill in the details to generate hall ticket"
                        defaultOpen={true}
                        variant="outline"
                        size="md"
                        className="slide-in-from-top-4 animate-in shadow-lg duration-300"
                    >
                        <div className="relative">
                            <Button
                                type="button"
                                onClick={closeAddForm}
                                variant="ghost"
                                size="sm"
                                className="-top-[3.5rem] absolute right-12 w-fit border p-2 shadow-md hover:bg-destructive/10"
                            >
                                <X className="h-4 w-4 text-destructive" /> Close
                            </Button>

                            <AddExamHallTicketGeneration onSuccess={closeAddForm} />
                        </div>
                    </CollapsibleSection>
                </div>
            )}

            {isDetailsViewOpen && selectedRow && <HallTicketGeneratedDetailsPage rowData={selectedRow} onClose={closeDetailsView} />}
        </>
    );
}
