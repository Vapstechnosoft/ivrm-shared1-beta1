
import { ColumnDef } from "@tanstack/react-table";
import { IInvRStockReportData } from "@/types/inventory/reports/inv-r-stock";

export const getColumns = (
    optionflag: string,
    overallflag: boolean
): ColumnDef<IInvRStockReportData>[] => {

    const commonNumberClass = "text-right font-mono";

    const slNoCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "sno",
        header: "SL.No.",
        cell: ({ row }) => row.index + 1,
        size: 60,
    };

    const itemCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "invmI_ItemName",
        header: "Item",
    };

    const obQtyCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "purOBQty",
        header: "Opening Balance",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("purOBQty")).toFixed(2)}</div>
    };


    // Non-Overall columns
    const rateCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "invstO_PurchaseRate",
        header: "Rate",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invstO_PurchaseRate") || 0).toFixed(2)}</div>
    };

    const obAmtCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "obAmount",
        header: "OB Amount",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("obAmount") || 0).toFixed(2)}</div>
    };


    const saleQtyCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "salesQty",
        header: "Sale Qty",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("salesQty") || 0).toFixed(2)}</div>
    };

    const itemConQtyCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "invstO_ItemConQty",
        header: "Item Cons.",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invstO_ItemConQty") || 0).toFixed(2)}</div>
    };

    const checkedOutQtyCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "invstO_CheckedOutQty",
        header: "Checked Out",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invstO_CheckedOutQty") || 0).toFixed(2)}</div>
    };

    const stockPlusCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "invstO_PhyPlusQty",
        header: "Stock +",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invstO_PhyPlusQty") || 0).toFixed(2)}</div>
    };

    const stockMinCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "invstO_PhyMinQty",
        header: "Stock -",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invstO_PhyMinQty") || 0).toFixed(2)}</div>
    };

    const balanceCol: ColumnDef<IInvRStockReportData> = {
        accessorKey: "invstO_AvaiableStock",
        header: "Balance",
        cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invstO_AvaiableStock") || 0).toFixed(2)}</div>
    };

    let columns: ColumnDef<IInvRStockReportData>[] = [slNoCol];

    if (optionflag !== 'Item') {
        columns.push(itemCol);
    }

    columns.push(obQtyCol);

    if (!overallflag) {
        columns.push(rateCol);
        columns.push(obAmtCol);
    }

    columns.push(saleQtyCol);
    columns.push(itemConQtyCol);
    columns.push(checkedOutQtyCol);
    columns.push(stockPlusCol);
    columns.push(stockMinCol);
    columns.push(balanceCol);

    return columns;
};
