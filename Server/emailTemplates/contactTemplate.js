
const contactUsTemplate = (name, email, message) => {
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
                    .footer {
                        font-size: 12px;
                        color: #999;
                        margin-top: 20px;
                    }
                    .footer a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    .message {
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 4px;
                        border: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Message from AICOMP</div>
                    <div class="email-body">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong></p>
                        <div class="message">
                            ${message}
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated email notification from AICOMP. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

module.exports = contactUsTemplate;