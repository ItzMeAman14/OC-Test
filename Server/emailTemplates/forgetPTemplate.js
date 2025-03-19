
const forgetPTemplate = (otp) => {
    return `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f7fa;
                        padding: 20px;
                        color: #333;
                    }
                    .email-container {
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        padding: 30px;
                        max-width: 600px;
                        margin: auto;
                    }
                    .email-header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #5d5d5d;
                        margin-bottom: 20px;
                    }
                    .otp-code {
                        font-size: 28px;
                        font-weight: bold;
                        color: #007bff;
                        background-color: #f0f9ff;
                        padding: 10px 20px;
                        border-radius: 4px;
                        margin-bottom: 20px;
                    }
                    .footer {
                        font-size: 12px;
                        color: #999;
                        margin-top: 20px;
                    }
                    .footer a {
                        color: #007bff;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Account Recovery - OTP Code</div>
                    <p>Hi there,</p>
                    <p>We received a request to recover your account. To proceed with the account recovery, please use the One-Time Password (OTP) below:</p>
                    <div class="otp-code">${otp}</div>
                    <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                    <p>If you did not request an OTP, please ignore this email or contact our support team.</p>
                    <div class="footer">
                        <p>If you have any questions, <a href="mailto:support@aicomp.com">contact us</a>.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

module.exports = forgetPTemplate;