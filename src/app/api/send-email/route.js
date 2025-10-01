import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { sendMail } from '@/utils/mail';
import { loadHtmlTemplate } from '@/utils/loadHtmlTemplate';

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { name, email, company, phone, message, budget } = body;

    try {
        const htmlToSend = loadHtmlTemplate('contactForm', {
            name,
            email,
            company,
            phone,
            message,
            budget,
        });

        await sendMail({
            sender: process.env.EMAIL_USER,
            recipients: email, // you or your team
            subject: `New contact form submission from ${name}`,
            text: `New submission from ${name}, email: ${email}, phone: ${phone}`,
            html: htmlToSend,
        });

        return new Response(JSON.stringify('Email sent successfully'), {
            status: 200,
        });
    } catch (error) {
        console.error('Error sending contact form:', error);
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
