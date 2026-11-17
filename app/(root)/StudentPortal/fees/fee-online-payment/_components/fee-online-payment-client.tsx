'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeeOnlinePaymentClientProps {
    initialData: any;
}

export default function FeeOnlinePaymentClient({ initialData }: FeeOnlinePaymentClientProps) {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [showFeeDetails, setShowFeeDetails] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<string>('');
    const [showChargesModal, setShowChargesModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [concessionAmount, setConcessionAmount] = useState<number>(0);
    const [fineAmount, setFineAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (initialData?.academicyrlist && initialData.academicyrlist.length > 0) {
            const firstYear = initialData.academicyrlist[0];
            setSelectedAcademicYear(firstYear?.asmaY_Id?.toString() || '');
            setShowPaymentDetails(true);
        }

        // Initialize checkedheadlst for terms (default to false)
        if (initialData?.termlst) {
            initialData.termlst.forEach((term: any) => {
                term.checkedheadlst = false;
                // Set termdisablechk based on payment status
                term.termdisablechk = term.payable <= term.paid;
            });
        }

        // Set default payment gateway (filter duplicates)
        if (initialData?.fillpaymentgateway && initialData.fillpaymentgateway.length > 0) {
            // Filter unique gateways by name
            const uniqueGateways = initialData.fillpaymentgateway.filter(
                (gateway: any, index: number, self: any[]) => index === self.findIndex((g: any) => g.fpgD_PGName === gateway.fpgD_PGName)
            );
            setSelectedPaymentGateway(uniqueGateways[0].fpgD_PGName);
        }
    }, [initialData]);

    // Handler for group selection (similar to firstfnc in AngularJS)
    const handleGroupSelection = (groupId: number) => {
        const newSelectedGroups = new Set(selectedGroups);

        if (newSelectedGroups.has(groupId)) {
            newSelectedGroups.delete(groupId);
            // Uncheck all terms for this group
            if (initialData?.termlst) {
                initialData.termlst.forEach((term: any) => {
                    if (term.fmgG_Id === groupId && !term.termdisablechk) {
                        term.checkedheadlst = false;
                    }
                });
            }
        } else {
            newSelectedGroups.add(groupId);
            // Check all terms for this group
            if (initialData?.termlst) {
                initialData.termlst.forEach((term: any) => {
                    if (term.fmgG_Id === groupId && !term.termdisablechk) {
                        term.checkedheadlst = true;
                    }
                });
            }
        }

        setSelectedGroups(newSelectedGroups);
    };

    // Academic year change handler
    const handleAcademicYearChange = (yearId: string) => {
        setIsLoading(true);
        setSelectedAcademicYear(yearId);

        // Reset all selections
        setSelectedGroups(new Set());
        setShowFeeDetails(false);

        // Reset term selections
        if (initialData?.termlst) {
            initialData.termlst.forEach((term: any) => {
                term.checkedheadlst = false;
            });
        }

        // Reset amounts
        setTotalAmount(0);
        setConcessionAmount(0);
        setFineAmount(0);

        // TODO: Reload fee data for new academic year
        setTimeout(() => setIsLoading(false), 500);
    };

    // Calculate amounts based on selected terms
    const calculateAmounts = () => {
        let total = 0;
        let concession = 0;
        let fine = 0;

        if (initialData?.filonlinepaymentgrid) {
            initialData.filonlinepaymentgrid.forEach((fee: any) => {
                // Only include fees for selected groups/terms
                if (selectedGroups.size > 0) {
                    const term = initialData?.termlst?.find((t: any) => t.fmH_Id === fee.fmH_Id && t.checkedheadlst);
                    if (term) {
                        total += fee.fsS_ToBePaid || 0;
                        concession += fee.fsS_ConcessionAmount || 0;
                        fine += fee.fsS_FineAmount || 0;
                    }
                }
            });
        }

        setTotalAmount(total);
        setConcessionAmount(concession);
        setFineAmount(fine);

        return total + fine - concession;
    };

    // Update amounts when selection changes
    useEffect(() => {
        calculateAmounts();
    }, [selectedGroups]);

    const handleTermSelection = (term: any) => {
        if (term.termdisablechk) return;

        term.checkedheadlst = !term.checkedheadlst;

        // Check if all terms in the group are selected
        if (initialData?.termlst && initialData?.customgrplist) {
            const groupTerms = initialData.termlst.filter((t: any) => t.fmgG_Id === term.fmgG_Id && !t.termdisablechk);
            const selectedTermsInGroup = groupTerms.filter((t: any) => t.checkedheadlst);

            const newSelectedGroups = new Set(selectedGroups);

            if (selectedTermsInGroup.length > 0) {
                newSelectedGroups.add(term.fmgG_Id);
            } else {
                newSelectedGroups.delete(term.fmgG_Id);
            }

            setSelectedGroups(newSelectedGroups);
        }
    };

    const toggleGroupExpansion = (groupId: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupId)) {
            newExpanded.delete(groupId);
        } else {
            newExpanded.add(groupId);
        }
        setExpandedGroups(newExpanded);
    };

    const handleShowFeeDetails = () => {
        if (selectedGroups.size === 0) {
            alert('Please select at least one fee group before proceeding to fee details.');
            return;
        }
        setShowFeeDetails(true);
    };

    const handleCancel = () => {
        setShowFeeDetails(false);
    };

    const handleProceedToPayment = () => {
        const calculatedTotal = calculateAmounts();

        if (calculatedTotal === 0) {
            alert('No payment amount due. Please check your fee details.');
            return;
        }

        // Validate email/mobile (from AngularJS reference)
        const studentData = initialData?.fillstudent?.[0];
        if (!studentData?.amst_mobile && !studentData?.amst_email_id) {
            alert('Email-Id / Mobile No is Missing!!!! So You cannot proceed with Payment');
            return;
        }

        setIsLoading(true);

        // Get available payment gateways from API (filter duplicates)
        const allGateways = initialData?.fillpaymentgateway || [];
        const paymentGateways = allGateways.filter(
            (gateway: any, index: number, self: any[]) => index === self.findIndex((g: any) => g.fpgD_PGName === gateway.fpgD_PGName)
        );

        if (paymentGateways.length === 0) {
            alert('No payment gateways available. Please contact administration.');
            setIsLoading(false);
            return;
        }

        // Find the selected gateway
        const selectedGateway = paymentGateways.find((gw: any) => gw.fpgD_PGName === selectedPaymentGateway);

        if (!selectedGateway) {
            alert('Selected payment gateway is not available. Please choose another gateway.');
            setIsLoading(false);
            return;
        }

        // Show payment confirmation with gateway info
        const confirmPayment = confirm(`Proceed to pay ₹${calculatedTotal.toLocaleString()} via ${selectedGateway.fpgD_PGName}?`);
        if (confirmPayment) {
            // Initialize payment based on gateway type
            if (selectedGateway.fpgD_PGName === 'RAZORPAY') {
                initializeRazorpayPayment(calculatedTotal, selectedGateway);
            } else if (selectedGateway.fpgD_PGName === 'EASEBUZZ') {
                initializeEasebuzzPayment(calculatedTotal, selectedGateway);
            } else {
                alert('Payment gateway not supported.');
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    const initializeRazorpayPayment = (amount: number, gateway: any) => {
        alert(`Initializing Razorpay payment for ₹${amount.toLocaleString()}...`);

        // Placeholder for actual Razorpay integration
        // const options = {
        //   key: 'your_razorpay_key',
        //   amount: amount * 100, // Razorpay expects amount in paise
        //   currency: 'INR',
        //   name: 'VAPS Educational Institution',
        //   description: 'Fee Payment',
        //   handler: function (response: any) {
        //     // Handle payment success
        //     console.log('Payment successful:', response);
        //   },
        //   modal: {
        //     ondismiss: function() {
        //       console.log('Payment modal closed');
        //     }
        //   }
        // };
        // const rzp = new Razorpay(options);
        // rzp.open();
    };

    const initializeEasebuzzPayment = (amount: number, gateway: any) => {
        alert(`Initializing Easebuzz payment for ₹${amount.toLocaleString()}...`);

        // Placeholder for actual Easebuzz integration
        // window.location.href = `https://pay.easebuzz.in/pay/${paymentKey}`;
    };

    const handleViewPaymentCharges = () => {
        setShowChargesModal(true);
    };

    return (
        <div className='space-y-6'>
            <h1 className='font-bold text-3xl'>Fee Online Payment</h1>
            <div className='flex items-center justify-between'>
                <Button variant='outline' onClick={handleViewPaymentCharges} className='flex items-center gap-2'>
                    <Info className='h-4 w-1' />
                    View Online Payment Charges
                </Button>
            </div>

            <Card hidden={true}>
                <CardHeader>
                    <CardTitle>Academic Year Selection</CardTitle>
                    <CardDescription>Select the academic year for fee payment</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label htmlFor='academicYear'>Academic Year *</Label>
                            <Select onValueChange={handleAcademicYearChange} value={selectedAcademicYear} disabled={isLoading}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Academic Year'>
                                        {selectedAcademicYear
                                            ? initialData?.academicyrlist?.find(
                                                  (year: any) => year.asmaY_Id.toString() === selectedAcademicYear
                                              )?.asmaY_Year
                                            : 'Select Academic Year'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {initialData?.academicyrlist?.map((year: any) => (
                                        <SelectItem key={year.asmaY_Id} value={year.asmaY_Id.toString()}>
                                            {year.asmaY_Year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showPaymentDetails && initialData?.fillstudent && (
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-3'>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Name:</span>
                                    <span>
                                        {initialData?.fillstudent?.[0]?.amsT_FirstName} {initialData?.fillstudent?.[0]?.amsT_LastName}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Class/Section/Roll No:</span>
                                    <span>
                                        {initialData?.fillstudent?.[0]?.classname} / {initialData?.fillstudent?.[0]?.sectionname} /{' '}
                                        {initialData?.fillstudent?.[0]?.amaY_RollNo}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Adm No:</span>
                                    <span>{initialData?.fillstudent?.[0]?.amsT_AdmNo}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Mobile No:</span>
                                    <span>{initialData?.fillstudent?.[0]?.amst_mobile}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Email-Id:</span>
                                    <span>{initialData?.fillstudent?.[0]?.amst_email_id}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Group List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='max-h-64 space-y-2 overflow-y-auto'>
                                {initialData?.customgrplist?.map((group: any, groupIndex: number) => (
                                    <div key={group.fmgG_Id}>
                                        <div className='flex items-center gap-2'>
                                            <Checkbox
                                                checked={selectedGroups.has(group.fmgG_Id)}
                                                onCheckedChange={() => handleGroupSelection(group.fmgG_Id)}
                                            />
                                            <span className='font-bold text-purple-600'>{group.fmgG_GroupName}</span>
                                        </div>

                                        <div className='ml-6 space-y-1'>
                                            {initialData?.termlst
                                                ?.filter((term: any) => term.fmgG_Id === group.fmgG_Id)
                                                .map((term: any, termIndex: number) => (
                                                    <div key={term.fmT_Id} className='flex items-center gap-2'>
                                                        <Checkbox
                                                            checked={term.checkedheadlst || false}
                                                            disabled={term.termdisablechk || false}
                                                            onCheckedChange={() => handleTermSelection(term)}
                                                        />
                                                        <span className={`text-sm ${term.termdisablechk ? 'text-gray-400' : ''}`}>
                                                            {term.fmT_Name}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-4 flex gap-2'>
                                <Button onClick={handleShowFeeDetails} className='flex items-center gap-2' disabled={isLoading}>
                                    <CreditCard className='h-4 w-4' />
                                    Show Fee Details
                                </Button>
                                <Button variant='outline' onClick={handleCancel} disabled={isLoading}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {showFeeDetails && (
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Details</CardTitle>
                        <CardDescription>Selected fee groups and payment amounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            {/* Current Year Charges Summary */}
                            <div className='rounded-lg border bg-gray-50 p-4'>
                                <h3 className='mb-4 font-semibold text-lg'>Current Year Charges Summary</h3>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                                    <div className='text-center'>
                                        <span className='block text-gray-500 text-sm'>Current Year Charges</span>
                                        <p className='font-bold text-blue-600 text-xl'>
                                            ₹
                                            {initialData?.filonlinepaymentgrid
                                                ?.reduce((total: number, fee: any) => total + (fee.fsS_NetAmount || 0), 0)
                                                .toLocaleString()}
                                        </p>
                                    </div>
                                    <div className='text-center'>
                                        <span className='block text-gray-500 text-sm'>Current Year Paid</span>
                                        <p className='font-bold text-green-600 text-xl'>
                                            ₹
                                            {initialData?.filonlinepaymentgrid
                                                ?.reduce((total: number, fee: any) => total + (fee.fsS_PaidAmount || 0), 0)
                                                .toLocaleString()}
                                        </p>
                                    </div>
                                    <div className='text-center'>
                                        <span className='block text-gray-500 text-sm'>Current Year Outstanding</span>
                                        <p className='font-bold text-orange-600 text-xl'>
                                            ₹
                                            {initialData?.filonlinepaymentgrid
                                                ?.reduce((total: number, fee: any) => total + (fee.fsS_ToBePaid || 0), 0)
                                                .toLocaleString()}
                                        </p>
                                    </div>
                                    <div className='text-center'>
                                        <span className='block text-gray-500 text-sm'>Current Year Concession</span>
                                        <p className='font-bold text-purple-600 text-xl'>
                                            ₹
                                            {initialData?.filonlinepaymentgrid
                                                ?.reduce((total: number, fee: any) => total + (fee.fsS_ConcessionAmount || 0), 0)
                                                .toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-4'>
                                {initialData?.filonlinepaymentgrid?.map((fee: any, index: number) => (
                                    <div key={index} className='rounded-lg border p-4'>
                                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                                            <div>
                                                <span className='text-gray-500 text-sm'>Net Amount</span>
                                                <p className='font-semibold'>₹{fee.fsS_NetAmount?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <span className='text-gray-500 text-sm'>Paid Amount</span>
                                                <p className='font-semibold text-green-600'>₹{fee.fsS_PaidAmount?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <span className='text-gray-500 text-sm'>To Be Paid</span>
                                                <p className='font-semibold text-orange-600'>₹{fee.fsS_ToBePaid?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <span className='text-gray-500 text-sm'>Concession</span>
                                                <p className='font-semibold text-blue-600'>₹{fee.fsS_ConcessionAmount?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Gateway Selection */}
                            <div className='mt-4 border-t pt-4'>
                                <div className='space-y-3'>
                                    <Label className='font-medium text-base'>Select Payment Gateway</Label>
                                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                                        {(() => {
                                            // Filter unique gateways by name
                                            const allGateways = initialData?.fillpaymentgateway || [];
                                            const uniqueGateways = allGateways.filter(
                                                (gateway: any, index: number, self: any[]) =>
                                                    index === self.findIndex((g: any) => g.fpgD_PGName === gateway.fpgD_PGName)
                                            );

                                            return uniqueGateways.map((gateway: any) => (
                                                <div
                                                    key={gateway.fpgD_Id}
                                                    onClick={() => setSelectedPaymentGateway(gateway.fpgD_PGName)}
                                                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                                                        selectedPaymentGateway === gateway.fpgD_PGName
                                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <div className='flex items-center space-x-3'>
                                                        <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600'>
                                                            <CreditCard className='h-6 w-6 text-white' />
                                                        </div>
                                                        <div className='flex-1'>
                                                            <h3 className='font-semibold text-gray-900'>{gateway.fpgD_PGName}</h3>
                                                            <p className='text-gray-500 text-sm'>Secure online payment</p>
                                                        </div>
                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                                selectedPaymentGateway === gateway.fpgD_PGName
                                                                    ? 'border-blue-500 bg-blue-500'
                                                                    : 'border-gray-300'
                                                            }`}>
                                                            {selectedPaymentGateway === gateway.fpgD_PGName && (
                                                                <div className='h-2 w-2 rounded-full bg-white' />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Amount Summary */}
                            <div className='mt-4 border-t pt-4'>
                                <div className='rounded-lg bg-gray-50 p-4'>
                                    <h3 className='mb-3 font-semibold text-lg'>Payment Summary</h3>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>Total Amount:</span>
                                            <span className='font-medium'>₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>Concession:</span>
                                            <span className='font-medium text-blue-600'>-₹{concessionAmount.toLocaleString()}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-600'>Fine Amount:</span>
                                            <span className='font-medium text-red-600'>+₹{fineAmount.toLocaleString()}</span>
                                        </div>
                                        <div className='mt-2 border-t pt-2'>
                                            <div className='flex justify-between'>
                                                <span className='font-semibold'>Net Payable:</span>
                                                <span className='font-bold text-green-600 text-lg'>
                                                    ₹{(totalAmount + fineAmount - concessionAmount).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6 flex justify-end gap-2'>
                                <Button onClick={handleProceedToPayment} className='flex items-center gap-2' disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className='h-4 w-4' />
                                            Proceed to Payment
                                        </>
                                    )}
                                </Button>
                                <Button variant='outline' onClick={() => setShowFeeDetails(false)} disabled={isLoading}>
                                    Back
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
