import { format } from 'date-fns';

export function EmployeeStrengthReportTemplate({ data, departmentwise, leftEmployee }: { data: any, departmentwise: boolean, leftEmployee: boolean }) {
    if (!data) return null;

    const { institutionDetails, employeeDetails, totalWorkingEmployees, totalLeftEmployees } = data;
    const totalEmployeesSum = employeeDetails?.reduce((sum: number, item: any) => sum + (item.totalEmployees || 0), 0) || 0;

    return (
        <div id="print-content" className="p-8 space-y-6 font-sans">
            {/* Header */}
            <div className="text-center space-y-2 border-b pb-4">
                {institutionDetails?.mI_Logo && (
                    <img src={institutionDetails.mI_Logo} alt="Logo" className="h-16 mx-auto mb-2" />
                )}
                <h1 className="text-2xl font-bold uppercase">{institutionDetails?.mI_Name}</h1>
                <p className="text-sm">
                    {institutionDetails?.mI_Address1}, {institutionDetails?.mI_Address2}, {institutionDetails?.mI_Address3} - {institutionDetails?.mI_Pincode}
                </p>
                <h2 className="text-lg font-semibold underline underline-offset-4 decoration-1">EMPLOYEE STRENGTH REPORT</h2>
                <p className="ml-auto text-xs italic">Printed on: {format(new Date(), 'dd-MMM-yyyy HH:mm')}</p>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black p-2 text-center w-12">Sl.No</th>
                        <th className="border border-black p-2 text-left">Group Type</th>
                        <th className="border border-black p-2 text-left">Department</th>
                        {!departmentwise && !leftEmployee && (
                            <th className="border border-black p-2 text-left">Designation</th>
                        )}
                        <th className="border border-black p-2 text-right w-32">Total Employees</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeDetails?.map((emp: any, index: number) => (
                        <tr key={index}>
                            <td className="border border-black p-2 text-center">{index + 1}</td>
                            <td className="border border-black p-2 text-left">{emp.groupTypeName}</td>
                            <td className="border border-black p-2 text-left">{emp.departmentName}</td>
                            {!departmentwise && !leftEmployee && (
                                <td className="border border-black p-2 text-left">{emp.designationName || '-'}</td>
                            )}
                            <td className="border border-black p-2 text-right">{emp.totalEmployees}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold">
                        <td className="border border-black p-2 text-right" colSpan={!departmentwise && !leftEmployee ? 4 : 3}>
                            Total
                        </td>
                        <td className="border border-black p-2 text-right">{totalEmployeesSum}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Summary Box */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-1/2 ml-auto">
                <div className="border border-black p-2 flex justify-between bg-gray-50">
                    <span>Total Working Employees:</span>
                    <span className="font-bold">{totalWorkingEmployees}</span>
                </div>
                <div className="border border-black p-2 flex justify-between bg-gray-50">
                    <span>Total Left Employees:</span>
                    <span className="font-bold">{totalLeftEmployees}</span>
                </div>
            </div>

            {/* Footer Signatures */}
            <div className="mt-20 flex justify-between text-sm font-semibold pt-10">
                <div className="border-t border-black w-40 text-center pt-1">Prepared By</div>
                <div className="border-t border-black w-40 text-center pt-1">H.O.D.</div>
                <div className="border-t border-black w-40 text-center pt-1">Principal / Director</div>
            </div>
        </div>
    );
}
