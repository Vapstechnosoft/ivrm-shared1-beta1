import { Bar, BarChart, CartesianGrid, Legend, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const getMonthName = (monthNumber: number) => {
    return new Date(0, monthNumber - 1).toLocaleString('en-US', {
        month: 'long'
    });
};

interface ReportItem {
    name: string;
    count?: number; // optional
    photo?: number;
    sms?: number;
    emailId?: number;
    phone?: number;
    online?: number;
    offline?: number;
    missingphoto?: number;
    missingemail?: number;
    missingphone?: number;
}

interface Props {
    reportData: ReportItem[];
    month: string;
    year: number;
    academicYear: number;
    implementationName: string;
}

export default function AdmissionMonthEndReport({ reportData, month, year, implementationName }: Props) {
    const todayDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const chartData = reportData.map((x) => ({
        name: x.name,
        count: x.count || 0
    }));

    return (
        <div className='w-full p-5 font-sans'>
            {/* HEADER */}
            <div className='mb-6 text-center'>
                <img src='/school-logo.png' alt='logo' className='mx-auto mb-3 w-[90px]' />

                <h2 className='m-0 font-bold text-lg'>VIDYA VIKASA PRIMARY / HIGHER PRIMARY AND HIGH SCHOOL</h2>

                <p className='m-0 text-sm leading-5'>
                    Basaveshwara Talkies Road, Mob: 7090808194, Tel: 08194 220904 <br />
                    Chitradurga - 577501, Karnataka
                </p>

                <h3 className='mt-5 mb-3 font-semibold text-base'>ADMISSION MODULE</h3>
                <h2 className='font-semibold text-base'>
                    <span className='font-bold text-xl'>{getMonthName(Number(month)).toUpperCase()} MONTH END REPORT</span>
                </h2>
            </div>

            {/* DETAILS */}
            <div className='mb-5 flex justify-between p-5 px-16'>
                <div>
                    <p className='mb-3'>
                        <span className='font-semibold'>Name:</span> {implementationName}
                    </p>
                    <p>
                        <span className='font-semibold'>Designation:</span> Implementation Engineer
                    </p>
                </div>

                <div>
                    <p className='mb-3'>
                        <span className='font-semibold'>Date:</span> {todayDate}
                    </p>
                    <p>
                        <span className='font-semibold'>Year:</span> {year}
                    </p>
                </div>
            </div>

            {/* TABLE SECTION */}
            <table className='mb-10 w-full border-collapse'>
                <thead>
                    <tr className='bg-blue-600 text-white'>
                        <th className='border p-2 text-sm'>SL.No</th>
                        <th className='border p-2 text-sm'>Name</th>
                        <th className='border p-2 text-sm'>Count</th>
                        <th className='border p-2 text-sm'>SMS Sent</th>
                        <th className='border p-2 text-sm'>Email Sent</th>
                        <th className='border p-2 text-sm'>Missing Photo</th>
                        <th className='border p-2 text-sm'>Missing Email</th>
                        <th className='border p-2 text-sm'>Missing Contact No</th>
                        <th className='border p-2 text-sm'>Online</th>
                        <th className='border p-2 text-sm'>Offline</th>
                    </tr>
                </thead>

                <tbody>
                    {reportData.map((item, idx) => (
                        <tr key={idx}>
                            <td className='border p-2 text-center text-sm'>{idx + 1}</td>
                            <td className='border p-2 text-center'>{item.name ?? '---'}</td>
                            <td className='border p-2 text-center text-sm'>{item.count ?? '-'}</td>
                            <td className='border p-2 text-center'>{item.sms ?? '---'}</td>

                            <td className='border p-2 text-center'>{item.emailId ?? '---'}</td>
                            <td className='border p-2 text-center text-sm'>{item.missingphoto ?? '---'}</td>
                            <td className='border p-2 text-center text-sm'>{item.missingphone ?? '---'}</td>
                            <td className='border p-2 text-center text-sm'>{item.missingemail ?? '---'}</td>
                            <td className='border p-2 text-center'>{item.online ?? '---'}</td>
                            <td className='border p-2 text-center'>{item.offline ?? '---'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* PAGE BREAK FOR PRINT */}
            <div className='page-break' />

            {/* CHART + SIGNATURE SECTION */}
            <div className='flex gap-8'>
                <div className='h-[300px] flex-1'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='name' />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey='count' fill='#3b82f6' />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className='flex-1 pt-12'>
                    <p className=' mb-3'>
                        <span className='font-semibold'>Implementation Engineer:</span> ________________
                    </p>
                    <p>
                        <span className='font-semibold'>Nodal Officer:</span> ________________
                    </p>
                </div>
            </div>

            {/* END USER */}
            <div className='mt-10 grid grid-cols-2'>
                <p>
                    <span className='font-semibold'>End User:</span> ________________
                </p>
                <p className='mt-2 mr-6 font-semibold'>Seal</p>
            </div>
        </div>
    );
}
