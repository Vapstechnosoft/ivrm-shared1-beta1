// pages/privacy-policy.tsx

import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
    return (
        <main
            className='flex min-h-screen flex-col items-center p-6'
            style={{
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))'
            }}>
            <header className='mb-8 flex w-full max-w-4xl flex-col items-center space-y-4'>
                <Image
                    src='https://trackandtraceapp.blob.core.windows.net/logo/TAT.png'
                    alt='TAT Logo'
                    width={120}
                    height={120}
                    className='rounded-md'
                    priority
                />
                <h1 className='text-center font-bold text-3xl'>TAT</h1>
                <h2 className='text-center font-bold text-3xl'>Privacy Policy</h2>
            </header>

            <Card
                className='w-full max-w-4xl rounded-lg p-8 shadow-lg'
                style={{
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))'
                }}>
                <section className='mb-8'>
                    <h2 className='mb-3 font-semibold text-xl'>WHAT INFORMATION DO WE COLLECT?</h2>
                    <p className='mb-2 leading-relaxed'>
                        TAT (Track and Trace) collects the following user data to provide and enhance your experience:
                    </p>
                    <ul className='list-inside list-disc space-y-1'>
                        <li>
                            <strong>Location Data:</strong> Captured specifically for attendance tracking purposes to verify your presence
                            and improve app functionality.
                        </li>
                        <li>
                            <strong>Photo Permission:</strong> Used for attendance via photo capture to ensure accurate verification within
                            the app.
                        </li>
                        <li>
                            <strong>Notification Permissions:</strong> To send you important updates, alerts, and notifications related to
                            the app.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> Collected automatically to analyze app performance and user behavior.
                        </li>
                    </ul>
                </section>

                <section className='mb-8'>
                    <h2 className='mb-3 font-semibold text-xl'>HOW DO WE SECURE INFORMATION TRANSMISSIONS?</h2>
                    <p className='mb-2 leading-relaxed'>
                        We take your privacy and data security seriously. All data transmitted between your device and our secure servers is
                        encrypted using industry-standard HTTPS (TLS) protocols. Additionally, stored data is protected using robust
                        encryption methods and secured on reliable cloud storage services with encrypted access controls.
                    </p>
                    <p className='mb-2 leading-relaxed'>
                        We implement strict access control policies and regularly audit our security practices to ensure your data remains
                        confidential and protected against unauthorized access.
                    </p>
                </section>

                <section>
                    <h2 className='mb-3 font-semibold text-xl'>DATA STORAGE & SECURITY MEASURES</h2>
                    <p className='mb-2 leading-relaxed'>
                        Your data is stored in secure storage environments designed to meet high standards of security compliance. We adopt
                        best-in-class security measures including encryption at rest, multi-factor authentication for access, regular
                        vulnerability assessments, and data backups.
                    </p>
                    <p className='mb-2 leading-relaxed'>
                        Only authorized personnel have access to your information, and we do not share your personal data with third parties
                        except as required by law or with your explicit consent.
                    </p>
                </section>

                <section className='mt-8'>
                    <h2 className='mb-3 font-semibold text-xl'>USER CONTROL & CONSENT</h2>
                    <p className='mb-2 leading-relaxed'>
                        You have full control over granting permissions for location, photo access, and notifications. You may revoke or
                        adjust these permissions at any time via your device settings. We collect data only after obtaining your explicit
                        consent, in accordance with applicable privacy regulations.
                    </p>
                </section>

                <section className='mt-8 text-gray-400 text-sm'>
                    <p>
                        This Privacy Policy is designed to comply with Google Play Store requirements for privacy, security, and
                        transparency.
                    </p>
                </section>
            </Card>
        </main>
    );
}
