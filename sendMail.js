const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

async function sendEmail(recruiter) {

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD || process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: recruiter.email,

            subject: `Application for ${recruiter.jobTitle}`,

            html: `
                <h3>Job Application</h3>
                <p>Dear Recruiter,</p>
                <p>
                    I am interested in the
                    <b>${recruiter.jobTitle}</b>
                    position.
                </p>
                <p>
                    Please find my resume attached for your review.
                </p>
                <p>
                    Regards,<br/>
                    Candidate Name
                </p>
            `,

            attachments: [
                {
                    filename: "resume.pdf",
                    path: path.join(__dirname, "resumes", "resume.pdf")
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✓ Email sent to:", recruiter.email);
        console.log("Message ID:", info.messageId);

    } catch (error) {

        console.log("❌ Email failed for:", recruiter.email);
        console.log("Error:", error.message);
    }
}

module.exports = sendEmail;