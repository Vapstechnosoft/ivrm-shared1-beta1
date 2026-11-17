import { InteractionTabs } from './_components/interaction-tabs';
import { getInteractionLoadData } from './actions';
import { Loader2 } from 'lucide-react';

export default async function InteractionsPage() {
    // Fetch initial data
    console.log("Rendering Interactions Page");
    let initialData = null;
    let error = null;

    try {
        initialData = await getInteractionLoadData({});
    } catch (e) {
        console.error("Failed to load interaction data", e);
        error = "Failed to load data. Please try again later.";
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!initialData) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <InteractionTabs initialData={initialData} />
        </div>
    );
}
