
import { ColumnDef } from "@tanstack/react-table";
import { IInvRSalesReportData } from "@/types/inventory/reports/inv-r-sales";

export const getColumns = (
    typeflag: string,
    optionflag: string | undefined,
    showTax: boolean,
    showDiscount: boolean,
    page: number = 1,
    pageSize: number = 10
): ColumnDef<IInvRSalesReportData>[] => {

    const commonNumberClass = "text-right font-mono";
    const rightHeader = (title: string) => <div className="text-right w-full">{title}</div>;

    // Function to calculate global row index
    const getRowNumber = (index: number) => (page - 1) * pageSize + index + 1;

    const dateCell = ({ row }: any) => {
        const date = row.original.sales_Date || row.original.invmsL_SalesDate;
        if (!date) return '';
        return date.split('T')[0];
    };

    let columns: ColumnDef<IInvRSalesReportData>[] = [];

    // Common Columns
    const slNoCol: ColumnDef<IInvRSalesReportData> = {
        accessorKey: "rowNumber",
        header: "SL.No.",
        cell: ({ row }) => getRowNumber(row.index),
        size: 60,
    };

    const salesNoCol: ColumnDef<IInvRSalesReportData> = {
        id: "sales_no",
        header: "Sale No",
        accessorFn: (row) => row.invmsL_SalesNo || row.invmsl_SalesNo || (row as any).Invmsl_SalesNo
    };

    const salesDateCol: ColumnDef<IInvRSalesReportData> = {
        id: "sales_date",
        header: "Sale Date",
        accessorFn: (row) => row.sales_Date || row.invmsL_SalesDate || row.invmsl_SalesDate,
        cell: dateCell
    };

    const itemCol: ColumnDef<IInvRSalesReportData> = {
        id: "item_name",
        header: "Item",
        accessorFn: (row) => row.item_Name || row.invmI_ItemName || row.invmi_ItemName
    };

    const quantityCol: ColumnDef<IInvRSalesReportData> = {
        id: "qty",
        header: () => rightHeader("Quantity"),
        cell: ({ row }) => {
            const val = row.original.sales_Qty ?? row.original.invtsL_SalesQty ?? row.original.saleQty ?? row.original.invtsl_SalesQty ?? 0;
            return <div className={commonNumberClass}>{Number(val).toFixed(2)}</div>;
        }
    };

    const priceCol: ColumnDef<IInvRSalesReportData> = {
        id: "price",
        header: () => rightHeader("Price"),
        cell: ({ row }) => {
            const val = row.original.sales_Price ?? row.original.invtsL_SalesPrice ?? row.original.salePrice ?? row.original.invtsl_SalesPrice ?? 0;
            return <div className={commonNumberClass}>{Number(val).toFixed(2)}</div>;
        }
    };

    const amountCol: ColumnDef<IInvRSalesReportData> = {
        id: "amount",
        header: () => rightHeader("Amount"),
        cell: ({ row }) => {
            const val = row.original.total_Amount ?? row.original.invtsL_Amount ?? row.original.saleAmount ?? row.original.invtsl_Amount ?? 0;
            return <div className={commonNumberClass}>{Number(val).toFixed(2)}</div>;
        }
    };

    const taxCol: ColumnDef<IInvRSalesReportData> = {
        id: "tax",
        header: () => rightHeader("Tax"),
        cell: ({ row }) => {
            const val = row.original.tax_Amt ?? row.original.invtsL_TaxAmt ?? row.original.saleTax ?? row.original.invtsl_TaxAmt ?? 0;
            return <div className={commonNumberClass}>{Number(val).toFixed(2)}</div>;
        }
    };

    const discountCol: ColumnDef<IInvRSalesReportData> = {
        id: "discount",
        header: () => rightHeader("Discount"),
        cell: ({ row }) => {
            const val = row.original.discount_Amt ?? row.original.invtsL_DiscountAmt ?? row.original.saleDiscount ?? row.original.invtsl_DiscountAmt ?? 0;
            return <div className={commonNumberClass}>{Number(val).toFixed(2)}</div>;
        }
    };

    const nameCol: ColumnDef<IInvRSalesReportData> = {
        accessorKey: "membername",
        header: "Name",
        accessorFn: (row) => row.membername || row.memberName
    };

    const admNoCol: ColumnDef<IInvRSalesReportData> = {
        accessorKey: "amsT_AdmNo",
        header: "Adm.No.",
    };


    if (typeflag === 'All') {
        columns = [slNoCol, itemCol, salesNoCol, salesDateCol, quantityCol, priceCol, amountCol];
        if (showTax) columns.push(taxCol);
        if (showDiscount) columns.push(discountCol);
    } else if (typeflag === 'Detailed') {
        if (optionflag === 'Item') {
            columns = [slNoCol, salesNoCol, salesDateCol, itemCol, quantityCol, priceCol, amountCol];
        } else if (optionflag === 'Student' || optionflag === 'Staff' || optionflag === 'Customer') {
            columns = [slNoCol, salesNoCol, salesDateCol, itemCol, nameCol, quantityCol, priceCol, amountCol];
        } else if (optionflag === 'Saleno') {
            columns = [slNoCol, salesNoCol, salesDateCol, itemCol, nameCol, quantityCol, priceCol, amountCol];
        }

        if (showTax) columns.push(taxCol);
        if (showDiscount) columns.push(discountCol);

    } else if (typeflag === 'Overall') {
        if (optionflag === 'Item') {
            columns = [slNoCol, itemCol, quantityCol, priceCol, amountCol];
        } else if (optionflag === 'Student' || optionflag === 'Staff' || optionflag === 'Customer') {
            columns = [slNoCol, nameCol];
            // if (optionflag === 'Student') columns.push(admNoCol); // Removed as per response structure not having AdmNo
            columns.push(quantityCol, priceCol, amountCol);
        }

        if (showTax) columns.push(taxCol);
        if (showDiscount) columns.push(discountCol);
    }

    return columns;
};
