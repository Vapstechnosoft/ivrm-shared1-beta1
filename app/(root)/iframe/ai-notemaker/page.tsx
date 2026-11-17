"use client";

import React, { useState } from "react";
import {
    Upload,
    FileText,
    Loader2,
    Download,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    StickyNote,
    Type,
    Clipboard,
    Layout,
    Check,
    ChevronRight,
    Home
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import jsPDF from "jspdf";

export default function AINotemaker() {
    // State
    const [file, setFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState("upload");
    const [chapter, setChapter] = useState<string>("");
    const [generateSummary, setGenerateSummary] = useState<boolean>(true);
    const [generateNotes, setGenerateNotes] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ summary?: string; notes?: string; chapter?: string } | null>(null);
    const [errorLog, setErrorLog] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0];
            const ext = selectedFile.name.split('.').pop()?.toLowerCase();
            if (ext !== 'pdf' && ext !== 'txt') {
                toast.error("Currently only PDF and TXT files are supported");
                return;
            }
            setFile(selectedFile);
            toast.success("File uploaded successfully");
        }
    };

    const handleGenerate = async () => {
        if (!file) {
            toast.error("Please upload a file first");
            return;
        }

        setIsLoading(true);
        setResult(null);
        setErrorLog(null);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("chapter", chapter);

            let mode = "both";
            if (generateSummary && !generateNotes) mode = "summary";
            if (!generateSummary && generateNotes) mode = "notes";

            formData.append("mode", mode);

            const response = await fetch("/api/exam/create-notemaker", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate notes");
            }

            const data = await response.json();
            setResult(data);
            setActiveTab("preview");
            toast.success("Notes generated successfully");

        } catch (error: any) {
            console.error("Notemaker Error:", error);
            const displayMessage = error.message || "Error generating notes. Please try again.";
            setErrorMessage(displayMessage);
            toast.error(displayMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyContent = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const handleDownloadPDF = () => {
        if (!result) return;

        const doc = new jsPDF();
        let yPos = 20;

        doc.setFontSize(18);
        doc.text("AI NOTEMAKER", 105, yPos, { align: "center" });
        yPos += 10;

        doc.setFontSize(12);
        doc.text(`Chapter: ${result.chapter || "Entire Document"}`, 105, yPos, { align: "center" });
        yPos += 15;
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        if (result.summary) {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("SUMMARY", 20, yPos);
            yPos += 10;

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const splitSummary = doc.splitTextToSize(result.summary, 170);
            doc.text(splitSummary, 20, yPos);
            yPos += (splitSummary.length * 5) + 15;
        }

        if (result.notes) {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("STRUCTURED NOTES", 20, yPos);
            yPos += 10;

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const splitNotes = doc.splitTextToSize(result.notes, 170);
            doc.text(splitNotes, 20, yPos);
        }

        doc.save(`notes-${Date.now()}.pdf`);
        toast.success("PDF Downloaded");
    };

    const renderWithBold = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-primary font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen">
            <div className="container space-y-6 p-4 md:p-6">


                {errorMessage && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Operation Failed</AlertTitle>
                        <AlertDescription className="mt-2 text-sm font-medium">
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="upload" className="px-8 font-bold">
                            Configuration
                        </TabsTrigger>
                        <TabsTrigger value="preview" disabled={!result} className="px-8 font-bold">
                            Preview Notes
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Left: Source */}
                            <div className="col-span-12 md:col-span-5">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-primary" />
                                            Source Material
                                        </CardTitle>
                                        <CardDescription>Upload textbooks (PDF/TXT) to analyze.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            <Label htmlFor="file-upload">Document (PDF/TXT)</Label>
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                accept=".pdf,.txt"
                                                onChange={handleFileChange}
                                                className="cursor-pointer file:text-primary file:font-semibold"
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-1.5 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            <Label htmlFor="chapter">Specific Chapter (Optional)</Label>
                                            <Input
                                                id="chapter"
                                                placeholder="e.g. Chapter 5, Newton's Laws"
                                                value={chapter}
                                                onChange={(e) => setChapter(e.target.value)}
                                                className="h-10"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right: Settings */}
                            <div className="col-span-12 md:col-span-7">
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Layout className="h-5 w-5 text-primary" />
                                            Notemaker Settings
                                        </CardTitle>
                                        <CardDescription>Define how you want your notes to be structured.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4 pt-4">
                                        <div className="space-y-4">
                                            <div
                                                className={`flex cursor-pointer items-start space-x-4 rounded-xl border p-5 transition-all ${generateSummary ? 'border-primary/20 bg-muted/30' : 'bg-background opacity-60'}`}
                                                onClick={() => setGenerateSummary(!generateSummary)}
                                            >
                                                <Checkbox
                                                    id="gen-summary"
                                                    checked={generateSummary}
                                                    onCheckedChange={(checked) => setGenerateSummary(!!checked)}
                                                    className="mt-1"
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                                                    <label className='flex items-center gap-2 font-bold text-sm'>
                                                        <StickyNote className="h-4 w-4" />
                                                        Generate Summary
                                                    </label>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        Creates a high-level academic overview capturing the core message and primary concepts.
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className={`flex cursor-pointer items-start space-x-4 rounded-xl border p-5 transition-all ${generateNotes ? 'bg-muted/30 border-primary/20' : 'bg-background opacity-60'}`}
                                                onClick={() => setGenerateNotes(!generateNotes)}
                                            >
                                                <Checkbox
                                                    id="gen-notes"
                                                    checked={generateNotes}
                                                    onCheckedChange={(checked) => setGenerateNotes(!!checked)}
                                                    className="mt-1"
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    {/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
                                                    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                                                    <label className="text-sm font-bold flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4" />
                                                        Generate Exhaustive Notes
                                                    </label>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        Creates deep-dive study material with exhaustive explanations and examples.
                                                    </p>
                                                </div>
                                            </div>

                                            {(!generateSummary && !generateNotes) && (
                                                <Alert variant="destructive" className="py-3 px-4 rounded-xl">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription className="text-sm">Please select at least one option to proceed.</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex items-center justify-between border-t bg-muted/10 p-4'>
                                        <div />
                                        <Button
                                            size="lg"
                                            onClick={handleGenerate}
                                            disabled={isLoading || !file || (!generateSummary && !generateNotes)}
                                            className="min-w-[150px]"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" /> Generate
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-6">
                        {result && (
                            <div className="flex justify-end gap-2 mb-4">
                                <Button
                                    onClick={handleDownloadPDF}
                                    variant="outline"
                                >
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </Button>
                            </div>
                        )}

                        {result ? (
                            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                                {/* Summary Card */}
                                {result.summary && (
                                    <Card className="overflow-hidden">
                                        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl">Summary</CardTitle>
                                                <CardDescription>Overview of the material.</CardDescription>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleCopyContent(result.summary || "")} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                <Clipboard className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed text-lg">
                                                {renderWithBold(result.summary)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Notes Card */}
                                {result.notes && (
                                    <Card className="overflow-hidden">
                                        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl flex items-center gap-2">
                                                    <StickyNote className="h-5 w-5 text-primary" />
                                                    Structured Topic-wise Notes
                                                </CardTitle>
                                                <CardDescription>Detailed breakdown and key points.</CardDescription>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleCopyContent(result.notes || "")} className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted">
                                                <Clipboard className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-8 bg-white">
                                            <div className="prose prose-blue max-w-none">
                                                <div className="whitespace-pre-wrap font-sans text-slate-800">
                                                    {result.notes.split('\n').map((line, i) => {
                                                        if (line.startsWith('#') || (line.toUpperCase() === line && line.length > 3 && !line.includes(' '))) {
                                                            return <h3 key={i} className="text-xl font-bold text-primary mt-6 mb-3 border-b pb-2">{renderWithBold(line.replace(/^#+\s*/, ''))}</h3>;
                                                        }
                                                        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                                                            return (
                                                                <li key={i} className="ml-4 mb-2 list-none flex items-start">
                                                                    <span className="text-primary mr-2 mt-1.5">•</span>
                                                                    <span className="flex-1">{renderWithBold(line.trim().substring(1).trim())}</span>
                                                                </li>
                                                            );
                                                        }
                                                        return <p key={i} className="mb-2 leading-relaxed">{renderWithBold(line)}</p>;
                                                    })}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-muted/30 border-t justify-center py-4">
                                            <p className="text-xs text-muted-foreground">Generated by AI Notemaker • Optimized for Exams</p>
                                        </CardFooter>
                                    </Card>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed rounded-2xl bg-muted/5">
                                <FileText className="h-16 w-16 text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground">Ready to process your content...</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
