import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq clients for different portals
const adminGroq = new Groq({
    apiKey: process.env.chat_Groq_api_key || ''
});

const studentGroq = new Groq({
    apiKey: process.env.student_chat_Groq_api_key || process.env.chat_Groq_api_key || ''
});


// Knowledge Base from user's Python code
const KNOWLEDGE_BASE = {
    // --- GENERAL & GREETINGS ---
    greetings: {
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what can you do'],
        response: `Hello! I am your **AI VRM Help Desk**. I'm here to help you navigate through the AI VRM system and answer questions about Exams, Fees, and Admission. 

How can I assist you today? You can ask me things like "How do I check my marks?" or "Where can I pay fees?"`
    },
    // --- EXAM PORTAL KNOWLEDGE BASE ---
    examPortal: {
        keywords: [
            'exam portal',
            'exam page',
            'examination portal',
            'exam section',
            'where to check marks',
            'access exam',
            'exam results',
            'result portal'
        ],
        response: `The **Exam Portal** is where you can view all your exam results and marks!

**How to Access:**
1. Go to **Exam** page in the main menu
2. Click on **Exam Portal**

**What you can do:**
- Select Academic Year
- Choose Exam Type
- View subject-wise marks
- See maximum marks for each subject
- Check marks analytics and performance graphs
- View overall percentage and grade

Navigate to Exam → Exam Portal to get started!`
    },
    academicYear: {
        keywords: [
            'academic year',
            'year selection',
            'select year',
            'which year',
            'choose year',
            'year dropdown',
            'current year',
            'academic session'
        ],
        response: `**Academic Year Selection** helps you view results from different years:

**Where to find:**
Exam Portal → Academic Year dropdown (top of page)

**How to use:**
1. Click the Academic Year dropdown
2. Select the year you want (e.g., 2024-2025, 2023-2024)
3. Then select Exam Type
4. Click Search

You can view results from any academic year you've been enrolled!`
    },
    examType: {
        keywords: [
            'exam type',
            'type of exam',
            'exam types',
            'select exam',
            'unit test',
            'mid term',
            'final exam',
            'half yearly',
            'quarterly',
            'monthly test',
            'annual exam',
            'exam name'
        ],
        response: `**Exam Types** available in the portal:

**Common Exam Types:**
- **Unit Test / Monthly Test** - Monthly assessments
- **Quarterly Exam** - Every 3 months
- **Mid-term / Half-yearly** - Middle of academic year
- **Final / Annual Exam** - End of year examination
- **Pre-board** - Practice exams before board
- **Internal Assessment** - Continuous evaluation

**How to select:**
1. Choose Academic Year first
2. Click **Exam Type** dropdown
3. Select the exam (Unit Test 1, Mid-term, Final, etc.)
4. Click **Search** button`
    },
    subjectMarks: {
        keywords: [
            'subject marks',
            'subject wise',
            'marks per subject',
            'individual subject',
            'each subject',
            'subject scores',
            'marks in subjects',
            'subject results',
            'check marks',
            'view marks',
            'see marks',
            'my marks',
            'exam marks'
        ],
        response: `**Subject-wise Marks** show detailed scores for each subject:

**Display Format:**
Each subject shows:
- **Subject Name** (Math, English, Science, etc.)
- **Marks Obtained** - Your score
- **Maximum Marks** - Total marks possible
- **Percentage** - (Obtained/Maximum) × 100
- **Pass/Fail Status** - Based on passing criteria
- **Grade** - A+, A, B+, B, C, etc.

**Example:**
Mathematics: 85/100 (85%) - Grade A
English: 78/100 (78%) - Grade B+
Science: 92/100 (92%) - Grade A+

**How to view:**
Exam Portal → Select Year → Select Exam Type → Click Search`
    },
    marksAnalytics: {
        keywords: [
            'analytics',
            'analysis',
            'performance graph',
            'charts',
            'graphs',
            'statistics',
            'performance analysis',
            'marks analysis',
            'visual analysis'
        ],
        response: `**Marks Analytics** provides visual performance analysis:

**Analytics Dashboard includes:**

📊 **Bar Charts** - Subject-wise marks comparison
📈 **Line Graphs** - Progress over different exams
🥧 **Pie Charts** - Overall percentage distribution
📉 **Performance Metrics** - Average marks, highest/lowest scores

**Key Insights:**
- Strengths: Subjects where you scored highest
- Areas for improvement: Subjects needing attention
- Comparison with class average
- Performance trends

**Where to see:**
Exam Portal → Select Exam → Click Search → Scroll to Analytics section`
    },
    aiPerformanceAnalysis: {
        keywords: [
            'ai performance analysis',
            'ai analysis',
            'analyze class',
            'student analysis',
            'academic insights',
            'performance insights',
            'analyze student'
        ],
        response: `The **AI Performance Analysis** tool provides deep insights into class and student performance using AI.

**Location:** Exam → Exam Module → Reports → AI Performance Analysis

**Key Features:**
- **Class Overview**: Identify top and weak performers with AI feedback.
- **Student Deep-Dive**: Get personalized study strategies for any student.
- **Data Upload**: Simply upload an Excel/CSV cumulative report to start.

It's perfect for teachers to quickly identify which students need extra support!`
    },
    overallPercentage: {
        keywords: [
            'overall percentage',
            'total percentage',
            'aggregate',
            'overall marks',
            'combined percentage',
            'total score',
            'overall score'
        ],
        response: `**Overall Percentage** shows your total performance across all subjects:

**Calculation:**
Overall % = (Total Obtained Marks / Total Maximum Marks) × 100

**Example:**
If you scored:
- Math: 85/100
- English: 78/100
- Science: 92/100
- Total: 255/300

Overall Percentage = (255/300) × 100 = 85%

**Where displayed:**
- Top of results page in highlighted box
- Below subject-wise marks
- In analytics section`
    },

    // --- FEES KNOWLEDGE BASE ---
    feeOnlinePayment: {
        keywords: [
            'fee payment',
            'online payment',
            'pay fees',
            'how to pay',
            'payment process',
            'make payment',
            'pay online',
            'fee structure',
            'current charges',
            'pay my fees'
        ],
        response: `In the **Fee Online Payment** page, you can view and pay your fees:

**Left Side - Student Information:**
- Admission Number
- Student Name and Class
- Current Year Charges - Total fees for this academic year
- Current Year Outstanding - Pending fees (if any)

**Right Side - Fee Groups:**
Select the fee groups you want to pay:
- School Fees
- Bus Fees
- Hostel Fees
- Other Fees
- Book Fees

**How to Pay:**
1. Tick the checkbox of fee groups you want to pay
2. Click "Show" button
3. Review payment details
4. Select your payment method (Credit Card/Debit Card/Net Banking/UPI)
5. Complete payment

After payment, you'll see current paid fees and concession details.`
    },

    // --- ADMISSION KNOWLEDGE BASE ---
    admissionStatus: {
        keywords: [
            'admission status',
            'check status',
            'application status',
            'transfer status',
            'status of admission',
            'is my admission confirmed',
            'waiting list',
            'selected'
        ],
        response: `**How to check Admission Process / Status:**

1. Go to **Admission** > **Preadmission** > **Transactions**.
2. Click on **Transfer Application Status**.
3. View your current status (e.g., Submitted, In Review, Selected, Admitted).

You can also check **Transfer Admission Status** in the same menu for final enrollment updates.`
    },

    feeGroups: {
        keywords: [
            'fee groups',
            'types of fees',
            'school fees',
            'bus fees',
            'hostel fees',
            'book fees',
            'other fees',
            'fee categories',
            'what fees',
            'fee types'
        ],
        response: `Fee Groups are different categories of fees:

**1. School Fees** - Tuition, exam fees, activities
**2. Bus Fees** - Transportation charges
**3. Hostel Fees** - Accommodation charges (if applicable)
**4. Other Fees** - Miscellaneous charges
**5. Book Fees** - Textbooks and materials

You can select multiple fee groups to pay together. Tick the checkboxes of the groups you want to pay, then click "Show" to see the payment details.`
    },
    outstanding: {
        keywords: [
            'outstanding',
            'pending fees',
            'due fees',
            'balance',
            'unpaid',
            'remaining fees',
            'how much pending',
            'check outstanding',
            'pending amount'
        ],
        response: `**Current Year Outstanding** shows your pending fees for this academic year.

**Where to check:**
Go to Transaction → Fee Online Payment
- Left side shows "Current Year Outstanding"
- This amount needs to be paid

**To clear outstanding:**
1. Select the fee groups with pending amounts
2. Tick the checkboxes
3. Click "Show" button
4. Make payment

You can also check detailed outstanding in **Std Fee Details** page for complete fee analysis.`
    },
    paymentMethods: {
        keywords: [
            'payment method',
            'how to pay',
            'payment options',
            'credit card',
            'debit card',
            'net banking',
            'upi',
            'payment mode',
            'pay using',
            'payment gateway'
        ],
        response: `Available payment methods in the Fee Portal:

**1. Credit Card** - Visa, Mastercard, Amex
**2. Debit Card** - All major banks
**3. Net Banking** - Online banking from your bank
**4. UPI** - Google Pay, PhonePe, Paytm, BHIM

**Payment Process:**
1. Select fee groups and click "Show"
2. Review payment details
3. Choose your preferred payment method
4. You'll be redirected to secure payment gateway
5. Complete payment
6. Receipt will be generated automatically`
    },
    portalFeeReceipt: {
        keywords: [
            'receipt',
            'fee receipt',
            'download receipt',
            'print receipt',
            'get receipt',
            'receipt copy',
            'payment receipt',
            'receipt number',
            'find receipt',
            'view receipt',
            'receipt download'
        ],
        response: `**Portal Fee Receipt** - View and download all your payment receipts

**Location:** Transaction → Portal Fee Receipt

**How to access:**
1. Select Academic Year from dropdown (right side)
2. All receipts for that year will be displayed
3. Select the receipt number you want
4. Receipt details will show on screen

**Options available:**
- **Print** - Print the receipt
- **Download** - Save as PDF to your device`
    },
    receiptDetails: {
        keywords: ['receipt details', "what's in receipt", 'receipt information', 'receipt contains', 'receipt format', 'receipt has'],
        response: `Every fee receipt contains complete payment details:

**Student Information:**
- Admission Number
- Student Name
- Class and Section

**Payment Details:**
- Receipt Number (unique identifier)
- Receipt Date
- Academic Year
- Fee Groups paid (School/Bus/Hostel/Other/Book)

**Financial Information:**
- Amount Paid
- Payment Method used
- Transaction ID
- GST/Tax details (if applicable)
- Total Amount

**School Information:**
- School name and logo
- School address
- Contact details`
    },
    stdFeeDetails: {
        keywords: [
            'fee details',
            'fee dashboard',
            'fee analysis',
            'overall fees',
            'fee summary',
            'complete fee',
            'total fees',
            'fee status',
            'fee overview',
            'std fee details',
            'student fee details'
        ],
        response: `**Std Fee Details** is your complete fee dashboard!

**Location:** Transaction → Std Fee Details

This page shows **overall fee analysis** for the student including:

**1. Total Fee Structure**
- Annual fees breakdown
- Term-wise fees

**2. Payment Status**
- Total Fees Charged
- Total Paid
- Total Outstanding/Pending
- Concessions/Discounts applied

**3. Fee Group Analysis**
- School Fees status
- Bus Fees status
- Hostel Fees status
- Other Fees status
- Book Fees status

**4. Term-wise Breakdown**
- Term 1, Term 2, Term 3 fees
- Paid vs Pending for each term

**5. Payment History**
- All previous payments`
    },
    concession: {
        keywords: [
            'concession',
            'discount',
            'fee waiver',
            'scholarship',
            'reduced fees',
            'fee reduction',
            'concession amount',
            'fee discount',
            'waiver'
        ],
        response: `**Concession/Discount** information is displayed in Fee Online Payment page.

**Where to see:**
- Go to Transaction → Fee Online Payment
- Right side shows "Current Paid Fees" and "Concession"
- Concession amount is subtracted from your total fees

**Types of Concessions:**
- Merit-based scholarships
- Sibling discounts
- Financial assistance
- Early payment discounts
- Category-based fee waivers

**How it works:**
Total Fees - Concession = Amount You Pay`
    },
    currentYearCharges: {
        keywords: [
            'current charges',
            'this year fees',
            'annual fees',
            'total fees',
            'current year charges',
            'fee structure',
            'how much is fees',
            'annual charges'
        ],
        response: `**Current Year Charges** show your total fees for this academic year.

**Where to find:**
Transaction → Fee Online Payment → Left side

This includes:
- School Fees (Tuition, activities, exams)
- Bus Fees (if opted)
- Hostel Fees (if opted)
- Book Fees
- Other Fees

**Formula:**
Current Year Charges = Total Annual Fees
Outstanding = Charges - Paid Amount`
    },
    paymentHistory: {
        keywords: [
            'payment history',
            'previous payments',
            'past payments',
            'payment records',
            'transaction history',
            'old payments',
            'paid before',
            'earlier payments'
        ],
        response: `To view your **payment history:**

**Option 1: Portal Fee Receipt**
- Go to Transaction → Portal Fee Receipt
- Select Academic Year
- See all receipts from that year
- Click any receipt to view details

**Option 2: Std Fee Details**
- Go to Transaction → Std Fee Details
- Scroll to "Payment History" section
- See all payments with dates and receipt numbers`
    },
    completeProcess: {
        keywords: [
            'complete process',
            'full process',
            'step by step',
            'how it works',
            'payment procedure',
            'fee process',
            'payment flow',
            'complete guide',
            'fee journey'
        ],
        response: `**Complete Fee Payment Process:**

**Step 1: Check Fees**
- Go to Transaction → Fee Online Payment
- See your Current Year Charges and Outstanding

**Step 2: Select Fee Groups**
- Tick checkboxes for groups you want to pay (School/Bus/Hostel/Other/Book)
- Click "Show" button

**Step 3: Review Payment Details**
- Check the amount breakdown
- Verify fee groups selected
- See any concessions applied

**Step 4: Make Payment**
- Choose payment method (Card/Net Banking/UPI)
- Complete secure payment

**Step 5: Get Receipt**
- Receipt auto-generated after payment
- Go to Portal Fee Receipt to download

**Step 6: Track Status**
- Check Std Fee Details for updated status`
    },
    failedPayment: {
        keywords: [
            'payment failed',
            'failed transaction',
            'payment not successful',
            'payment error',
            'transaction failed',
            'payment declined',
            'money deducted',
            'payment pending'
        ],
        response: `If your **payment failed or money was deducted:**

**Immediate Steps:**
1. Don't retry payment immediately
2. Wait 30 minutes for bank to process
3. Check your bank statement

**If money deducted but receipt not generated:**
- Amount will be auto-refunded within 5-7 working days OR
- Payment will be auto-reconciled within 24 hours
- Check Portal Fee Receipt after 24 hours

**If payment shows pending:**
- Wait 1-2 hours for confirmation
- Contact school office if not resolved in 24 hours`
    },
    termWiseFees: {
        keywords: [
            'term fees',
            'term wise',
            'termwise fees',
            'term 1',
            'term 2',
            'term 3',
            'quarterly fees',
            'installment',
            'semester fees'
        ],
        response: `**Term-wise Fee Information:**

Most schools divide annual fees into terms/quarters:

**Term 1** - April to July (25-30% of annual fees)
**Term 2** - August to November (25-30% of annual fees)
**Term 3** - December to March (40-50% of annual fees)

**Where to check:**
Go to **Std Fee Details** page
- See term-wise breakdown
- Check paid vs pending for each term
- View due dates for each term`
    },
    latePayment: {
        keywords: [
            'late payment',
            'late fees',
            'fine',
            'penalty',
            'overdue',
            'missed deadline',
            'payment deadline',
            'due date',
            'late fee charges'
        ],
        response: `**Late Payment and Penalties:**

**Due Dates:**
- Check your fee schedule for term-wise due dates
- Usually displayed in Std Fee Details page

**Late Payment Charges:**
- Late fees may be added if payment is overdue
- Shows as "Other Fees" or a separate fine charge

**To avoid late fees:**
- Set payment reminders
- Pay before term deadline

**If you have late fees:**
- It will appear in your Current Year Outstanding
- Select and pay along with regular fees`
    },

    // --- ADMISSION PROCESS FLOW (Kept as is) ---
    admissionProcess: {
        keywords: [
            'admission process',
            'application steps',
            'admission steps',
            'enrollment process',
            'admission procedure',
            'admission flow',
            'how to apply',
            'apply online',
            'admission date',
            'application deadline'
        ],
        response: `**Complete Admission Process Flow:**

**Step 1: Fill Application Form**
- Complete student and parent details, upload photo and documents.

**Step 2: Fill Health Form**
- Provide health details, chronic conditions, and emergency contact. Mandatory.

**Step 3: Verification**
- Review entered information in the Registration page. Correct any errors.

**Step 4: Interview**
- Check Interview Schedule for assigned Oral and Written test dates.

**Step 5: Attend Tests**
- Attend tests as scheduled with necessary documents/admit card.

**Step 6: Marks Entry**
- School uploads marks after evaluation.

**Step 7: Check Status**
- Track status (Waiting/Rejected/Accepted) in Preadmission Status.

**Step 8: Confirmation**
- Status updates to Selected → Confirmed.

**Step 9: Admission**
- Confirmed students transfer to Admission module for final enrollment.`
    },

    // --- NEW TOPICS ---
    preadmissionRegistration: {
        keywords: ['preadmission registration', 'registration form', 'register for preadmission', 'enroll for preadmission'],
        response: `To register for preadmission, navigate to **Admission** > **Preadmission** > **Transactions** and click on **Preadmission Registration**. Ensure you have all student details and previous academic records ready.`
    },
    interviewSchedule: {
        keywords: ['interview schedule', 'interview date', 'oral test', 'written test', 'exam date'],
        response: `The **Interview Schedule** can be found under **Admission** > **Preadmission** > **Transactions**. You can view the list of students with their assigned dates, timings, and venues for oral and written interviews.`
    },
    feeConcession: {
        keywords: ['fee concession', 'scholarship', 'discount', 'fee waiver', 'concession category'],
        response: `Apply for fee concessions in **Fees** > **Transactions** > **Fee Concession**. You can link students to specific concession categories based on their eligibility and policy.`
    },
    marksEntry: {
        keywords: ['marks entry', 'enter marks', 'update marks', 'upload scores'],
        response: `Enter student marks by navigating to **Exam** > **Exam Module** > **Marks Entry**. Select the academic year, exam, and subject to begin entering or updating student performance data.`
    },
    studentTC: {
        keywords: ['transfer certificate', 'tc generation', 'tc details', 'leaving certificate'],
        response: `Generate and manage student Transfer Certificates (TC) in **Admission** > **Preadmission** > **Student Transfer Certificate**. You can record the reason for leaving and generate the official TC document.`
    }
};

export async function POST(req: NextRequest) {
    try {
        const { messages, context } = await req.json();

        // Select the appropriate Groq client based on context
        const groq = context === 'StudentPortal' ? studentGroq : adminGroq;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const userMessage = messages[messages.length - 1].content.toLowerCase();

        // 1. Check Keywords first (Fast Retrieval)
        for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
            if (data.keywords.some((keyword) => userMessage.includes(keyword))) {
                // Even if we find a keyword match, let's use the LLM to phrase it naturally,
                // but give it the exact knowledge snippet to use.
                const response = await groq.chat.completions.create({
                    messages: [
                        {
                            role: 'system',
                            content: `You are the **AI VRM Help Desk**, a helpful and friendly guide for the AI VRM system. 
                            
                            **KNOWLEDGE CONTEXT:**
                            ${data.response}

                            **INSTRUCTIONS:**
                            - **BE EXTREMELY CONCISE**. Answer in **ONE SHORT SENTENCE** only.
                            - Use the KNOWLEDGE CONTEXT to provide the exact navigation path.
                            - If it's a greeting, just say "Hello! How can I help?".
                            - **CONSTRAINTS**: No IVRM/HRMS. No AI jargon.
                            - Do not exceed 15-20 words.`
                        },
                        ...messages
                    ],
                    model: 'llama-3.3-70b-versatile',
                    temperature: 0.2, // Even lower for absolute precision
                    max_tokens: 100 // Further reduced
                });
                return NextResponse.json({ text: response.choices[0]?.message?.content });
            }
        }

        // 2. If no direct keyword match, use the sophisticated System Prompt with the full context
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are the **AI VRM Help Desk**.
                    
                    **CORE RULES:**
                    1. **ONE SENTENCE ONLY**. Maximum 15 words.
                    2. If asked "hi", say "Hello! How can I help you?".
                    3. Only provide navigation steps for AI VRM (Exam, Fees, Admission).
                    4. No IVRM/HRMS mentions.
                    5. Be direct. No filler words like "I understand" or "Certainly".`
                },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 100
        });

        const reply = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

        return NextResponse.json({ text: reply });
    } catch (error: any) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch response from AI. Please check your connection or API configuration.'
            },
            { status: 500 }
        );
    }
}
