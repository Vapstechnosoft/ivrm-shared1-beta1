import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80 dark:bg-primary-dark dark:text-primary-dark-foreground dark:hover:bg-primary-dark/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary-dark dark:text-secondary-dark-foreground dark:hover:bg-secondary-dark/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 dark:bg-destructive-dark dark:text-destructive-dark-foreground dark:hover:bg-destructive-dark/80',
                outline: 'text-foreground dark:text-foreground-dark',
                success: 'border-transparent bg-green-500 text-white shadow hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800',
                warning:
                    'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700',
                info: 'border-transparent bg-blue-500 text-white shadow hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800',
                purple: 'border-transparent bg-purple-500 text-white shadow hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800',
                pink: 'border-transparent bg-pink-500 text-white shadow hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800',
                indigo: 'border-transparent bg-indigo-500 text-white shadow hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-800',
                teal: 'border-transparent bg-teal-500 text-white shadow hover:bg-teal-600 dark:bg-teal-700 dark:hover:bg-teal-800',
                orange: 'border-transparent bg-orange-500 text-white shadow hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-800',
                brown: 'border-transparent bg-amber-700 text-white shadow hover:bg-amber-800 dark:bg-amber-800 dark:hover:bg-amber-900',
                gray: 'border-transparent bg-gray-500 text-white shadow hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700'
            },
            size: {
                default: 'h-6 text-xs',
                sm: 'h-5 text-[10px]',
                lg: 'h-7 text-sm'
            },
            shape: {
                default: 'rounded-md',
                pill: 'rounded-full',
                square: 'rounded-none'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            shape: 'default'
        }
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, shape, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant, size, shape }), className)} {...props} />;
}

export { Badge, badgeVariants };
