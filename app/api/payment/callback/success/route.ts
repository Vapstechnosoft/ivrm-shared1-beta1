import { updateApplicationPaymentStatus } from '@/server/admission/preadmission/transactions/application_form';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    console.log('baseUrl Success POST', baseUrl);

    try {
        console.log('🔥 Received POST from Easebuzz success callback');

        const url = new URL(request.url);
        const transactionId = url.searchParams.get('transaction_id') || url.searchParams.get('txnid');

        if (!transactionId) {
            console.error('❌ No transaction ID found in callback');
            return NextResponse.redirect(new URL('/admission/preadmission/transactions/application-form', baseUrl));
        }

        console.log('💳 Processing payment immediately for:', transactionId);

        // ✅ Process payment HERE before redirecting
        const paymentResult = await updateApplicationPaymentStatus('success', transactionId);

        console.log('✅ Payment processing result:', paymentResult);

        // ✅ FIXED: Return HTML page with JavaScript redirect instead of server redirect
        const redirectUrl = `${baseUrl}/admission/preadmission/transactions/application-form/payment/success/${transactionId}?processed=true`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Successful - Redirecting...</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .container {
                        text-align: center;
                        background: white;
                        padding: 3rem 2rem;
                        border-radius: 1rem;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        max-width: 400px;
                    }
                    .checkmark {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        display: block;
                        stroke-width: 3;
                        stroke: #10b981;
                        stroke-miterlimit: 10;
                        margin: 0 auto 1.5rem;
                        box-shadow: inset 0px 0px 0px #10b981;
                        animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                    }
                    .checkmark__circle {
                        stroke-dasharray: 166;
                        stroke-dashoffset: 166;
                        stroke-width: 3;
                        stroke-miterlimit: 10;
                        stroke: #10b981;
                        fill: none;
                        animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                    }
                    .checkmark__check {
                        transform-origin: 50% 50%;
                        stroke-dasharray: 48;
                        stroke-dashoffset: 48;
                        animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards;
                    }
                    @keyframes stroke {
                        100% { stroke-dashoffset: 0; }
                    }
                    @keyframes scale {
                        0%, 100% { transform: none; }
                        50% { transform: scale3d(1.1, 1.1, 1); }
                    }
                    @keyframes fill {
                        100% { box-shadow: inset 0px 0px 0px 30px #10b981; }
                    }
                    h1 {
                        color: #1f2937;
                        font-size: 1.5rem;
                        margin: 0 0 0.5rem;
                    }
                    p {
                        color: #6b7280;
                        margin: 0 0 1rem;
                    }
                    .spinner {
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #667eea;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        animation: spin 1s linear infinite;
                        margin: 1rem auto 0;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <h1>Payment Successful!</h1>
                    <p>Your payment has been processed successfully.</p>
                    <p style="font-size: 0.875rem; color: #9ca3af;">Redirecting you to the success page...</p>
                    <div class="spinner"></div>
                </div>
                <script>
                    // Redirect after a brief moment to ensure Next.js is ready
                    setTimeout(function() {
                        window.location.href = '${redirectUrl}';
                    }, 1500);
                </script>
            </body>
            </html>
        `;

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0'
            }
        });
    } catch (error) {
        console.error('❌ Payment success callback error:', error);
        return NextResponse.redirect(new URL('/admission/preadmission/transactions/application-form', baseUrl));
    }
}

export async function GET(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    console.log('baseUrl Success GET', baseUrl);

    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transaction_id') || url.searchParams.get('txnid');

    if (transactionId) {
        const redirectUrl = `${baseUrl}/admission/preadmission/transactions/application-form/payment/success/${transactionId}?processed=true`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Redirecting...</title>
                <style>
                    body {
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        font-family: system-ui, -apple-system, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .loader {
                        width: 50px;
                        height: 50px;
                        border: 5px solid #f3f3f3;
                        border-top: 5px solid #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="loader"></div>
                <script>
                    setTimeout(function() {
                        window.location.href = '${redirectUrl}';
                    }, 1000);
                </script>
            </body>
            </html>
        `;

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache'
            }
        });
    }

    return NextResponse.redirect(new URL('/admission/preadmission/transactions/application-form', baseUrl));
}
