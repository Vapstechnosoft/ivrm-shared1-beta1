"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table"; // Assuming this exists or use basic table
import { columns } from "./columns";
import {
    getAmountDetails,
    savePayment,
    getFeeOnlinePaymentLoadData
} from "../actions";
import { FeeOnlinePaymentProps, GroupTermMapping, FeeTerm, FeeStructure } from "../types";
import Script from "next/script";

// Type for Razorpay global
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function FeeOnlinePaymentClient({ initialData }: any) { // Using any for initialData to bypass strict type check on mock for now
    const [academicYear, setAcademicYear] = useState<number | undefined>(
        initialData?.academicyrlist?.[0]?.asmaY_Id
    );
    const [groupTermList, setGroupTermList] = useState<GroupTermMapping[]>([]);
    const [feeDetails, setFeeDetails] = useState<FeeStructure[]>([]);
    const [totalAmt, setTotalAmt] = useState(0);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [gateway, setGateway] = useState<string>("");

    // Student Info
    const studentInfo = initialData?.fillstudent?.[0]; // Accessing from mock structure

    useEffect(() => {
        if (initialData?.customgrplist && initialData?.termlst) {
            const mapping: GroupTermMapping[] = initialData.customgrplist.map((grp: any) => ({
                grp: { ...grp, checkedgrplst: false, grpdisable: false },
                trm_list: initialData.termlst
                    .filter((trm: any) => trm.fmgG_Id === grp.fmgG_Id)
                    .map((trm: any) => ({ ...trm, checkedheadlst: false, termdisablechk: false }))
            }));
            setGroupTermList(mapping);
            // Apply logic for disabled terms from initialData.disableterms if needed
        }
    }, [initialData]);

    const handleGroupCheck = (grpIndex: number, checked: boolean) => {
        const newList = [...groupTermList];
        newList[grpIndex].grp.checkedgrplst = checked;
        newList[grpIndex].trm_list.forEach(trm => {
            if (!trm.termdisablechk) trm.checkedheadlst = checked;
        });
        setGroupTermList(newList);
    };

    const handleTermCheck = (grpIndex: number, trmIndex: number, checked: boolean) => {
        const newList = [...groupTermList];
        newList[grpIndex].trm_list[trmIndex].checkedheadlst = checked;

        // Update group check state based on terms
        const allTermsChecked = newList[grpIndex].trm_list
            .filter(t => !t.termdisablechk)
            .every(t => t.checkedheadlst);
        const someTermsChecked = newList[grpIndex].trm_list.some(t => t.checkedheadlst);

        // Logic mimics AngularJS: if any term is unchecked, group is unchecked? Or only if all?
        // AngularJS: if term checked, group checked (sometimes). 
        // Simple logic: if any term checked, check group. 
        if (someTermsChecked) {
            newList[grpIndex].grp.checkedgrplst = true;
        } else {
            newList[grpIndex].grp.checkedgrplst = false;
        }

        setGroupTermList(newList);
    };

    const handleShowDetails = async () => {
        const selectedList = groupTermList
            .filter(g => g.grp.checkedgrplst)
            .map(g => ({
                grp: g.grp,
                trm_list: g.trm_list.filter(t => t.checkedheadlst)
            }));

        if (selectedList.length === 0 || selectedList.some(g => g.trm_list.length === 0)) {
            alert("Please select at least one Group and Term");
            return;
        }

        const result = await getAmountDetails({ selected_list: selectedList });
        if (result.success && result.data) {
            setFeeDetails(result.data.fillstudentviewdetails || []);
            setShowPaymentDetails(true);
            // Calculate initial total
            const total = (result.data.fillstudentviewdetails || []).reduce((acc: number, curr: any) => acc + curr.fsS_ToBePaid, 0);
            setTotalAmt(total);
        }
    };

    // Payment Logic (Razorpay)
    const handlePayment = async () => {
        if (!gateway) {
            alert("Please select a payment gateway");
            return;
        }

        const payload = {
            topayamount: totalAmt,
            students: feeDetails,
            onlinepaygteway: gateway
            // Add other necessary fields
        };

        const response = await savePayment(payload);
        if (response.success && response.data && gateway === "RAZORPAY") {
            const rzpData = response.data;
            const options = {
                "key": rzpData.merchantkey, // Enter the Key ID generated from the Dashboard
                "amount": rzpData.fmA_Amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Edumeeting School",
                "description": "Fee Payment",
                "image": "/assets/images/logo.png",
                "order_id": rzpData.trans_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": function (response: any) {
                    alert("Payment Successful: " + response.razorpay_payment_id);
                    // verifyPayment(response);
                },
                "prefill": {
                    "name": rzpData.fillstudent?.[0]?.amsT_FirstName,
                    "email": rzpData.fillstudent?.[0]?.amst_email_id,
                    "contact": rzpData.fillstudent?.[0]?.amst_mobile
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        }
    };

    return (
        <div className="space-y-6">
            {/* Script for Razorpay */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <Card>
                <CardHeader>
                    <CardTitle>Fee Online Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Academic Year Selection */}
                    <div className="flex items-center space-x-4">
                        <label className="font-semibold w-1/4">Academic Year: <span className="text-red-500">*</span></label>
                        <Select
                            value={String(academicYear)}
                            onValueChange={(val) => setAcademicYear(Number(val))}
                        >
                            <SelectTrigger className="w-1/3">
                                <SelectValue placeholder="Select Academic Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialData.academicyrlist?.map((year: any, index: number) => (
                                    <SelectItem key={`${year.asmaY_Id}-${index}`} value={String(year.asmaY_Id)}>
                                        {year.asmaY_Year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Information */}
                        <div className="border p-4 rounded-md">
                            <h3 className="font-bold mb-4 text-primary">Student Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-3">
                                    <span className="font-semibold">Name</span>
                                    <span className="col-span-2">: {studentInfo?.amsT_FirstName} {studentInfo?.amsT_LastName}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-semibold">Class/Section</span>
                                    <span className="col-span-2">: {studentInfo?.classname} / {studentInfo?.sectionname}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-semibold">Adm No</span>
                                    <span className="col-span-2">: {studentInfo?.amsT_AdmNo}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-semibold">Mobile</span>
                                    <span className="col-span-2">: {studentInfo?.amst_mobile}</span>
                                </div>
                                <div className="grid grid-cols-3">
                                    <span className="font-semibold">Email</span>
                                    <span className="col-span-2">: {studentInfo?.amst_email_id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Group Selection */}
                        <div className="border p-4 rounded-md h-64 overflow-y-auto">
                            <h3 className="font-bold mb-4 text-primary">Group List <span className="text-red-500">*</span></h3>
                            <div className="space-y-2">
                                {groupTermList.map((grpItem, grpIndex) => (
                                    <div key={`${grpItem.grp.fmgG_Id}-${grpIndex}`} className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={grpItem.grp.checkedgrplst}
                                                onCheckedChange={(checked) => handleGroupCheck(grpIndex, !!checked)}
                                                disabled={grpItem.grp.grpdisable}
                                            />
                                            <span className="font-medium">{grpItem.grp.fmgG_GroupName}</span>
                                        </div>
                                        <div className="ml-6 space-y-1">
                                            {grpItem.trm_list.map((trm, trmIndex) => (
                                                <div key={`${trm.fmT_Id}-${trmIndex}`} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={trm.checkedheadlst}
                                                        onCheckedChange={(checked) => handleTermCheck(grpIndex, trmIndex, !!checked)}
                                                        disabled={trm.termdisablechk}
                                                    />
                                                    <span>{trm.fmT_Name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Button onClick={handleShowDetails}>
                            Show
                        </Button>
                        <Button variant="destructive" onClick={() => window.location.reload()}>
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {showPaymentDetails && (
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Using a basic table structure for now, can upgrade to DataTable */}
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-2 border">Select</th>
                                        <th className="p-2 border">SLNO</th>
                                        <th className="p-2 border">Head Name</th>
                                        <th className="p-2 border">Installment</th>
                                        <th className="p-2 border">Opening Balance</th>
                                        <th className="p-2 border">Receivable</th>
                                        <th className="p-2 border">Charges</th>
                                        <th className="p-2 border">Concession</th>
                                        <th className="p-2 border">Fine</th>
                                        <th className="p-2 border">Payable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeDetails.map((row, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2 border text-center">
                                                <Checkbox checked={true} />
                                            </td>
                                            <td className="p-2 border text-center">{index + 1}</td>
                                            <td className="p-2 border">{row.fmH_FeeName}</td>
                                            <td className="p-2 border">{row.ftI_Name}</td>
                                            <td className="p-2 border text-right">{row.fsS_OBArrearAmount}</td>
                                            <td className="p-2 border text-right">{row.fsS_NetAmount}</td>
                                            <td className="p-2 border text-right">{row.fsS_TotalToBePaid}</td>
                                            <td className="p-2 border text-right">{row.fsS_ConcessionAmount}</td>
                                            <td className="p-2 border text-right">{row.fsS_FineAmount}</td>
                                            <td className="p-2 border text-right">{row.fsS_ToBePaid}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center flex-col items-center space-y-2 mt-4">
                            <div className="flex items-center space-x-4">
                                <label className="font-bold">Total Payable:</label>
                                <Input value={totalAmt} readOnly className="w-32 font-bold" />
                            </div>

                            <div className="flex space-x-6 mt-4">
                                <div className="flex items-center space-x-2 border p-4 rounded cursor-pointer hover:bg-muted" onClick={() => setGateway("RAZORPAY")}>
                                    <input type="radio" checked={gateway === "RAZORPAY"} readOnly />
                                    {/* <img src="/assets/images/razorpay.png" alt="Razorpay" className="h-8"/> */}
                                    <span className="font-bold">Razorpay</span>
                                </div>
                            </div>

                            <Button size="lg" className="mt-4 bg-green-600 hover:bg-green-700" onClick={handlePayment}>
                                CLICK HERE TO PAY NOW
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
