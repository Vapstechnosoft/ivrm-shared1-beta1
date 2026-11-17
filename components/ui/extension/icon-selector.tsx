'use client';

import { Button } from '@/components/ui/button';
import { FormError } from '@/components/ui/extension/field';
import { InputText } from '@/components/ui/extension/input-text';
import { getIconByName, iconCategories, lucideIcons } from '@/lib/lucide-icon-registry';
import { cn } from '@/lib/utils';
import { ChevronDown, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface IconSelectorProps {
    label?: string;
    value?: string;
    onChange: (iconName: string) => void;
    required?: boolean;
    error?: string;
    placeholder?: string;
}

export function IconSelector({ label, value, onChange, required, error, placeholder = 'Select an icon' }: IconSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Filter icons based on search term and category
    const filteredIcons = useMemo(() => {
        let filtered = lucideIcons;

        if (selectedCategory !== 'all') {
            filtered = filtered.filter((icon) => icon.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter((icon) => icon.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return filtered;
    }, [searchTerm, selectedCategory]);

    const selectedIcon = value ? getIconByName(value) : null;
    const SelectedIconComponent = selectedIcon;

    const handleIconSelect = (iconName: string) => {
        onChange(iconName);
        setIsOpen(false);
        setSearchTerm('');
        setSelectedCategory('all');
    };

    const clearSelection = () => {
        onChange('');
    };

    return (
        <div className='group flex flex-col gap-1.5'>
            {label && (
                <label htmlFor='icon-selector-button' className='font-medium text-foreground text-sm'>
                    {label}
                    {required && <span className='ml-1 text-destructive'>*</span>}
                </label>
            )}

            <div className='relative'>
                <Button
                    id='icon-selector-button'
                    type='button'
                    variant='outline'
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'h-10 w-full justify-between px-3 py-2 text-left font-normal',
                        !value && 'text-muted-foreground',
                        error && 'border-destructive focus-visible:ring-destructive'
                    )}>
                    <div className='flex items-center gap-2'>
                        {SelectedIconComponent && <SelectedIconComponent className='h-4 w-4' />}
                        <span className='truncate'>{value || placeholder}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        {value && (
                            <div
                                className='flex h-4 w-4 cursor-pointer items-center justify-center rounded p-0 hover:bg-destructive hover:text-destructive-foreground'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearSelection();
                                }}>
                                <X className='h-3 w-3' />
                            </div>
                        )}
                        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                    </div>
                </Button>

                {isOpen && (
                    <div className='absolute top-full right-0 left-0 z-50 mt-1 rounded-md border bg-popover shadow-lg'>
                        <div className='border-b p-3'>
                            <div className='relative mb-3'>
                                <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground' />
                                <InputText
                                    placeholder='Search icons...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='pl-9'
                                />
                            </div>

                            <div className='flex flex-wrap gap-1'>
                                <Button
                                    type='button'
                                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                    size='sm'
                                    onClick={() => setSelectedCategory('all')}
                                    className='h-7 px-2 text-xs'>
                                    All
                                </Button>
                                {Object.entries(iconCategories).map(([key, label]) => (
                                    <Button
                                        key={key}
                                        type='button'
                                        variant={selectedCategory === key ? 'default' : 'outline'}
                                        size='sm'
                                        onClick={() => setSelectedCategory(key)}
                                        className='h-7 px-2 text-xs'>
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className='max-h-64 overflow-y-auto p-2'>
                            {filteredIcons.length === 0 ? (
                                <div className='py-6 text-center text-muted-foreground text-sm'>No icons found</div>
                            ) : (
                                <div className='grid grid-cols-6 gap-1 sm:grid-cols-8 md:grid-cols-10'>
                                    {filteredIcons.map((iconOption) => {
                                        const IconComponent = iconOption.icon;
                                        return (
                                            <Button
                                                key={iconOption.name}
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleIconSelect(iconOption.name)}
                                                className={cn('h-10 w-10 p-2 hover:bg-accent', value === iconOption.name && 'bg-accent')}
                                                title={iconOption.name}>
                                                <IconComponent className='h-4 w-4' />
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <FormError>{error}</FormError>}
        </div>
    );
}
