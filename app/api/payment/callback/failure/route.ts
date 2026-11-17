import { updateApplicationPaymentStatus } from '@/server/admission/preadmission/transactions/application_form';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    console.log('baseUrl Failure POST', baseUrl);

    try {
        console.log('🔥 Received POST from Easebuzz failure callback');

        const url = new URL(request.url);
        const transactionId = url.searchParams.get('transaction_id') || url.searchParams.get('txnid');

        if (!transactionId) {
            console.error('❌ No transaction ID found in callback');
            return NextResponse.redirect(new URL('/admission/preadmission/transactions/application-form', baseUrl));
        }

        console.log('💳 Processing failed payment immediately for:', transactionId);

        // ✅ Process payment HERE before redirecting
        const paymentResult = await updateApplicationPaymentStatus('failed', transactionId);

        console.log('✅ Payment failure processing result:', paymentResult);

        // ✅ FIXED: Return HTML page with JavaScript redirect
        const redirectUrl = `${baseUrl}/admission/preadmission/transactions/application-form/payment/failure/${transactionId}?processed=true`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Failed - Redirecting...</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
                    .error-icon {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: #fee;
                        margin: 0 auto 1.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 3rem;
                        color: #ef4444;
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
                        border-top: 3px solid #ef4444;
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
                    <div class="error-icon">✕</div>
                    <h1>Payment Failed</h1>
                    <p>Your payment could not be processed.</p>
                    <p style="font-size: 0.875rem; color: #9ca3af;">Redirecting you...</p>
                    <div class="spinner"></div>
                </div>
                <script>
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
        console.error('❌ Payment failure callback error:', error);
        return NextResponse.redirect(new URL('/admission/preadmission/transactions/application-form', baseUrl));
    }
}

export async function GET(request: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    console.log('baseUrl Failure GET', baseUrl);

    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transaction_id') || url.searchParams.get('txnid');

    if (transactionId) {
        const redirectUrl = `${baseUrl}/admission/preadmission/transactions/application-form/payment/failure/${transactionId}?processed=true`;

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="refresh" content="1;url=${redirectUrl}">
                <title>Redirecting...</title>
            </head>
            <body>
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
                'Cache-Control': 'no-store'
            }
        });
    }

    return NextResponse.redirect(new URL('/admission/preadmission/transactions/application-form', baseUrl));
}
