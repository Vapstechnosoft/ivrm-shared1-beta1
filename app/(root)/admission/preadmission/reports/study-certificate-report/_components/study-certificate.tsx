'use client';

type CertificateProps = {
    data?: any[] | undefined;
    selectedDate?: string;
};

export default function StudyCertificate({ data, selectedDate }: CertificateProps) {
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }
    return (
        <div className=' border border-black p-6 text-sm leading-7'>
            <h2 className='text-center font-bold underline'>STUDY CERTIFICATE</h2>
            {/* Row 1 */}
            <div className='flex border-black border-b py-2'>
                <span className='w-1/3 font-medium'>This is to certify that</span>
                <span className='w-2/3 text-center font-semibold'>{data[0].studentnam}</span>
            </div>

            {/* Row 2 */}
            <div className='flex border-black border-b py-2'>
                <span className='w-1/3 font-medium'>Address</span>
                <span className='w-2/3 text-center font-semibold'>{data[0].addressd1}</span>
            </div>

            {/* Row 3 */}
            <div className='grid grid-cols-2 border-black border-b py-2'>
                <div className='grid grid-cols-2'>
                    <span className='font-medium'>Is studying in</span>
                    <span className=' text-center font-semibold'>{data[0].class}</span>
                </div>
                <div className='grid grid-cols-2'>
                    <span className='text-center font-medium'>Standard during the year</span>
                    <span className='text-center font-semibold'>{data[0].acadamicyear}</span>
                </div>
            </div>

            {/* Row 4 */}
            <div className='flex border-black border-b py-2'>
                <span className='w-1/3 font-medium'>His/her Date of birth is</span>
                <span className='w-2/3 text-center font-semibold'>{data[0].dob}</span>
            </div>

            {/* Row 5 */}
            <div className='flex border-black border-b py-6'>
                <span className='w-1/3 font-medium'>In words :</span>
                <span className='w-2/3' />
            </div>

            {/* Row 6 */}
            <div className='flex border-black border-b py-2'>
                <span className='w-1/3 font-medium'>Caste :</span>
                <span className='w-2/3 text-center font-semibold'>{data[0].caste_name}</span>
            </div>

            {/* Row 7 */}
            <div className='flex border-black border-b py-2'>
                <span className='w-2/3 font-medium'>And her/his Admission No. is</span>
                <span className='w-1/3 text-center font-semibold'>{data[0].admno}</span>
            </div>

            {/* Footer */}
            <p className='mt-8 text-center font-medium'>
                I do hereby declare that the above particulars are correct as mentioned in the relevant school records.
            </p>
            <div className=' mt-12'>
                <p className='mt-8 text-start font-medium'>
                    place:<span>{data[0].city}</span>
                </p>
                <p className='text-start font-medium'>
                    Date:<span>{selectedDate}</span>
                </p>
            </div>
            <p className='mt-8 text-end font-medium'>Principal Signature</p>
        </div>
    );
}
