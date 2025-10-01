import nodemailer from 'nodemailer';

// Configure transporter
const transporter = nodemailer.createTransport({
    // host: process.env.MAIL_HOST,
    // port: process.env.MAIL_PORT,
    service: "gmail",
    secure: process.env.NODE_ENV !== 'development',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const sendMail = async (dto) => {
    const { sender, recipients, subject, text, html } = dto

    return await transporter.sendMail({
        from: sender,
        to: recipients,
        subject: subject,
        text: text,
        html: html
    })
}

// const transporter = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     secure: process.env.NODE_ENV !== 'development',
//     auth: {
//         user: process.env.MAIL_USERNAME,
//         pass: process.env.MAIL_PASSWORD,
//     },
// })



// export const sendMail = async (dto) => {
//     const { sender, recipients, subject, text, html } = dto

//     return await transporter.sendMail({
//         from: sender,
//         to: recipients,
//         subject: subject,
//         text: text,
//         html: html
//     })
// }