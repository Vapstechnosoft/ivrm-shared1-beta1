'use client';
import { Button } from '@/components/ui/button';
import { useFeeStudentCurrentAcademicDetails } from '@/hooks/fees/useTrasactions';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StudentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: any;
    loading?: boolean;
    asmay_Id: number;
    amst_Id: number;
}

interface StudentDetailsFromFeeTransaction {
    studentname: string;
    amsT_AdmNo: string;
    amsT_RegistrationNo: string;
    asmaY_Year: string;
    asmcL_ClassName: string;
    amsT_Photoname: string;
    amsT_Sex: string;
    amsT_SOL: string;
    amsT_Date: string;
    amsT_DOB: string;
    amsT_Id: number;
}
interface AcademicDetailsFromFeeTransaction {
    asysT_Id: number;
    asmaY_Year: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    order: number;
    asmaY_Id: number;
    amaY_RollNo: number;
    status_Flag: string;
    asmcL_Id: number;
    asmS_Id: number;
}
interface ParentDetailsFromFeeTransaction {
    amsT_MobileNo: number;
    amsT_emailId: string;
    amsT_FatherName: string;
    amsT_FatherSurname: string;
    amsT_FatherMobleNo: number;
    amsT_FatheremailId: string;
    amsT_FatherPhoto: string;
    amsT_MotherName: string;
    amsT_MotherSurname: string;
    amsT_MotherMobileNo: number;
    amsT_MotherEmailId: string;
    amsT_MotherPhoto: string;
}

interface AttendanceDetailsFromFeeTransaction {
    asmaY_Year: string;
    asmcL_ClassName: string;
    asmC_SectionName: string;
    asmaY_Order: number;
    asmaY_Id: number;
    asmcL_Id: number;
    asmS_Id: number;
    amsT_Id: number;
    workingdays: number;
    presentdays: number;
    percentage: number;
    statuS_FLAG: string;
}
interface SubjectDetailsFromFeeTransaction {
    ismS_Id: number;
    ismS_SubjectName: string;
    subjorder: number;
    estsU_ElecetiveFlag: boolean;
}

interface classTeacherDetailsFromFeeTransaction {
    ismS_Id: number;
    hrme_id: number;
    emp_name: string;
    hrmemno_mobileno: string;
    hrmem_emailid: string;
    classteacher: string;
}

interface feeDetailsFromFeeTransaction {
    amsT_Id: number;
    yearlyCharges: number;
    concession: number;
    payable: number;
    paidAmount: number;
    outstanding: number;
    classSection: string;
    asmcL_Id: number;
    asmS_Id: number;
    asmaY_Id: number;
    asmay_year: string;
}

const tabs = [
    { id: 'academic', label: 'Academic Details' },
    { id: 'parents', label: 'Parents Details' },
    { id: 'attendance', label: 'Attendance Details' },
    { id: 'subject', label: 'Subject Details' },
    { id: 'fee', label: 'Fee Details' },
    { id: 'library', label: 'Library Details' }
];

export default function StudentProfileModalStThomas({ isOpen, onClose, asmay_Id, amst_Id }: StudentProfileModalProps): JSX.Element | null {
    const [activeTab, setActiveTab] = useState('academic');
    const [studentJoinedDetails, setStudentJoinedDetails] = useState<StudentDetailsFromFeeTransaction[]>([]);
    const [academicDetails, setAcademicDetails] = useState<AcademicDetailsFromFeeTransaction[]>([]);
    const [parentDetails, setParentDetails] = useState<ParentDetailsFromFeeTransaction[]>([]);
    const [attendanceDetails, setAttendanceDetails] = useState<AttendanceDetailsFromFeeTransaction[]>([]);
    const [subjectDetails, setSubjectDetails] = useState<SubjectDetailsFromFeeTransaction[]>([]);
    const [libraryDetails, setLibraryDetails] = useState<any[]>([]);
    const [feeDetails, setFeeDetails] = useState<feeDetailsFromFeeTransaction[]>([]);
    const [_classTeacherDetails, setClassTeacherDetails] = useState<classTeacherDetailsFromFeeTransaction[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    const { data: response, isLoading: isApiLoading, error: apiError, refetchAll } = useFeeStudentCurrentAcademicDetails(amst_Id, asmay_Id);

    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen || !amst_Id || !asmay_Id) return;

            setIsRefetching(true);
            try {
                await refetchAll();
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setIsRefetching(false);
            }
        };

        fetchData();
    }, [isOpen, amst_Id, asmay_Id]);

    useEffect(() => {
        const processStudentData = () => {
            setIsProcessing(true);
            if (isApiLoading) {
                setIsProcessing(false);
                return;
            }
            try {
                if (response?.studJoinedDetails) {
                    const parsedData = JSON.parse(JSON.stringify(response.studJoinedDetails || []));
                    const academicData = JSON.parse(JSON.stringify(response.studentacAdemicYeardetails || []));
                    const parentData = JSON.parse(JSON.stringify(response.studentdetails || []));
                    const attendanceData = JSON.parse(JSON.stringify(response.viewstudentattendancetails || []));
                    const subjectData = JSON.parse(JSON.stringify(response.viewstudentsubjectdetails || []));
                    const classTeacherData = JSON.parse(JSON.stringify(response.classteacher_lists || []));
                    const viewFeeDetails = JSON.parse(JSON.stringify(response.viewFeeDetails || []));
                    const libraryDetails = JSON.parse(JSON.stringify(response.librarydetails || []));

                    setStudentJoinedDetails(parsedData);
                    setAcademicDetails(academicData);
                    setParentDetails(parentData);
                    setAttendanceDetails(attendanceData);
                    setSubjectDetails(subjectData);
                    setClassTeacherDetails(classTeacherData);
                    setFeeDetails(viewFeeDetails);
                    setLibraryDetails(libraryDetails);
                } else {
                    setStudentJoinedDetails([]);
                    setAcademicDetails([]);
                    setParentDetails([]);
                    setAttendanceDetails([]);
                    setSubjectDetails([]);
                    setClassTeacherDetails([]);
                    setFeeDetails([]);
                }
            } catch (error) {
                console.error('Error processing student data:', error);
                setStudentJoinedDetails([]);
                setAcademicDetails([]);
                setParentDetails([]);
                setAttendanceDetails([]);
                setSubjectDetails([]);
                setClassTeacherDetails([]);
                setFeeDetails([]);
            } finally {
                setIsProcessing(false);
            }
        };

        if (response !== undefined) {
            processStudentData();
        }
    }, [response, isApiLoading]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) {
            setStudentJoinedDetails([]);
            setAcademicDetails([]);
            setParentDetails([]);
            setAttendanceDetails([]);
            setSubjectDetails([]);
            setClassTeacherDetails([]);
            setFeeDetails([]);
            setActiveTab('academic');
        }
    }, [isOpen]);

    const isLoading = isApiLoading || isProcessing || isRefetching;

    if (isOpen && isLoading) {
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                <div className='w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl'>
                    <div className='flex items-center justify-center p-8'>
                        <div className='text-center'>
                            <div className='mb-4'>
                                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent border-solid'>
                                    {' '}
                                </div>
                            </div>
                            <div className='font-medium text-gray-600'>Loading student details...</div>
                            <p className='mt-2 text-gray-500 text-sm'>Please wait while we fetch the information</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isOpen) return null;

    if (apiError) {
        return (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                <div className='w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl'>
                    <div className='p-8 text-center'>
                        <div className='mb-4 text-red-500'>
                            <svg className='mx-auto h-12 w-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                            </svg>
                        </div>
                        <h3 className='mb-2 font-semibold text-gray-900 text-lg'>Error Loading Data</h3>
                        <p className='mb-4 text-gray-600'>{apiError.message || 'Failed to load student details'}</p>
                        <Button onClick={onClose} variant='secondary'>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const firstStudent = studentJoinedDetails[0] || {};

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not available';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'academic':
                return (
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-primary'>Academic Years</h3>
                        <div className='space-y-3'>
                            {academicDetails.length > 0 ? (
                                academicDetails.map((item, idx) => (
                                    <div key={idx} className='rounded-lg border border-gray-200 p-4'>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-medium'>{item.asmaY_Year}</span>
                                            {item.status_Flag && (
                                                <span className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-xs'>
                                                    CURRENT YEAR
                                                </span>
                                            )}
                                        </div>
                                        <div className='mt-2 space-y-1 text-sm'>
                                            <div>
                                                <strong>Class / Section :</strong> {item.asmcL_ClassName} / {item.asmC_SectionName}
                                            </div>
                                            <div>
                                                <strong>Roll No. :</strong> {item.amaY_RollNo}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-500'>No academic details available</p>
                            )}
                        </div>
                    </div>
                );

            case 'parents':
                return (
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-primary'>Parents Information</h3>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div className='rounded-lg border border-gray-200 p-4'>
                                <h4 className='mb-3 font-medium text-primary'>Father's Details</h4>
                                <div className='flex items-center gap-6'>
                                    <div className='space-y-2'>
                                        <p>
                                            <strong>Name:</strong> {parentDetails[0].amsT_FatherName}
                                        </p>
                                        <p>
                                            <strong>Mobile:</strong> 0
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {}
                                        </p>
                                        <p>
                                            <strong>Occupation:</strong>
                                        </p>
                                    </div>
                                    <div className='flex-shrink-0'>
                                        <div className='h-28 w-28 overflow-hidden rounded-lg border-2 border-primary/20'>
                                            <img
                                                src={
                                                    parentDetails[0]?.amsT_FatherPhoto ||
                                                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                                }
                                                alt='Profile'
                                                className='h-full w-full object-cover'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='rounded-lg border border-gray-200 p-4'>
                                <h4 className='mb-3 font-medium text-primary'>Mother's Details</h4>
                                <div className='flex items-center gap-6'>
                                    <div className='space-y-2'>
                                        <p>
                                            <strong>Name:</strong> {parentDetails[0].amsT_MotherName}
                                        </p>
                                        <p>
                                            <strong>Mobile:</strong> {parentDetails[0].amsT_MotherMobileNo}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {parentDetails[0].amsT_MotherEmailId}
                                        </p>
                                        <p>
                                            <strong>Occupation:</strong> {parentDetails[0].amsT_FatherSurname}
                                        </p>
                                    </div>
                                    <div className='flex-shrink-0'>
                                        <div className='h-28 w-28 overflow-hidden rounded-lg border-2 border-primary/20'>
                                            <img
                                                src={
                                                    parentDetails[0]?.amsT_MotherPhoto ||
                                                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                                }
                                                alt='Profile'
                                                className='h-full w-full object-cover'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'attendance':
                return (
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-primary'>Attendance Records</h3>
                        {attendanceDetails.length > 0 ? (
                            <div className='space-y-3'>
                                {attendanceDetails.map((item, idx) => (
                                    <div key={idx} className='rounded-lg border border-gray-200 p-4'>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-medium'>{item.asmaY_Year}</span>
                                            {item.statuS_FLAG && (
                                                <span className='rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-xs'>
                                                    CURRENT
                                                </span>
                                            )}
                                        </div>
                                        <div className='mt-3 grid grid-cols-2 gap-4 md:grid-cols-4'>
                                            <div className='text-center'>
                                                <div className='font-bold text-2xl text-green-600'>{item.percentage}</div>
                                                <div className='text-gray-500 text-xs'>Attendance</div>
                                            </div>
                                            <div className='text-center'>
                                                <div className='font-bold text-2xl text-gray-700'>{item.presentdays}</div>
                                                <div className='text-gray-500 text-xs'>Days Present</div>
                                            </div>
                                            <div className='text-center'>
                                                <div className='font-bold text-2xl text-red-600'>{item.workingdays}</div>
                                                <div className='text-gray-500 text-xs'>Working Days</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-gray-500'>No attendance details available</p>
                        )}
                    </div>
                );

            case 'subject':
                return (
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-primary'>Subject Details</h3>
                        {subjectDetails.length > 0 ? (
                            <div className='rounded-lg border border-gray-200 p-4'>
                                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                                    {subjectDetails.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className='flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-3'>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium text-blue-800'>{item.ismS_SubjectName}</span>
                                                {item.estsU_ElecetiveFlag && (
                                                    <span className='rounded-full bg-purple-100 px-2 py-0.5 font-medium text-purple-800 text-xs'>
                                                        Elective
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className='text-gray-500'>No subject details available</p>
                        )}
                    </div>
                );

            case 'fee':
                return (
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-primary'>Over All Fee Details</h3>
                        {feeDetails.length > 0 ? (
                            <div className='overflow-x-auto'>
                                <table className='w-full border-collapse text-sm'>
                                    <thead className='bg-primary text-white'>
                                        <tr>
                                            <th className='border px-2 py-2'>Sl No</th>
                                            <th className='border px-2 py-2'>Year</th>
                                            <th className='border px-2 py-2'>Class:Section</th>
                                            <th className='border px-2 py-2'>Yearly Charges</th>
                                            <th className='border px-2 py-2'>Concession</th>
                                            <th className='border px-2 py-2'>Payable</th>
                                            <th className='border px-2 py-2'>Paid Amount</th>
                                            <th className='border px-2 py-2'>Outstanding</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feeDetails.map((row, index) => (
                                            <tr key={row.asmaY_Id ?? index}>
                                                <td className='border px-2 py-2 text-center'>{index + 1}</td>
                                                <td className='border px-2 py-2'>{row.asmay_year}</td>
                                                <td className='border px-2 py-2'>{row.classSection}</td>
                                                <td className='border px-2 py-2 text-center'>{formatCurrency(row.yearlyCharges)}</td>
                                                <td className='border px-2 py-2 text-center'>{formatCurrency(row.concession)}</td>
                                                <td className='border px-2 py-2 text-center'>{formatCurrency(row.payable)}</td>
                                                <td className='border px-2 py-2 text-center'>{formatCurrency(row.paidAmount)}</td>
                                                <td className='border px-2 py-2 text-center'>{formatCurrency(row.outstanding)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className='rounded-lg border border-gray-200 p-8 text-center'>
                                <p className='text-gray-500'>No fee details available for this student</p>
                                <p className='mt-2 text-gray-400 text-sm'>Check if the student has any fee records</p>
                            </div>
                        )}
                    </div>
                );
            case 'library':
                return (
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg text-primary'>Library Details</h3>
                        {libraryDetails.length > 0 ? (
                            <div className='rounded-lg border border-gray-200 p-4'>
                                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                                    {libraryDetails.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className='flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-3'>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium text-blue-800'>{item.ismS_SubjectName}</span>
                                                {item.estsU_ElecetiveFlag && (
                                                    <span className='rounded-full bg-purple-100 px-2 py-0.5 font-medium text-purple-800 text-xs'>
                                                        Elective
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className='text-gray-500'>No Library details available</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='relative flex h-[90vh] w-full max-w-6xl flex-col rounded-lg bg-white shadow-xl'>
                <div className='flex items-center justify-between bg-primary px-4 py-2 text-white'>
                    <h2 className='font-semibold text-lg'>STUDENT DETAILS</h2>
                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-full p-1 transition-colors hover:bg-white/20'
                        aria-label='Close modal'>
                        <X size={24} />
                    </button>
                </div>

                <div className='m-3 flex flex-1 overflow-hidden rounded-lg border border-gray-200'>
                    <div className='flex w-1/3 flex-col border-gray-200 border-r'>
                        <div className='overflow-y-auto p-4'>
                            <div className='mb-6'>
                                <div className='flex justify-center'>
                                    <div className='rounded-full border-4 border-primary/10 p-1'>
                                        <img
                                            src={
                                                firstStudent?.amsT_Photoname ||
                                                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                            }
                                            alt='Student'
                                            className='h-28 w-28 rounded-full object-cover'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    {/* ✅ FIXED LINE: Added optional chaining and fallback */}
                                    <p className='font-semibold text-gray-900 text-lg'>
                                        <strong>{firstStudent?.studentname || 'Student Name Not Available'}</strong>
                                    </p>

                                    <p>
                                        <strong>Admno:</strong> <span>{firstStudent?.amsT_AdmNo || 'Not available'}</span>
                                    </p>
                                    <p>
                                        <strong>Date Of Admission:</strong>
                                        <span>{formatDate(firstStudent?.amsT_Date)}</span>
                                    </p>
                                    <p>
                                        <strong>Date Of Birth:</strong>
                                        <span>{formatDate(firstStudent?.amsT_DOB)}</span>
                                    </p>
                                    <p>
                                        <strong>Admitted Year:</strong>
                                        <span>{firstStudent?.asmaY_Year || ''}</span>
                                    </p>
                                    <p>
                                        <strong>Admitted Class:</strong>
                                        <span>{firstStudent?.asmcL_ClassName || ''}</span>
                                    </p>
                                    <p>
                                        <strong>Gender:</strong>
                                        <span>{firstStudent?.amsT_Sex || ''}</span>
                                    </p>
                                    <p>
                                        <strong>Mobile:</strong>
                                        <span>{''}</span>
                                    </p>
                                    <p>
                                        <strong>Email:</strong>
                                        <span>{''}</span>
                                    </p>
                                    <p>
                                        <strong>Tpln:</strong>
                                        <span>{''}</span>
                                    </p>

                                    {/* Show warning if no student data */}
                                    {studentJoinedDetails.length === 0 && (
                                        <div className='mt-4 rounded-md bg-yellow-50 p-3'>
                                            <p className='text-sm text-yellow-800'>No student data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex w-2/3 flex-col'>
                        <div className='border-gray-200 border-b bg-white'>
                            <nav className='flex space-x-1 px-6 pt-4'>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type='button'
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`rounded-t-lg px-4 py-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-primary border-b-2 bg-primary/10 text-primary'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className='flex-1 overflow-auto p-6'>
                            {studentJoinedDetails.length > 0 ? (
                                renderTabContent()
                            ) : (
                                <div className='flex h-full items-center justify-center'>
                                    <div className='text-center'>
                                        <div className='mb-4 text-gray-400'>
                                            <svg className='mx-auto h-12 w-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth='2'
                                                    d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                                />
                                            </svg>
                                        </div>
                                        <h3 className='mb-2 font-semibold text-gray-700 text-lg'>No Student Data</h3>
                                        <p className='text-gray-500'>No student information is available to display.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='border-gray-200 border-t bg-gray-50 p-3'>
                    <div className='flex justify-end'>
                        <Button variant='secondary' onClick={onClose} className='w-70'>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
