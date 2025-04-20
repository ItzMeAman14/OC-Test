const blockTemplate = (email, status) => {
    let message = '';
    let buttonText = '';
    let buttonLink = '';

    if (status) {
        message = `
            <p>We regret to inform you that your account has been <span class="important">blocked</span> due to some issues.</p>
            <p>If you believe this is a mistake, you can reach out to admin for further assistance.</p>
        `;
        buttonText = 'Contact Support';
        buttonLink = 'mailto:support@ccl.com';
    } 
    else {
        message = `
            <p>We are happy to inform you that your account has been successfully <span class="important-unblock">unblocked.</span></p>
            <p>You can now log in to your account and continue your activities. If you encounter any issues, feel free to reach out to us.</p>
        `;
        buttonText = 'Contact Support';
        buttonLink = 'mailto:support@ccl.com';
    }

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
                    .important-unblock {
                        font-weight: bold;
                        color: #42bf00;
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
                    <div class="email-header">
                        <img src="${process.env.LOGO}" alt="Logo" style="max-width: 100px; margin-bottom: 20px;" />
                        Your Account Status has Changed
                    </div>
                    <div class="email-body">
                        <p>Dear <strong>${email}</strong>,</p>
                        ${message}
                        <p>If you have any further questions, don't hesitate to <a href="${buttonLink}" class="action-button">${buttonText}</a>.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email notification from CCL. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

module.exports = blockTemplate;
