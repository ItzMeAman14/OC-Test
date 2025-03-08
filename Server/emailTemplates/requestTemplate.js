
const requestTemplate = (email) => {
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
                    .email-body {
                        font-size: 16px;
                        color: #333;
                        line-height: 1.5;
                    }
                    .important {
                        font-weight: bold;
                        color: #e74c3c;
                    }
                    .action-button {
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin-top: 20px;
                    }
                    .footer {
                        font-size: 12px;
                        color: #999;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Multiple Login Attempts Detected</div>
                    <div class="email-body">
                        <p>Dear <strong>${email}</strong>,</p>
                        <p>We noticed that there have been multiple unsuccessful login attempts on your account.</p>
                        <p><span class="important">A request has already been sent to the admin for verification.</span></p>
                        <p>Unfortunately, you will not be able to access your account until the admin accepts your request.</p>
                        <p>To expedite the process, you may contact the admin directly.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email notification from AICOMP. Please do not reply to this email.</p>
                    </div>
                    <p>For support or inquiries, <a href="mailto:support@aicomp.com">Contact us</a>.</p>
                </div>
            </body>
        </html>
    `;
};


module.exports = requestTemplate;