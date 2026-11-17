'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ChangeUsernameModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername: string;
    onUsernameChange: (newUsername: string) => Promise<boolean>;
    onSendOTP: () => Promise<boolean>;
    onVerifyOTP: (otp: string) => Promise<boolean>;
}

export default function ChangeUsernameModal({
    isOpen,
    onClose,
    currentUsername,
    onUsernameChange,
    onSendOTP,
    onVerifyOTP
}: ChangeUsernameModalProps) {
    const [newUsername, setNewUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!newUsername || newUsername.length < 3) {
            toast.error('Please enter a valid new username (min 3 characters)');
            return;
        }
        if (newUsername === currentUsername) {
            toast.error('Current Username and New Username Are Same!');
            return;
        }

        setIsLoading(true);
        const success = await onSendOTP();
        setIsLoading(false);
        if (success) {
            setStep('otp');
            toast.success('OTP sent to your registered mobile number');
        }
    };

    const handleVerifyAndChange = async () => {
        if (!otp) {
            toast.error('Please enter the OTP');
            return;
        }

        setIsLoading(true);
        const otpVerified = await onVerifyOTP(otp);
        if (otpVerified) {
            const changeSuccess = await onUsernameChange(newUsername);
            if (changeSuccess) {
                toast.success('Username updated successfully');
                onClose();
                // Reset state for next time
                setNewUsername('');
                setOtp('');
                setStep('details');
            }
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-primary font-bold">Change Username</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {step === 'details' ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Username:</Label>
                                <Input value={currentUsername} readOnly className="bg-gray-100" />
                            </div>
                            <div className="space-y-2">
                                <Label>New Username:</Label>
                                <Input
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value.toUpperCase())}
                                    placeholder="ENTER NEW USERNAME"
                                    className="uppercase font-bold"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-800">
                                    An OTP (One Time Password) has been sent to your mobile number.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Enter OTP:</Label>
                                <Input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="text-center text-lg tracking-widest font-bold"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-center gap-2">
                    {step === 'details' ? (
                        <>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSendOTP} disabled={isLoading} className="bg-[#2669bc]">
                                {isLoading ? 'Sending...' : 'Send OTP'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setStep('details')}>Back</Button>
                            <Button onClick={handleVerifyAndChange} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                                {isLoading ? 'Verifying...' : 'Verify & Update'}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
