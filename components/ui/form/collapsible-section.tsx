import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

interface CollapsibleSectionProps {
    title?: ReactNode;
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
    isOpen?: boolean;
    onToggle?: () => void;
    rightElement?: ReactNode;
    icon?: ReactNode;
}

export function CollapsibleSection({
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
    rightElement,
    icon
}: CollapsibleSectionProps) {
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

    return (
        <Collapsible open={isOpen} onOpenChange={handleOpenChange} className={className}>
            <Card className={`${variantClasses[variant]} transition-all duration-200 ${className}`}>
                <CollapsibleTrigger asChild>
                    <div className='w-full' role='button' tabIndex={0}>
                        <CardHeader
                            className={`flex cursor-pointer flex-row items-center justify-between transition-colors duration-200 hover:bg-muted/50 ${compactHeader} ${headerClassName}
                        `}>
                            {icon && <div className='mr-3 text-muted-foreground'>{icon}</div>}
                            {(title || description) && (
                                <div className='space-y-1'>
                                    {title && <div className={`font-semibold tracking-tight ${sizeClasses[size]}`}>{title}</div>}
                                    {description && <p className='text-muted-foreground text-sm'>{description}</p>}
                                </div>
                            )}
                            <div className='ml-auto flex items-center gap-2'>
                                {rightElement && <div onClick={(e) => e.stopPropagation()}>{rightElement}</div>}
                                <div className='flex h-8 w-8 items-center justify-center rounded-md transition-colors'>
                                    <ChevronRight
                                        className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                    </div>
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
