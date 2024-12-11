import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})


export const sendMail = async (payload) => {
    try {
        const mailOption = {
            from: "Form Submition",
            to: payload.receiver,
            subject: payload.subject,
            text: JSON.stringify(payload.body)
        }
        const mailRes = await transporter.sendMail(mailOption);
        return mailRes;
    } catch (error) {
        return
    }
}