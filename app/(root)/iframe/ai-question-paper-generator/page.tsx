"use client";

import React, { useState } from "react";
import {
    Upload,
    FileText,
    Plus,
    Trash2,
    Loader2,
    Download,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Home,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Slider } from "@/components/ui/slider";

interface Question {
    id: number;
    text: string;
    type: string;
    options?: string[];
    difficulty: "Easy" | "Medium" | "Hard";
    topic: string;
}

interface Section {
    markValue: number;
    questions: Question[];
}

interface QuestionPaper {
    title: string;
    totalMarks: number;
    sections: Section[];
}

interface MarkConfig {
    markValue: number;
    count: number;
    isMCQ?: boolean;
}

export default function AIQuestionPaperGenerator() {
    // State
    const [file, setFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState("upload");
    const [chapters, setChapters] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPaper, setGeneratedPaper] = useState<QuestionPaper | null>(null);
    const [errorLog, setErrorLog] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Configuration State
    const [markConfigs, setMarkConfigs] = useState<MarkConfig[]>([
        { markValue: 1, count: 5, isMCQ: true },
        { markValue: 2, count: 5, isMCQ: false },
        { markValue: 5, count: 2, isMCQ: false },
    ]);

    const [difficulty, setDifficulty] = useState({
        easy: 30,
        medium: 40,
        hard: 30
    });

    // Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            toast.success("File uploaded successfully");
        }
    };

    const handleAddMarkConfig = () => {
        setMarkConfigs([...markConfigs, { markValue: 1, count: 1, isMCQ: true }]);
    };

    const handleRemoveMarkConfig = (index: number) => {
        const newConfigs = [...markConfigs];
        newConfigs.splice(index, 1);
        setMarkConfigs(newConfigs);
    };

    const updateMarkConfig = (index: number, field: keyof MarkConfig, value: any) => {
        const newConfigs = [...markConfigs];
        // @ts-ignore
        newConfigs[index] = { ...newConfigs[index], [field]: value };

        // Auto-set isMCQ to false if marks > 1, to keep UI clean, though not strictly required
        if (field === 'markValue' && value > 1) {
            newConfigs[index].isMCQ = false;
        }
        // Auto-set isMCQ to true if marks == 1 (optional, user might want short answer)
        // Let's leave it to user choice, but default new rows to true.

        setMarkConfigs(newConfigs);
    };

    const calculateTotalMarks = () => {
        return markConfigs.reduce((acc, curr) => acc + (curr.markValue * curr.count), 0);
    };

    const handleGenerate = async () => {
        if (!file) {
            toast.error("Please upload a PDF file first");
            return;
        }

        if (!chapters) {
            toast.warning("Generating for entire textbook (no specific chapters selected)");
        }

        setIsLoading(true);
        setGeneratedPaper(null);
        setErrorLog(null);
        setErrorMessage(null);

        try {
            // Prepare Form Data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("chapters", chapters);

            // Send standard config objects for backward compatibility if needed, 
            // but we will send the full array now.
            formData.append("markConfig", JSON.stringify(markConfigs));
            formData.append("difficultyConfig", JSON.stringify(difficulty));

            const response = await fetch("/api/exam/generate-questions", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    // Start of non-JSON error (e.g. HTML 500 page)
                    console.error("Non-JSON Error Response:", errorText);
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }

                const errorMessage = errorData.error || "Failed to generate questions";
                const errorDetails = errorData.details || "";

                setErrorLog(errorDetails);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setGeneratedPaper(data);
            setActiveTab("preview");
            toast.success("Question paper generated successfully");

        } catch (error: any) {
            console.error("Generation Error:", error);
            // Display internal details if available, otherwise standard message
            const displayMessage = error.message || "Error generating question paper. Please try again.";

            setErrorMessage(displayMessage);
            if (!errorLog && error.stack) {
                // Fallback if no server log
                setErrorLog(error.stack);
            }

            toast.error(displayMessage, { duration: 5000 }); // Longer validation for reading
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!generatedPaper) return;

        const doc = new jsPDF();
        let yPos = 20;

        // Header
        doc.setFontSize(18);
        doc.text(generatedPaper.title.toUpperCase(), 105, yPos, { align: "center" });
        yPos += 10;

        doc.setFontSize(12);
        doc.text(`Total Marks: ${generatedPaper.totalMarks}`, 105, yPos, { align: "center" });
        if (chapters) {
            yPos += 7;
            doc.text(`Chapters: ${chapters}`, 105, yPos, { align: "center" });
        }
        yPos += 15;
        doc.line(20, yPos, 190, yPos);
        yPos += 10;

        // Content
        generatedPaper.sections.forEach((section, sIdx) => {
            // Check for page break
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Section ${sIdx + 1}: ${section.markValue} Marks Questions`, 20, yPos);
            yPos += 10;

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");

            section.questions.forEach((q, qIdx) => {
                // Check for page break
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }

                // Split text to fit page width
                const splitQuestion = doc.splitTextToSize(`${qIdx + 1}. ${q.text}`, 170);
                doc.text(splitQuestion, 20, yPos);
                yPos += (splitQuestion.length * 5) + 2;

                if (q.type === 'MCQ' && q.options) {
                    q.options.forEach(opt => {
                        // Simple check if option is correct (remove * for student paper usually, but here we keep context)
                        // Implementation: Remove * for PDF view if needed, but per prompt instruction we show keys? 
                        // Let's print them cleanly.
                        const cleanOpt = opt.replace('*', '').trim();
                        doc.text(`   ${cleanOpt}`, 25, yPos);
                        yPos += 5;
                    });
                    yPos += 2;
                }

                // Add spacing between questions
                yPos += 3;
            });

            yPos += 10; // Extra space after section
        });

        doc.save(`question-paper-${Date.now()}.pdf`);
        toast.success("PDF Downloaded");
    };

    return (
        <div className="min-h-screen">
            <div className="container space-y-6 p-4 md:p-6">


                {errorLog && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription className="mt-2">
                            <div className="font-semibold mb-2">{errorMessage}</div>
                            <details className="cursor-pointer">
                                <summary className="text-sm font-medium underline">View Technical Details</summary>
                                <pre className="mt-2 w-full overflow-x-auto p-2 bg-black/5 rounded text-xs leading-tight whitespace-pre-wrap font-mono">
                                    {errorLog}
                                </pre>
                            </details>
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="upload" className="px-8 font-bold">Configuration</TabsTrigger>
                        <TabsTrigger value="preview" disabled={!generatedPaper} className="px-8 font-bold">Preview Paper</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* Left Column: Upload & Chapters */}
                            <div className="col-span-12 md:col-span-4 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-primary" />
                                            Source Material
                                        </CardTitle>
                                        <CardDescription>Upload your textbook PDF and select chapters.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="pdf-upload">Textbook (PDF)</Label>
                                            <Input
                                                id="pdf-upload"
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="cursor-pointer file:text-primary file:font-semibold"
                                            />
                                        </div>

                                        <div className="grid w-full items-center gap-1.5 pt-2">
                                            <Label htmlFor="chapters">Chapter Numbers</Label>
                                            <Input
                                                id="chapters"
                                                placeholder="e.g. 1, 2, 5.1"
                                                value={chapters}
                                                onChange={(e) => setChapters(e.target.value)}
                                                className="h-10"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Difficulty Mix
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span>Easy ({difficulty.easy}%)</span>
                                            </div>
                                            <Slider
                                                value={[difficulty.easy]}
                                                max={100}
                                                step={5}
                                                onValueChange={(val: any[]) => setDifficulty({ ...difficulty, easy: val[0] })}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span>Medium ({difficulty.medium}%)</span>
                                            </div>
                                            <Slider
                                                value={[difficulty.medium]}
                                                max={100}
                                                step={5}
                                                onValueChange={(val: any[]) => setDifficulty({ ...difficulty, medium: val[0] })}
                                                className="py-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span>Hard ({difficulty.hard}%)</span>
                                            </div>
                                            <Slider
                                                value={[difficulty.hard]}
                                                max={100}
                                                step={5}
                                                onValueChange={(val: any[]) => setDifficulty({ ...difficulty, hard: val[0] })}
                                                className="py-1"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column: Schema Configuration */}
                            <div className="col-span-12 md:col-span-8">
                                <Card className="h-full flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            Question Paper Schema
                                        </CardTitle>
                                        <CardDescription>
                                            Configure the distribution of marks and number of questions.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-4">
                                        <div className="rounded-md border">
                                            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b font-bold text-xs uppercase tracking-wider">
                                                <div className="col-span-3">Mark Value</div>
                                                <div className="col-span-3">No. of Questions</div>
                                                <div className="col-span-3 text-center">Type</div>
                                                <div className="col-span-2 text-right">Subtotal</div>
                                                {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
                                                <div className="col-span-1"></div>
                                            </div>
                                            <div className="divide-y">
                                                {markConfigs.map((config, index) => (
                                                    <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center">
                                                        <div className="col-span-3">
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={config.markValue}
                                                                onChange={(e) => updateMarkConfig(index, "markValue", Number.parseInt(e.target.value) || 0)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={config.count}
                                                                onChange={(e) => updateMarkConfig(index, "count", Number.parseInt(e.target.value) || 0)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="col-span-3 flex justify-center items-center">
                                                            {config.markValue === 1 ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`mcq-${index}`}
                                                                        checked={config.isMCQ}
                                                                        onCheckedChange={(checked) => updateMarkConfig(index, "isMCQ", checked === true)}
                                                                    />
                                                                    <label
                                                                        htmlFor={`mcq-${index}`}
                                                                        className="text-sm font-medium leading-none"
                                                                    >
                                                                        MCQ
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">-</span>
                                                            )}
                                                        </div>
                                                        <div className="col-span-2 font-semibold text-primary text-right">
                                                            {config.markValue * config.count}
                                                        </div>
                                                        <div className="col-span-1 flex justify-end">
                                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveMarkConfig(index)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button variant="outline" onClick={handleAddMarkConfig} className="w-full border-dashed">
                                            <Plus className="h-4 w-4 mr-2" /> Add Section
                                        </Button>
                                    </CardContent>
                                    <CardFooter className="bg-muted/10 border-t p-6 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Marks Estimate</span>
                                            <span className="text-3xl font-bold">
                                                {calculateTotalMarks()}
                                                <span className="text-sm font-normal text-muted-foreground ml-1">pts</span>
                                            </span>
                                        </div>
                                        <Button
                                            size="lg"
                                            onClick={handleGenerate}
                                            disabled={isLoading || !file}
                                            className="min-w-[200px]"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" /> Generate Paper
                                                </>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-6">
                        {generatedPaper && (
                            <div className="flex justify-end gap-2 mb-4">
                                <Button
                                    onClick={handleDownloadPDF}
                                    variant="outline"
                                >
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </Button>
                            </div>
                        )}
                        {generatedPaper ? (
                            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                                <Card className="p-8 md:p-12 shadow-sm bg-white">
                                    <div className="text-center space-y-4 mb-12">
                                        <div className="uppercase tracking-widest text-sm font-semibold text-muted-foreground">{chapters ? `Chapters: ${chapters}` : "Full Syllabus"}</div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{generatedPaper.title}</h2>
                                        <div className="inline-flex items-center px-4 py-1 rounded-full bg-slate-100 text-slate-800 font-medium border">
                                            Max Marks: {generatedPaper.totalMarks}
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {generatedPaper.sections.map((section, idx) => (
                                            <div key={idx} className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <h3 className="text-lg font-bold bg-primary text-primary-foreground px-4 py-1 rounded-sm uppercase tracking-wider">
                                                        Section {String.fromCharCode(65 + idx)}
                                                    </h3>
                                                    <span className="text-muted-foreground font-medium">
                                                        {section.markValue} marks per question
                                                    </span>
                                                </div>

                                                <div className="pl-2 space-y-8">
                                                    {section.questions.map((q, qIdx) => (
                                                        <div key={qIdx} className="group relative pl-8 border-l-2 border-transparent transition-colors">
                                                            <span className="absolute left-0 top-0 -translate-x-[calc(100%+8px)] font-bold text-muted-foreground/40 w-6 text-right">
                                                                {qIdx + 1}.
                                                            </span>
                                                            <div className="space-y-3">
                                                                <p className="text-lg text-gray-800 leading-relaxed">
                                                                    {q.text}
                                                                </p>

                                                                {q.type === 'MCQ' && q.options && (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                                                        {q.options.map((opt, oIdx) => (
                                                                            <div
                                                                                key={oIdx}
                                                                                className={'rounded-lg border border-muted bg-muted/10 p-3 text-foreground/70 text-sm'}
                                                                            >
                                                                                {opt.replace('*', '').trim()}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <div className="flex gap-2 mt-2">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {q.difficulty}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {q.topic}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Separator className="my-8" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-16 text-center text-sm text-muted-foreground pt-8 border-t">
                                        Generated by AI Question Paper Generator • {new Date().getFullYear()}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed rounded-xl bg-muted/5">
                                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground">Generating your paper...</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
