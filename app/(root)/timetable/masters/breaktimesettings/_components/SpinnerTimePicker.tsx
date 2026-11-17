'use client';

import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SpinnerTimePickerProps {
    value?: Date;
    onChange: (date: Date) => void;
}

export function SpinnerTimePicker({ value, onChange }: SpinnerTimePickerProps) {
    const date = value ?? new Date();

    let hour = date.getHours();
    const minute = date.getMinutes();
    const isPM = hour >= 12;

    hour = hour % 12 || 12;

    const updateTime = (h: number, m: number, pm: boolean) => {
        const d = new Date(date);
        let newHour = h % 12;
        if (pm) newHour += 12;
        d.setHours(newHour);
        d.setMinutes(m);
        onChange(d);
    };

    return (
        <div className='flex items-center gap-3'>
            {/* Hour */}
            <TimeColumn>
                <ArrowUp onClick={() => updateTime(hour === 12 ? 1 : hour + 1, minute, isPM)} />
                <InputBox value={hour} max={12} onChange={(v) => updateTime(v || 1, minute, isPM)} />
                <ArrowDown onClick={() => updateTime(hour === 1 ? 12 : hour - 1, minute, isPM)} />
            </TimeColumn>

            {/* Minute */}
            <TimeColumn>
                <ArrowUp onClick={() => updateTime(hour, (minute + 1) % 60, isPM)} />
                <InputBox value={minute} max={59} pad onChange={(v) => updateTime(hour, v ?? 0, isPM)} />
                <ArrowDown onClick={() => updateTime(hour, (minute + 59) % 60, isPM)} />
            </TimeColumn>

            {/* AM / PM */}
            <TimeColumn>
                <ArrowUp onClick={() => updateTime(hour, minute, !isPM)} />
                <Input
                    value={isPM ? 'PM' : 'AM'}
                    readOnly
                    className='w-14 cursor-pointer text-center font-semibold'
                    onClick={() => updateTime(hour, minute, !isPM)}
                />
                <ArrowDown onClick={() => updateTime(hour, minute, !isPM)} />
            </TimeColumn>
        </div>
    );
}

/* ---------- Helpers ---------- */

function TimeColumn({ children }: { children: React.ReactNode }) {
    return <div className='flex flex-col items-center gap-1'>{children}</div>;
}

function ArrowUp({ onClick }: { onClick: () => void }) {
    return <ChevronUp className='h-4 w-4 cursor-pointer text-gray-600' onClick={onClick} />;
}

function ArrowDown({ onClick }: { onClick: () => void }) {
    return <ChevronDown className='h-4 w-4 cursor-pointer text-gray-600' onClick={onClick} />;
}

function InputBox({
    value,
    max,
    pad,
    onChange
}: {
    value: number;
    max: number;
    pad?: boolean;
    onChange: (v?: number) => void;
}) {
    return (
        <Input
            type='text'
            value={pad ? value.toString().padStart(2, '0') : value}
            min={0}
            max={max}
            onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isNaN(v)) return;
                if (v > max) return;
                onChange(v);
            }}
            className='w-14 text-center font-semibold'
        />
    );
}
