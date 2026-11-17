
import { ColumnDef } from "@tanstack/react-table";
import { IInvRItemConsumptionReportData } from "@/types/inventory/reports/inv-r-item-consumption";
import { format } from "date-fns";

export const getColumns = (
    typeflag: string,
    optionflag: string | undefined
): ColumnDef<any>[] => {

    const commonNumberClass = "text-right font-mono";

    // Common Helpers
    const slNoCol: ColumnDef<IInvRItemConsumptionReportData> = {
        accessorKey: "sno",
        header: "SL.No.",
        cell: ({ row }) => row.index + 1,
        size: 60,
    };

    // --- Fields ---
    const itemCol: ColumnDef<any> = { accessorKey: "itemName", header: "Item" };
    const itemCodeCol: ColumnDef<any> = { accessorKey: "itemCode", header: "Item Code" }; // Assuming itemCode is not in response, keeping for structure
    const uomCol: ColumnDef<any> = { accessorKey: "invmuoM_UOMName", header: "UOM" };

    const dateCol: ColumnDef<any> = {
        accessorKey: "icDate",
        header: "Date",
        cell: ({ row }) => {
            const val = row.getValue("icDate") as string;
            return val ? format(new Date(val), 'dd/MM/yyyy') : '';
        }
    };

    const qtyCol: ColumnDef<any> = {
        accessorKey: "icQty",
        header: "Quantity",
        cell: ({ row }) => <div className="text-right font-mono">{Number(row.getValue("icQty")).toFixed(2)}</div>
    };

    // Staff Columns
    const memberNameCol: ColumnDef<any> = { accessorKey: "memberName", header: "Employee Name" };
    const memberCodeCol: ColumnDef<any> = { accessorKey: "memberCode", header: "Employee Code" };

    // Department Columns
    const departmentNameCol: ColumnDef<any> = { accessorKey: "memberName", header: "Department" };

    // Student Columns
    const studentNameCol: ColumnDef<any> = { accessorKey: "memberName", header: "Student Name" };
    const admNoCol: ColumnDef<any> = { accessorKey: "memberCode", header: "Admission No." };

    // Helper for common simple columns
    const simpleCol = (key: string, title: string): ColumnDef<any> => ({ accessorKey: key, header: title });

    // Logic based on Angular Controller & User provided response
    // Response keys: itemId, itemName, icQty, icDate, INVMUOM_UOMName

    if (typeflag === 'Overall') {
        if (optionflag === 'Item') {
            return [slNoCol, itemCol, uomCol, qtyCol];
        }
        if (optionflag === 'Staff') {
            return [slNoCol, memberNameCol, memberCodeCol, qtyCol];
        }
        if (optionflag === 'Department') {
            return [slNoCol, departmentNameCol, qtyCol];
        }
        if (optionflag === 'Student') {
            return [slNoCol, studentNameCol, admNoCol, qtyCol];
        }
        // Add other Overall options if needed or if response supports them
    }

    if (typeflag === 'Detailed') {
        if (optionflag === 'Item') {
            // Response has itemName, icQty, icDate
            return [slNoCol, itemCol, uomCol, dateCol, qtyCol];
        }
    }

    // Default Fallback
    return [slNoCol, itemCol, uomCol, dateCol, qtyCol];
};
