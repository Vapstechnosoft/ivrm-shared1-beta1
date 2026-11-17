'use client';

import type { IAlumniLetterStudent } from '@/types/alumni/alumni-letters';
import { format } from 'date-fns';
import { forwardRef } from 'react';

interface LetterTemplatesProps {
    students: IAlumniLetterStudent[];
    letterType: string;
    displayDateTime?: string;
}

export const LetterTemplates = forwardRef<HTMLDivElement, LetterTemplatesProps>(({ students, letterType, displayDateTime }, ref) => {
    return (
        <div ref={ref} className='print-container bg-white font-serif text-black'>
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    .no-print, header, nav, [role="navigation"], .PolygonBanner { display: none !important; }
                    .print-only { display: block !important; }
                    .print-container { padding: 0 !important; margin: 0 !important; display: block !important; width: 100%; }
                    .page-break { page-break-after: always; }
                    @page { margin: 0.5cm; size: auto; }
                    .row { margin-right: 0px; margin-left: 0px; }
                    .col-sm-2, .col-sm-8, .col-sm-12 { float: left; position: relative; min-height: 1px; padding-right: 15px; padding-left: 15px; }
                    .col-sm-2 { width: 16.66666667%; }
                    .col-sm-8 { width: 66.66666667%; }
                    .col-sm-12 { width: 100%; }
                    .text-center { text-align: center; }
                    .pull-right { float: right !important; }
                    .divob { padding-left: 35px; padding-right: 35px; }
                    .hhh { font-family: serif; font-size: 14px; margin-bottom: 10px; }
                }
            `
                }}
            />

            {students.map((student, index) => (
                <div
                    key={`${student.amsT_Id}-${letterType}-${index}`}
                    className={`letter-page divob ${index < students.length - 1 ? 'page-break' : ''}`}
                    style={{ margin: '90px' }}>
                    <div className='margin-top-10'>
                        <div className='row'>
                            <div className='col-sm-2'>
                                <div className='baldwin text-center'>
                                    <img
                                        src='/images/SRKVSLOGO.png'
                                        className='img-responsive'
                                        alt='baldwin'
                                        style={{ maxWidth: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <hr style={{ borderTop: '1px solid black', width: '100%', margin: '20px auto' }} />

                        <div className='margin-top-10'>
                            <div className=''>
                                <div className='pull-right' style={{ float: 'right' }}>
                                    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                                    <label className='date2' style={{ fontSize: '22px' }}>
                                        Date : {format(new Date(), 'dd/MM/yyyy')}
                                    </label>
                                </div>
                            </div>
                            {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                            <div style={{ clear: 'both' }}></div>

                            <div className='col-sm-12' style={{ marginTop: '20px' }}>
                                {renderLetterBody(student, letterType, displayDateTime)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

LetterTemplates.displayName = 'LetterTemplates';

function renderLetterBody(student: IAlumniLetterStudent, type: string, displayDateTime?: string) {
    const studentName = student.studentname || student.amsT_FirstName || '';
    const fatherName = student.fathername || student.amsT_FatherName || '';
    const address = {
        street: student.amsT_PerStreet,
        area: student.amsT_PerArea,
        city: student.amsT_PerCity,
        pincode: student.amsT_PerPincode
    };

    const styles = {
        fontSize22: { fontSize: '22px' },
        justify: { textAlign: 'justify' as const },
        justify22: { textAlign: 'justify' as const, fontSize: '22px' },
        date1: { fontSize: '22px' }
    };

    switch (type) {
        case 'OBA':
            return (
                <div className='letter-content'>
                    <div className='hhh mb-2'>
                        <div className='row' style={styles.fontSize22}>
                            To
                        </div>
                    </div>
                    <div className='hhh mb-4'>
                        <div className='row' style={styles.fontSize22}>
                            Dear {studentName},
                        </div>
                    </div>
                    <div className='hhh mb-6'>
                        <div className='row' style={styles.fontSize22}>
                            {address.street}
                        </div>
                        <div className='row' style={styles.fontSize22}>
                            {address.area}
                        </div>
                        <div className='row' style={styles.fontSize22}>
                            {address.city}
                        </div>
                        <div className='row' style={styles.fontSize22}>
                            {address.pincode}
                        </div>
                    </div>
                    <div className='hhh mb-4'>
                        <div className='row' style={styles.fontSize22}>
                            Sub : OBA Games Meet on {displayDateTime || '__________'}
                        </div>
                    </div>
                    <div className='hhh mb-6'>
                        <div className='row' style={styles.fontSize22}>
                            Ref :
                        </div>
                    </div>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;We are planning, as in the previous years, a Games Meet for the Old Boys' Of
                        Vidyashala residing in Mysore and nearby places. It is proposed to play matches between the alumni and the present
                        students in Cricket, Volleyball, Basketball Shuttle badminton, Table Tennis,Handball,Football and Kho-kho, provided
                        there are sufficient number of players for each game from the OBA side.
                    </p>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp; &nbsp;&nbsp; In this connection, the cricket match between the alumni and the present students of
                        Vidyashala will be played on {displayDateTime || '__________'} at Vidyashala. Other matches will also be played on
                        the same day if sufficient number of players from the OBA side turn up and if time permits.
                    </p>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp;&nbsp;&nbsp; We are happy that your name is proposed to be included in the alumni team. We hope you will
                        make yourself free to participate in the match/ matches on that day.
                    </p>
                    <p className='hhh uppercase' style={styles.justify}>
                        &nbsp;&nbsp; KINDLY CONFIRM YOUR PARTICIPATION BY PHONE (2514000, 2417555) OR BY E-MAIL (alumnisrkvs@gmail.com)
                        MENTIONING THE GAME IN WHICH YOU ARE WILLING TO PARTICIPATE.
                    </p>
                </div>
            );
        case 'ENR':
        case 'ENR3':
            // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
            const years = type === 'ENR' ? 'three' : 'two';
            // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
            const cday = type === 'ENR' ? 'invitation of the annual College Day' : 'College Day';
            return (
                <div className='letter-content'>
                    <div className='hhh mb-6'>
                        <div className='row' style={styles.fontSize22}>
                            Dear {fatherName}
                        </div>
                    </div>
                    <div className='hhh mb-2'>
                        <div className='row' style={styles.fontSize22}>
                            Sub : Enrolling your boy as a member of the Old Boys' Association
                        </div>
                    </div>
                    <div className='hhh mb-6'>
                        <div className='row' style={{ ...styles.fontSize22, textAlign: 'justify' }}>
                            Ref : Your ward studying in {student.asmcL_ClassName} - {studentName} ({student.amsT_AdmNo}).
                        </div>
                    </div>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;We are glad that your boy is preparing well for the ensuing public examination. We
                        hope he will do well in it. He has studied in our institution for {years} years. We trust you desire to continue his
                        association with us in future also. Hence we request you to enroll him as a member of the Old Boys' Association
                        which aims at bringing our alumni together by strengthening their network.
                    </p>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp; &nbsp;&nbsp; The Association organizes programmes like Spiritual Retreats, Regional Meets, Sports and
                        Games Meets etc. exclusively for our old Boys'. It brings out a bi-annual newsletter - Voice of Vidyashala Alumni
                        (VOVA) with latest updates about Vidyashala and OBA. The Association has been conducting a city level Inter High
                        School Competition in General Knowledge since 1973.
                    </p>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp;&nbsp;&nbsp;The Association offers two types of membership - Patron (Rs.5000/-) and Life Member
                        (RS.3OOO/-) - both being one-time payments only.
                    </p>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp; &nbsp;&nbsp; Your boy will be enrolled as a Life Member by deducting from his personal deposit an
                        amount of Rs.3000/-towards the above membership fees. You need not send any amount for this.
                    </p>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp; &nbsp;&nbsp; In case, you desire your boy to be enrolled as a patron, you will please send an
                        additional amount of Rs.2000/- in the form of a DD drawn in favour of Sri Ramakrishna Vidyashala, Mysore, with a
                        request letter to enroll him as a patron of the Old Boys' Association. If he is enrolled as a patron, we appreciate
                        the noble gesture of support.
                    </p>
                    <p className='hhh' style={styles.justify}>
                        &nbsp;&nbsp; As a member of OBA, he will receive our newsletter – VOVA, {cday} and other important programmes.
                    </p>
                </div>
            );
        case 'ADR':
            return (
                <div className='letter-content'>
                    <div className='hhh mb-2'>
                        <div className='row' style={styles.fontSize22}>
                            To
                        </div>
                    </div>

                    <div className='hhh'>
                        <div className='row' style={styles.fontSize22}>
                            {studentName}
                        </div>
                    </div>
                    <br />
                    <div className='hhh'>
                        <div className='row' style={styles.fontSize22}>
                            Kind Attention : {studentName}{' '}
                        </div>
                    </div>
                    <br />
                    <div className='hhh'>
                        <div className='row' style={styles.fontSize22}>
                            Dear {studentName}
                        </div>
                    </div>
                    <br />
                    <div className='hhh'>
                        <div className='row' style={styles.fontSize22}>
                            Sub : Change of address
                        </div>
                    </div>
                    <br />
                    <div className='hhh mb-6'>
                        <div className='row' style={styles.fontSize22}>
                            Ref :
                        </div>
                    </div>

                    <div className='row'>
                        <table>
                            <tbody>
                                <tr>
                                    <td className='date1' style={styles.justify22}>
                                        Hope you are doing well.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <br />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='date1' style={styles.justify22}>
                                        It is very nice of you to have intimated the change in your address. It has been incorporated in our
                                        records.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <br />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='date1' style={styles.justify22}>
                                        Kindly visit the institution whenever you come to Mysore.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'PTRN':
            return (
                <div className='letter-content'>
                    <div className='hhh mb-2'>
                        <div className='row' style={styles.fontSize22}>
                            To
                        </div>
                    </div>
                    <br />
                    <div className='hhh'>
                        <div className='row' style={styles.fontSize22}>
                            Dear {studentName}
                        </div>
                    </div>
                    <br />
                    <div className='hhh mb-6'>
                        <div className='row' style={styles.fontSize22}>
                            {address.street}
                        </div>
                        <div className='row' style={styles.fontSize22}>
                            {address.area}
                        </div>
                        <div className='row' style={styles.fontSize22}>
                            {address.city}
                        </div>
                        <div className='row' style={styles.fontSize22}>
                            {address.pincode}
                        </div>
                    </div>
                    <br />
                    <div className='hhh'>
                        <div className='row' style={styles.fontSize22}>
                            Sub : Your boy is enrolled as Patron
                        </div>
                    </div>
                    <br />
                    <div className='hhh mb-6'>
                        <div className='row' style={styles.fontSize22}>
                            Ref :
                        </div>
                    </div>
                    <div className='row'>
                        <table>
                            <tr>
                                <td className='date1' style={styles.justify22}>
                                    {' '}
                                    We are thankful to you for sending an additional membership subscription of Rs.2000/-. Please find the
                                    receipt enclosed.
                                </td>
                            </tr>
                            <tr>
                                <td className='date1' style={styles.justify22}>
                                    The Life Membership of your boy has been upgraded and he is enrolled as a Patron of the Old Boys'
                                    Association.
                                </td>
                            </tr>
                            <tr>
                                <td className='date1' style={styles.justify22}>
                                    We wish him all the best.
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            );
        case 'LFMB':
            return (
                <div className='letter-content'>
                    <div className='hhh mb-6'>
                        <div className='row' style={styles.fontSize22}>
                            Dear Sri {fatherName}
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className='hhh'>
                        <div className='row' style={styles.fontSize22}>
                            Sub : Your boy is enrolled as Life Member
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className='hhh mb-4'>
                        <div className='row' style={styles.fontSize22}>
                            Ref :
                        </div>
                    </div>
                    <div className='hhh mb-6 pl-10'>
                        <div className='row' style={{ ...styles.fontSize22, paddingLeft: '40px' }}>
                            Your ward: {studentName}
                        </div>
                    </div>
                    <div className='row'>
                        <table>
                            <tr>
                                {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                                <td></td>
                            </tr>
                            <tr>
                                <td className='date1' style={styles.justify22}>
                                    {' '}
                                    We are glad that you have enrolled your boy as a Life Member of the Old Boys' association. <br />
                                </td>
                            </tr>
                        </table>
                        <table style={{ marginTop: '10px' }}>
                            <tr>
                                <td className='date1' style={styles.justify22}>
                                    Kindly see that he keeps in touch with the institution in future also. He is welcome to visit the
                                    institution whenever convenient to him. <br />
                                </td>
                            </tr>
                        </table>
                        <table style={{ marginTop: '10px' }}>
                            <tr>
                                <td className='date1' style={styles.justify22}>
                                    Whenever there is any change in his contact particulars, kindly instruct him to intimate the same to us.{' '}
                                    <br />
                                </td>
                            </tr>
                        </table>
                        <table style={{ marginTop: '10px' }}>
                            <tr>
                                <td className='date1' style={styles.justify22}>
                                    We wish him all the best in his future endeavours.
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            );
        default:
            return <div>Select a valid letter type.</div>;
    }
}
