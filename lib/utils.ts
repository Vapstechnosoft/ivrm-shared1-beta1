import { type ClassValue, clsx } from 'clsx';
import { add, addDays, differenceInSeconds, format, parse } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function exportToExcel(data: any, name?: string) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${name === null ? 'data' : name}.xlsx`);
}

export function safeNumber(value: any) {
    return Number.isNaN(Number(value)) ? 0 : Number(value);
}

// Helper function to get month name and date range
export function getMonthInfo(monthsBack: number) {
    const now = new Date();

    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    const targetMonth = currentMonth - monthsBack;
    const targetDate = new Date(Date.UTC(currentYear, targetMonth, 1));

    const year = targetDate.getUTCFullYear();
    const month = targetDate.getUTCMonth();

    const startDate = new Date(Date.UTC(year, month, 1));
    const endDate = new Date(Date.UTC(year, month + 1, 0));

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    return {
        key: monthNames[month].toLowerCase(),
        label: monthNames[month],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    };
}

export function numberToWords(num: number) {
    let number = num;
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (number === 0) return 'Zero';

    const convertLessThanOneThousand = (n: number): string => {
        if (n === 0) return '';
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ` ${units[n % 10]}` : '');
        return `${units[Math.floor(n / 100)]} Hundred${n % 100 !== 0 ? ` and ${convertLessThanOneThousand(n % 100)}` : ''}`;
    };

    const parts = [];
    if (Math.floor(number / 10000000) > 0) {
        parts.push(`${convertLessThanOneThousand(Math.floor(number / 10000000))} Crore`);
        number %= 10000000;
    }
    if (Math.floor(number / 100000) > 0) {
        parts.push(`${convertLessThanOneThousand(Math.floor(number / 100000))} Lakh`);
        number %= 100000;
    }
    if (Math.floor(number / 1000) > 0) {
        parts.push(`${convertLessThanOneThousand(Math.floor(number / 1000))} Thousand`);
        number %= 1000;
    }
    if (number > 0) {
        parts.push(convertLessThanOneThousand(number));
    }

    return `${parts.join(' ')} Rupees Only`;
}

// Plain number-to-words helper (no currency suffix). Used for year conversion.
export function numberToWordsPlain(num: number) {
    if (num === 0) return 'Zero';
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertLessThanOneThousand = (n: number): string => {
        let str = '';
        let remainder = n;
        if (remainder >= 100) {
            const h = Math.floor(remainder / 100);
            str += `${units[h]} Hundred`;
            remainder = remainder % 100;
            if (remainder > 0) str += ' ';
        }
        if (remainder >= 20) {
            const t = Math.floor(remainder / 10);
            str += tens[t];
            const u = remainder % 10;
            if (u) str += ` ${units[u]}`;
        } else if (remainder >= 10) {
            str += teens[remainder - 10];
        } else if (remainder > 0) {
            str += units[remainder];
        }
        return str;
    };

    const parts: string[] = [];
    let remaining = num;
    if (Math.floor(remaining / 10000000) > 0) {
        parts.push(`${convertLessThanOneThousand(Math.floor(remaining / 10000000))} Crore`);
        remaining %= 10000000;
    }
    if (Math.floor(remaining / 100000) > 0) {
        parts.push(`${convertLessThanOneThousand(Math.floor(remaining / 100000))} Lakh`);
        remaining %= 100000;
    }
    if (Math.floor(remaining / 1000) > 0) {
        parts.push(`${convertLessThanOneThousand(Math.floor(remaining / 1000))} Thousand`);
        remaining %= 1000;
    }
    if (remaining > 0) {
        parts.push(convertLessThanOneThousand(remaining));
    }

    return parts.join(' ').trim();
}

export const formatDBDate = (dateString: Date | null | undefined) => {
    if (dateString === undefined || dateString === null) return 'N.A';
    try {
        const dateWithOffset = add(new Date(dateString), { hours: 5, minutes: 30 });
        return format(dateWithOffset, 'dd-MMM-yyyy hh:mm a');
    } catch (_error) {
        return 'N.A';
    }
};

// Helper function to convert time string (HH:MM:SS or HH:MM) to minutes for comparison
export const timeToMinutes = (timeString: string | null | undefined): number => {
    if (!timeString || timeString.trim() === '') {
        return 0;
    }
    const timeParts = timeString.split(':').map(Number);
    const hours = timeParts[0] || 0;
    const minutes = timeParts[1] || 0;
    return hours * 60 + minutes;
};

// Helper function to format time for display
export const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString || timeString.trim() === '') {
        return '--:--:--';
    }
    return timeString; // Assuming it's already in HH:MM:SS format
};

export const getDuration = (start: string, end: string): string => {
    if (!start || !end) return '00:00:00';

    const startDate = parse(start, 'HH:mm:ss', new Date());
    let endDate = parse(end, 'HH:mm:ss', new Date());

    // If end time is before start time, add 1 day (overnight shift)
    if (endDate <= startDate) {
        endDate = addDays(endDate, 1);
    }

    const totalSeconds = differenceInSeconds(endDate, startDate);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Calculates the age difference between two dates.
 *
 * @param fromDate - The starting date (e.g., birth date)
 * @param toDate - The end date (default: today)
 * @returns An object containing:
 *   - years: number
 *   - months: number
 *   - days: number
 *   - ageString: formatted string (e.g. "5 years, 2 months, 3 days")
 *   - ageInYears: integer (e.g. 5)
 */
export function calculateAge(fromDate: Date, toDate: Date = new Date()) {
    if (!(fromDate instanceof Date) || Number.isNaN(fromDate.getTime())) {
        throw new Error('Invalid fromDate provided');
    }

    if (!(toDate instanceof Date) || Number.isNaN(toDate.getTime())) {
        throw new Error('Invalid toDate provided');
    }

    // Ensure fromDate is not in the future
    if (fromDate > toDate) {
        throw new Error('fromDate cannot be after toDate');
    }

    let years = toDate.getFullYear() - fromDate.getFullYear();
    let months = toDate.getMonth() - fromDate.getMonth();
    let days = toDate.getDate() - fromDate.getDate();

    // Adjust if the current month/day is before the birth month/day
    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Format readable string
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

    const ageString = parts.join(', ') || '0 days';

    return {
        years,
        months,
        days,
        ageInYears: years,
        ageString
    };
}

//Age calculated Example:

// utils/dateUtils.ts

/**
 * Convert a number to words (0-99)
 */

/**
 * Convert date to words format
 * Example: 15/03/2010 -> "Fifteenth March Two Thousand Ten"
 */
export const dateToWords = (date: Date): string => {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    // Convert day to ordinal words
    const dayWords = (() => {
        const ones = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth'];
        const teens = [
            'Tenth',
            'Eleventh',
            'Twelfth',
            'Thirteenth',
            'Fourteenth',
            'Fifteenth',
            'Sixteenth',
            'Seventeenth',
            'Eighteenth',
            'Nineteenth'
        ];
        const tens = ['', '', 'Twentieth', 'Thirtieth'];
        const tensRegular = ['', '', 'Twenty', 'Thirty'];

        if (day < 10) return ones[day];
        if (day < 20) return teens[day - 10];
        if (day === 20 || day === 30) return tens[Math.floor(day / 10)];

        const ten = Math.floor(day / 10);
        const one = day % 10;
        return `${tensRegular[ten]} ${ones[one]}`;
    })();

    // Convert year to words
    const yearWords = (() => {
        if (year < 2000) {
            const thousands = Math.floor(year / 1000);
            const remainder = year % 1000;
            const hundreds = Math.floor(remainder / 100);
            const lastTwo = remainder % 100;

            let result = `${numberToWordsPlain(thousands)} Thousand`;
            if (hundreds > 0) {
                result += ` ${numberToWordsPlain(hundreds)} Hundred`;
            }
            if (lastTwo > 0) {
                result += ` ${numberToWordsPlain(lastTwo)}`;
            }
            return result;
        }
        // For years 2000 and beyond
        const thousands = Math.floor(year / 1000);
        const remainder = year % 1000;

        let result = `${numberToWordsPlain(thousands)} Thousand`;
        if (remainder > 0) {
            result += ` ${numberToWordsPlain(remainder)}`;
        }
        return result;
    })();

    return `${dayWords} ${month} ${yearWords}`;
};

/**
 * Calculate age from date of birth
 * Returns age in years
 */

/**
 * Format age as "X Years"
 */
export const formatAge = (age: any): string => {
    // Accept either a number (years) or the object returned by calculateAge
    const years = typeof age === 'number' ? age : typeof age === 'object' && age !== null ? age.ageInYears : 0;
    if (!years || years === 0) return '';
    return `${years} Year${years !== 1 ? 's' : ''}`;
};
