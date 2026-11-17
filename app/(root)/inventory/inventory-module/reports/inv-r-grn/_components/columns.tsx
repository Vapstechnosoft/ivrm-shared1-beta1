
import { ColumnDef } from "@tanstack/react-table";
import { IInvRGRNReportData } from "@/types/inventory/reports/inv-r-grn";

export const getColumns = (typeflag: string, optionflag?: string, page: number = 1, pageSize: number = 10): ColumnDef<IInvRGRNReportData>[] => {
    const commonNumberClass = "text-right font-mono";
    const rightHeader = (title: string) => <div className="text-right w-full">{title}</div>;

    // Function to calculate global row index
    const getRowNumber = (index: number) => (page - 1) * pageSize + index + 1;

    if (typeflag === 'All' || typeflag === 'Detailed') {
        return [
            {
                accessorKey: "rowNumber",
                header: "SL.No.",
                cell: ({ row }) => getRowNumber(row.index),
                size: 60,
            },
            {
                accessorKey: "invmgrn_grnno",
                header: "GRN No",
            },
            {
                accessorKey: "invmgrn_purchasedate",
                header: "Purchase Date",
                cell: ({ row }) => {
                    const date = row.getValue("invmgrn_purchasedate") as string;
                    // Format date if needed, for instance split 'T'
                    return date ? date.split('T')[0] : '';
                }
            },
            {
                accessorKey: "invms_suppliername",
                header: "Supplier",
            },
            {
                accessorKey: "invmi_itemname",
                header: "Item",
            },
            {
                accessorKey: "invmuom_uomname",
                header: "UOM",
            },
            {
                accessorKey: "invtgrn_qty",
                header: () => rightHeader("Quantity"),
                cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invtgrn_qty")).toFixed(2)}</div>,
            },
            {
                accessorKey: "invtgrn_purchaserate",
                header: () => rightHeader("Rate"),
                cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invtgrn_purchaserate")).toFixed(2)}</div>,
            },
            {
                accessorKey: "invtgrn_mrp",
                header: () => rightHeader("MRP"),
                cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invtgrn_mrp")).toFixed(2)}</div>,
            },
            {
                accessorKey: "invtgrn_salesprice",
                header: () => rightHeader("Sale Price"),
                cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invtgrn_salesprice")).toFixed(2)}</div>,
            },
            {
                accessorKey: "invtgrn_discountamt",
                header: () => rightHeader("Discount"),
                cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invtgrn_discountamt")).toFixed(2)}</div>,
            },
            {
                accessorKey: "invtgrn_taxamt",
                header: () => rightHeader("Tax"),
                cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invtgrn_taxamt")).toFixed(2)}</div>,
            },
            {
                accessorKey: "invtgrn_amount",
                header: () => rightHeader("Total Amount"),
                cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("invtgrn_amount")).toFixed(2)}</div>,
            },
        ];
    } else if (typeflag === 'Overall') {
        if (optionflag === 'Item_1') {
            return [
                {
                    accessorKey: "rowNumber",
                    header: "SL.No.",
                    cell: ({ row }) => getRowNumber(row.index),
                    size: 60,
                },
                {
                    id: "item_name",
                    accessorFn: (row) => row.invmi_itemname || row.invmI_ItemName,
                    header: "Item",
                },
                {
                    id: "item_code",
                    accessorFn: (row) => row.invmi_itemcode || row.invmI_ItemCode,
                    header: "Item Code",
                },
                {
                    id: "qty",
                    accessorFn: (row) => row.grnQuantity ?? row.grnquantity,
                    header: () => rightHeader("Quantity"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("qty") || 0).toFixed(2)}</div>,
                },
                {
                    id: "rate",
                    accessorFn: (row) => row.grnRate ?? row.grnrate,
                    header: () => rightHeader("Rate"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("rate") || 0).toFixed(2)}</div>,
                },
                {
                    id: "mrp",
                    accessorFn: (row) => row.grnMRP ?? row.grnmrp,
                    header: () => rightHeader("MRP"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("mrp") || 0).toFixed(2)}</div>,
                },
                {
                    id: "sale_price",
                    accessorFn: (row) => row.grnSalePrice ?? row.grnsaleprice,
                    header: () => rightHeader("Sale Price"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("sale_price") || 0).toFixed(2)}</div>,
                },
                {
                    id: "discount",
                    accessorFn: (row) => row.grnDiscount ?? row.grndiscount,
                    header: () => rightHeader("Discount"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("discount") || 0).toFixed(2)}</div>,
                },
                {
                    id: "tax",
                    accessorFn: (row) => row.grnTax ?? row.grntax,
                    header: () => rightHeader("Tax"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("tax") || 0).toFixed(2)}</div>,
                },
                {
                    id: "amount",
                    accessorFn: (row) => row.grnAmount ?? row.grnamount,
                    header: () => rightHeader("Amount"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("amount") || 0).toFixed(2)}</div>,
                },
            ];
        } else if (optionflag === 'Supplier') {
            return [
                {
                    accessorKey: "rowNumber",
                    header: "SL.No.",
                    cell: ({ row }) => getRowNumber(row.index),
                    size: 60,
                },
                {
                    id: "supplier_name",
                    accessorFn: (row) => row.invms_suppliername || row.invmS_SupplierName,
                    header: "Supplier Name",
                },
                {
                    id: "supplier_code",
                    accessorFn: (row) => row.invmS_SupplierCode, // Assuming this key might strictly be Pascal based on usage elsewhere? Or add lowercase fallback if needed.
                    header: "Code",
                },
                {
                    id: "contact",
                    accessorFn: (row) => row.invms_supplierconatctno || row.invmS_SupplierConatctNo,
                    header: "Contact No.",
                },
                {
                    id: "email",
                    accessorFn: (row) => row.invms_emailid || row.invmS_EmailId,
                    header: "Email ID",
                },
                {
                    id: "qty",
                    accessorFn: (row) => row.grnQuantity ?? row.grnquantity,
                    header: () => rightHeader("Quantity"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("qty") || 0).toFixed(2)}</div>,
                },
                {
                    id: "rate",
                    accessorFn: (row) => row.grnRate ?? row.grnrate,
                    header: () => rightHeader("Rate"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("rate") || 0).toFixed(2)}</div>,
                },
                {
                    id: "mrp",
                    accessorFn: (row) => row.grnMRP ?? row.grnmrp,
                    header: () => rightHeader("MRP"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("mrp") || 0).toFixed(2)}</div>,
                },
                {
                    id: "sale_price",
                    accessorFn: (row) => row.grnSalePrice ?? row.grnsaleprice,
                    header: () => rightHeader("Sale Price"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("sale_price") || 0).toFixed(2)}</div>,
                },
                {
                    id: "discount",
                    accessorFn: (row) => row.grnDiscount ?? row.grndiscount,
                    header: () => rightHeader("Discount"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("discount") || 0).toFixed(2)}</div>,
                },
                {
                    id: "tax",
                    accessorFn: (row) => row.grnTax ?? row.grntax,
                    header: () => rightHeader("Tax"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("tax") || 0).toFixed(2)}</div>,
                },
                {
                    id: "amount",
                    accessorFn: (row) => row.grnAmount ?? row.grnamount,
                    header: () => rightHeader("Amount"),
                    cell: ({ row }) => <div className={commonNumberClass}>{Number(row.getValue("amount") || 0).toFixed(2)}</div>,
                },
            ];
        }
    }
    return [];
};
