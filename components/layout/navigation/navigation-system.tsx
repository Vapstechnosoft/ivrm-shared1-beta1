'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserAccessibleModules } from '@/hooks/common';
import { getIconByName } from '@/lib/lucide-icon-registry';
import { cn } from '@/lib/utils';
import type { IUserAccessibleModules } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, X, Settings, BarChart3, ReceiptText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getNavigationContext, setNavigationContext } from './navigation-context';

// Helper function to get icon with fallback for known module names
const getIconWithFallback = (iconName: string | null | undefined, moduleName: string): any => {
    if (iconName) {
        const icon = getIconByName(iconName);
        if (icon) return icon;
    }

    // Fallback icons for known modules
    const fallbackIcons: Record<string, any> = {
        'HRMS Config': Settings,
        'HRMS Config Report': Settings,
        'Reports': BarChart3,
        'Report': BarChart3,
        'Transactions': ReceiptText,
        'Transaction': ReceiptText
    };

    return fallbackIcons[moduleName] || null;
};

interface SubMenu {
    id: number;
    name: string;
    icon: string;
    pages: {
        id: number;
        name: string;
        icon: string;
        url: string;
        title?: string;
        description?: string;
    }[];
}

interface Menu {
    id: number;
    name: string;
    icon: string;
    sub_menu: SubMenu[];
}

export interface ActiveNavigation {
    module: string;
    menu: string;
    subMenu: string;
    pages: SubMenu['pages'];
    title?: string;
    description?: string;
}

export function NavigationSystem() {
    const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const { data: accessibleModule } = useUserAccessibleModules();

    const handleModuleClick = (moduleName: string) => {
        if (activeDrawer === moduleName) {
            setActiveDrawer(null);
        } else {
            setActiveDrawer(moduleName);
            setActiveModule(moduleName);
        }
    };

    const handleSubMenuClick = (module: IUserAccessibleModules, menu: Menu, subMenu: SubMenu) => {
        const firstPageUrl = subMenu.pages[0]?.url;
        if (firstPageUrl) {
            const firstPage = subMenu.pages[0];
            const navData = {
                module: module.name,
                menu: menu.name,
                subMenu: subMenu.name,
                pages: subMenu.pages,
                title: firstPage?.title || '',
                description: firstPage?.description || ''
            };
            setNavigationContext(navData);

            if (typeof window !== 'undefined') {
                sessionStorage.setItem('activeNavigation', JSON.stringify(navData));
            }

            setActiveDrawer(null);
            setActiveModule(module.name);
            router.push(firstPageUrl);
        }
    };

    // Close drawer on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.navigation-drawer') && !target.closest('.nav-button')) {
                setActiveDrawer(null);
                setActiveModule(null);
            }
        };

        if (activeDrawer) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeDrawer]);

    useEffect(() => {
        // Restore navigation context from sessionStorage on mount
        if (typeof window !== 'undefined') {
            const savedNav = sessionStorage.getItem('activeNavigation');
            if (savedNav) {
                try {
                    const navData = JSON.parse(savedNav);
                    setNavigationContext(navData);
                    setActiveModule(navData.module);
                } catch (e) {
                    console.error('Failed to restore navigation context', e);
                }
            }
        }
    }, []);

    // Auto-sync navigation context with current URL
    useEffect(() => {
        if (!accessibleModule?.data || !pathname || pathname === '/') return;

        const currentNav = getNavigationContext().activeNavigation;

        // If current navigation already contains this page, just ensure module is active
        if (currentNav?.pages?.some(p => p.url === pathname)) {
            if (activeModule !== currentNav.module) {
                setActiveModule(currentNav.module);
            }
            return;
        }

        // Search for the page in all modules to sync context
        for (const module of accessibleModule.data) {
            for (const menu of module.menu) {
                for (const subMenu of menu.sub_menu) {
                    const matchedPage = subMenu.pages.find(p => p.url === pathname);
                    if (matchedPage) {
                        const navData: ActiveNavigation = {
                            module: module.name,
                            menu: menu.name,
                            subMenu: subMenu.name,
                            pages: subMenu.pages,
                            title: matchedPage.title || '',
                            description: matchedPage.description || ''
                        };
                        setNavigationContext(navData);
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('activeNavigation', JSON.stringify(navData));
                        }
                        setActiveModule(module.name);
                        return;
                    }
                }
            }
        }
    }, [accessibleModule, pathname, activeModule]);

    if (activeModule !== null && activeDrawer === null && (pathname === '/' || pathname === null)) {
        setActiveDrawer(null);
        setActiveModule(null);
        return null;
    }

    return (
        <div className='flex flex-1 items-center justify-start overflow-hidden'>
            <div className='w-[100%] overflow-hidden'>
                <nav className='flex items-center overflow-x-auto py-2 scroll-smooth'>
                    <div className='flex items-center space-x-1 min-w-max'>
                        {accessibleModule?.data?.map((module) => {
                            const IconComponent = getIconByName(module.icon);
                            const isActive = activeModule === module.name;

                            return (
                                <Button
                                    key={module.id}
                                    variant={isActive ? 'default' : 'ghost'}
                                    className={cn(
                                        'nav-button inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200',
                                        'hover:bg-accent hover:text-accent-foreground',
                                        isActive && 'bg-primary text-primary-foreground shadow-md'
                                    )}
                                    onClick={() => handleModuleClick(module.name)}>
                                    {IconComponent && <IconComponent className='h-4 w-4' />}
                                    <span className='font-medium whitespace-nowrap'>{module.name}</span>
                                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isActive && 'rotate-180')} />
                                </Button>
                            );
                        })}
                    </div>
                </nav>
            </div>

            {/* Dropdown Drawer */}
            <AnimatePresence>
                {activeDrawer && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 z-40 bg-black/20'
                            onClick={() => setActiveDrawer(null)}
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className='navigation-drawer absolute top-full right-0 left-0 z-50 mx-4 mt-2 rounded-2xl border bg-card shadow-2xl'>
                            <div className='max-h-[70vh] flex flex-col'>
                                {/* Header */}
                                <div className='flex items-center justify-between border-b p-6'>
                                    <h3 className='font-semibold text-foreground text-lg'>{activeDrawer} Modules</h3>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => setActiveDrawer(null)}
                                        className='h-8 w-8 p-0 hover:bg-accent'>
                                        <X className='h-4 w-4' />
                                    </Button>
                                </div>

                                {/* Scrollable content area */}
                                <div className='flex flex-1 overflow-hidden'>
                                    {/* Main content with vertical scroll */}
                                    <div className='flex-1 overflow-y-auto p-6'>
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                            {accessibleModule?.data
                                                ?.find((m) => m.name === activeDrawer)
                                                ?.menu.map((menu) => (
                                                    <Card key={menu.id} className='transition-shadow duration-200 hover:shadow-md'>
                                                        <CardContent className='p-4'>
                                                            <div className='mb-3 flex items-center gap-3'>
                                                                {(() => {
                                                                    const MenuIcon = getIconWithFallback(menu.icon, menu.name);
                                                                    return MenuIcon ? (
                                                                        <div className='rounded-lg bg-primary/10 p-2'>
                                                                            <MenuIcon className='h-4 w-4 text-primary' />
                                                                        </div>
                                                                    ) : null;
                                                                })()}
                                                                <h4 className='font-medium text-foreground'>{menu.name}</h4>
                                                            </div>

                                                            {/* Submenu items with vertical scroll if needed */}
                                                            <div className='max-h-48 space-y-2 overflow-y-auto pr-2'>
                                                                {menu.sub_menu.map((subMenu) => {
                                                                    const SubMenuIcon = getIconWithFallback(subMenu.icon, subMenu.name);
                                                                    return (
                                                                        <Button
                                                                            key={subMenu.id}
                                                                            variant='ghost'
                                                                            className='h-auto w-full justify-start p-2 text-sm hover:bg-accent/50'
                                                                            onClick={() =>
                                                                                handleSubMenuClick(
                                                                                    accessibleModule?.data?.find((m) => m.name === activeDrawer)!,
                                                                                    menu,
                                                                                    subMenu
                                                                                )
                                                                            }>
                                                                            <div className='flex items-center gap-2'>
                                                                                {SubMenuIcon && <SubMenuIcon className='h-3 w-3' />}
                                                                                <span className='truncate'>{subMenu.name}</span>
                                                                                <span className='ml-auto text-muted-foreground text-xs whitespace-nowrap'>
                                                                                    ({subMenu.pages.length} pages)
                                                                                </span>
                                                                            </div>
                                                                        </Button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Sidebar image - fixed, not scrollable */}
                                    <div className='hidden lg:flex w-[250px] flex-shrink-0 items-center justify-center border-l p-6'>
                                        <img
                                            src='/assets/student_academic.png'
                                            alt='Hero Illustration'
                                            className='max-h-full max-w-full object-contain'
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Custom scrollbar styling */}
            <style jsx global>{`
                /* Custom scrollbar styling for the entire component */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 3px;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }

                /* For Firefox */
                .overflow-y-auto {
                    scrollbar-width: thin;
                    scrollbar-color: #c1c1c1 transparent;
                }

                /* Horizontal scroll for main nav */
                nav.overflow-x-auto::-webkit-scrollbar {
                    height: 4px;
                }

                nav.overflow-x-auto::-webkit-scrollbar-track {
                    background: transparent;
                }

                nav.overflow-x-auto::-webkit-scrollbar-thumb {
                    background: #d4d4d4;
                    border-radius: 2px;
                }

                nav.overflow-x-auto::-webkit-scrollbar-thumb:hover {
                    background: #a3a3a3;
                }
            `}</style>
        </div>
    );
}