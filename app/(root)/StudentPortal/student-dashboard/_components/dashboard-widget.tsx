import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface DashboardWidgetProps {
    title: string;
    icon: React.ReactNode;
    colorClass: string; // e.g. "bg-green-500"
    children?: React.ReactNode;
    footerText?: string;
    onViewClick?: () => void;
}

export function DashboardWidget({ title, icon, colorClass, children, footerText, onViewClick }: DashboardWidgetProps) {
    // Helper to get text color based on bg color (simple mapping or convention)
    // The legacy code uses classes like "text-c-blue" for the title.
    // We'll use the same color class but replace 'bg-' with 'text-' for the title if it follows standard Tailwind patterns,
    // or just default to a standard dark blue/gray if not perfectly matchable.

    // Legacy style: Icon is floating on the left/top-left, content is right aligned.

    const textColorClass = colorClass.replace('bg-', 'text-');

    return (
        <div className="relative pt-8 md:pt-10">
            <Card className="relative overflow-visible shadow-md border-0 rounded-lg">
                <div className="p-4 pt-8 md:pt-8 min-h-[140px] flex flex-col justify-between">

                    {/* Floating Icon */}
                    <div className={cn(
                        "absolute -top-6 left-4 h-16 w-16 rounded-md flex items-center justify-center text-white shadow-lg",
                        colorClass
                    )}>
                        {/* Render icon with a specific size */}
                        <div className="[&>svg]:w-8 [&>svg]:h-8">
                            {icon}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="text-right space-y-2">
                        <span className={cn("font-bold text-lg uppercase tracking-wide", textColorClass)}>
                            {title}
                        </span>

                        <div className="mt-2 text-slate-600 dark:text-slate-300">
                            {/* Children content (Name, Fees, etc.) */}
                            {children}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                {footerText && (
                    <div
                        className="border-t bg-slate-50 dark:bg-zinc-900/50 px-4 py-3 flex items-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                        onClick={onViewClick}
                    >
                        <span className={cn("text-xs font-bold uppercase", textColorClass)}>
                            {icon}
                        </span>
                        <span className="text-xs font-bold uppercase flex-1">
                            {footerText}
                        </span>
                        <div className="bg-slate-200 dark:bg-slate-700 rounded-full p-1">
                            <ArrowRight className="h-3 w-3" />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
