'use clint';
type CertificateProps = {
    data?: any[] | undefined;
};
function CharacterCertificate({ data }: CertificateProps) {
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }
    return (
        <div className=' mt-10 border border-black p-8 leading-7'>
            {/* Title */}
            <h2 className='text-center font-bold underline'>CHARACTER CERTIFICATE</h2>
            <p className='mt-2 mb-6 text-center font-medium text-xl'>TO WHOMSOEVER IT MAY CONCERN</p>

            {/* Date */}
            <p className='mb-6 text-right'>
                <strong>Date :</strong> {data[0].certificatedate}
            </p>

            {/* Body */}
            <p className='mb-4 text-justify'>
                This is to certify that Kumar/Kumari <strong>{data[0].studentnam}</strong>, child of Sri.{' '}
                <strong>{data[0].fathername}</strong>, is a bonafide student of class <strong>{data[0].class}</strong> for the academic year{' '}
                <strong>{data[0].acadamicyear}</strong>. Her/His admission number is <strong>{data[0].admno}</strong>. He/She is good in
                studies, sports as well as co-curricular activities.
            </p>

            <p className='mb-10'>He/She bears a good moral character.</p>

            {/* Signature */}
            <div className='mt-16 flex justify-end'>
                <p className='w-64 border-black border-t pt-2 text-center'>Signature of Head of the School</p>
            </div>
        </div>
    );
}

export default CharacterCertificate;
