'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CollapsibleSection } from '@/components/ui/form/collapsible-section';
import { ChevronRight } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
interface HRMSCollapsibleSectionProps {
    title?: string;
    description?: string;
    children: ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    keepContentMounted?: boolean;
    closeButton?: ReactNode;
}
/**
 * HRMS-specific CollapsibleSection wrapper that adds close button support
 * This component is only for HRMS attendance management masters to avoid affecting other modules
 * The close button is positioned in the header next to the chevron icon
 */
export function HRMSCollapsibleSection({
    title,
    description,
    children,
    defaultOpen = false,
    onOpenChange,
    className = '',
    headerClassName = '',
    contentClassName = '',
    variant = 'default',
    size = 'md',
    keepContentMounted = true,
    closeButton
}: HRMSCollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [hasBeenOpened, setHasBeenOpened] = useState(defaultOpen);
    useEffect(() => {
        if (isOpen && !hasBeenOpened) {
            setHasBeenOpened(true);
        }
    }, [isOpen, hasBeenOpened]);
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        onOpenChange?.(open);
    };
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };
    const variantClasses = {
        default: 'border shadow-sm',
        ghost: 'border-0 shadow-none',
        outline: 'border-2 shadow-none'
    };
    // Compact header when no title/description
    const compactHeader = !title && !description ? 'py-2' : 'py-4';
    // If no close button, use the standard CollapsibleSection
    if (!closeButton) {
        return (
            <CollapsibleSection
                title={title}
                description={description}
                defaultOpen={defaultOpen}
                onOpenChange={onOpenChange}
                className={className}
                headerClassName={headerClassName}
                contentClassName={contentClassName}
                variant={variant}
                size={size}
                keepContentMounted={keepContentMounted}>
                {children}
            </CollapsibleSection>
        );
    }
    // Custom implementation with close button in header
    return (
        <Collapsible open={isOpen} onOpenChange={handleOpenChange} className={className}>
            <Card className={`${variantClasses[variant]} transition-all duration-200 ${className}`}>
                <CollapsibleTrigger asChild>
                    <CardHeader
                        className={`flex cursor-pointer flex-row items-center justify-between transition-colors duration-200 hover:bg-muted/50 ${compactHeader} ${headerClassName}
                        `}>
                        {(title || description) && (
                            <div className='space-y-1'>
                                {title && <h3 className={`font-semibold tracking-tight ${sizeClasses[size]}`}>{title}</h3>}
                                {description && <p className='text-muted-foreground text-sm'>{description}</p>}
                            </div>
                        )}
                        <div className='ml-auto flex items-center gap-2'>
                            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                                {closeButton}
                            </div>
                            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                                <ChevronRight
                                    className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                                />
                            </Button>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent
                    className='transition-all duration-200 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
                    forceMount={true}
                    style={keepContentMounted && !isOpen ? { display: 'none' } : undefined}>
                    <CardContent className={`pt-0 ${contentClassName}`}>{children}</CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
