'use client';

import { usePrevious } from '@/hooks/common';
import type React from 'react';
import { useEffect, useRef } from 'react';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    preserveValue?: boolean; // Whether to keep previous value visible during animation
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 1,
    decimals = 2,
    prefix = '',
    suffix = '',
    className = '',
    preserveValue = false
}) => {
    const countUpRef = useRef<any>(null);
    const previousValue = usePrevious(value);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (countUpRef.current) {
            countUpRef.current.update(value);
        }
    }, [value]);

    return (
        <div className={`inline-block ${className}`}>
            {preserveValue && previousValue !== undefined && <span className='sr-only'>{previousValue}</span>}
            <CountUp
                start={previousValue ?? 0}
                end={value}
                duration={duration}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                separator=','
                decimal='.'
            />
        </div>
    );
};

export default AnimatedCounter;
