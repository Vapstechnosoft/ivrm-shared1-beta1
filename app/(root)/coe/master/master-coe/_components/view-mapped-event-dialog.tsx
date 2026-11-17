import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getMappedEventDetails } from "@/server/coe/masters/masterevent";
import { MappedEventCoe } from "@/types/coe/master-coe";
import { format } from "date-fns";
import { Check, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ViewMappedEventDialogProps {
    rowData: MappedEventCoe;
    onClose: () => void;
}

export function ViewMappedEventDialog({ rowData, onClose }: ViewMappedEventDialogProps) {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (rowData?.coeE_Id) {
                setIsLoading(true);
                try {
                    const res = await getMappedEventDetails(rowData.coeE_Id);
                    if (res && res.data && res.data.edit_map_event) {
                        // API returns viewrecordspopupdisplay2 as per user HTML context implication
                        setData(res.data.edit_map_event);
                    } else if (res && res.data && Array.isArray(res.data)) {
                        // Fallback if data structure is different but still an array
                        setData(res.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch details", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [rowData]);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] w-fit max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden">
                <DialogHeader className="flex-none">
                    <DialogTitle>Mapped Event Details</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 w-full rounded-md border p-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="min-w-[1200px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">SLNO</TableHead>
                                        <TableHead className="whitespace-nowrap">Start Date</TableHead>
                                        <TableHead className="whitespace-nowrap">End Date</TableHead>
                                        <TableHead className="whitespace-nowrap">Reminder Date</TableHead>
                                        <TableHead className="whitespace-nowrap text-center">SMS Flag</TableHead>
                                        <TableHead className="min-w-[200px]">SMS Message</TableHead>
                                        <TableHead className="whitespace-nowrap text-center">Email Flag</TableHead>
                                        <TableHead className="min-w-[150px]">Mail Subject</TableHead>
                                        <TableHead className="min-w-[150px]">Mail Header</TableHead>
                                        <TableHead className="min-w-[150px]">Mail Footer</TableHead>
                                        <TableHead className="min-w-[200px]">Mail Message</TableHead>
                                        <TableHead className="min-w-[200px]">Mail HTML Template</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {item.coeE_EStartDate ? format(new Date(item.coeE_EStartDate), "dd/MM/yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {item.coeE_EEndDate ? format(new Date(item.coeE_EEndDate), "dd/MM/yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {item.coeE_ReminderDate ? format(new Date(item.coeE_ReminderDate), "dd/MM/yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.coeE_SMSActiveFlag ? (
                                                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                                                ) : (
                                                    <X className="h-4 w-4 text-destructive mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell>{item.coeE_SMSMessage}</TableCell>
                                            <TableCell className="text-center">
                                                {item.coeE_MailActiveFlag ? (
                                                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                                                ) : (
                                                    <X className="h-4 w-4 text-destructive mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell>{item.coeE_MailSubject}</TableCell>
                                            <TableCell>{item.coeE_MailHeader}</TableCell>
                                            <TableCell>{item.coeE_MailFooter}</TableCell>
                                            <TableCell>{item.coeE_Mail_Message}</TableCell>
                                            <TableCell>{item.coeE_MailHTMLTemplate}</TableCell>
                                        </TableRow>
                                    ))}
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={12} className="text-center h-24 text-muted-foreground">
                                                No details found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
