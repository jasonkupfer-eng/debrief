import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // NEW: Now catching the email
    const { rating, log, email, initials } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const textBody = `
>>> MISSION DEBRIEF RECORDED <<<
PILOT INITIALS: ${initials}
COORDS: ${email}
HUMANITY RATING: ${rating} / 5

[ COMM-LOG ]
${log || "NO LOG PROVIDED"}

>>> END TRANSMISSION <<<`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <style>
        :root { color-scheme: dark; }
        body, table, td { background-color: #050508 !important; }
        @media (prefers-color-scheme: light) {
            body, table, td { background-color: #050508 !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#050508; color:#ffffff;">
    <table role="presentation" style="width:100%; border-collapse:collapse; border:0; border-spacing:0; background-color:#050508;">
        <tr>
            <td align="center" style="padding:0; background-color:#050508;">
                <table role="presentation" style="width:100%; max-width:600px; border-collapse:collapse; border:0; border-spacing:0; text-align:left;">
                    <tr>
                        <td style="padding:30px; background-color:#050508;">
                            
                            <h2 style="color:#00f0ff; font-family: monospace; font-size: 20px; letter-spacing: 2px; margin-bottom: 20px;">>>> MISSION DEBRIEF RECORDED <<<</h2>
                            
                            <p style="color:#39ff14; font-family: monospace; font-size: 16px; margin: 0 0 5px 0;"><strong>PILOT INITIALS:</strong> <span style="color:#fff;">${initials}</span></p>
                            <p style="color:#39ff14; font-family: monospace; font-size: 16px; margin: 0 0 5px 0;"><strong>COORDS:</strong> <a href="mailto:${email}" style="color:#ffea00;">${email}</a></p>
                            <p style="color:#ffea00; font-family: monospace; font-size: 16px; margin: 0 0 20px 0;"><strong>HUMANITY RATING:</strong> <span style="color:#fff;">${rating} / 5</span></p>
                            
                            <div style="border-top: 2px dashed #444; margin: 20px 0;"></div>
                            
                            <p style="color:#ffffff; font-family: monospace; font-size: 16px; line-height: 1.5; white-space: pre-wrap;">${log || "NO LOG PROVIDED"}</p>
                            
                            <div style="border-top: 2px dashed #444; margin: 20px 0;"></div>
                            
                            <p style="color:#ff007f; font-family: monospace; font-size: 14px; margin-top: 20px;">>>> END TRANSMISSION <<<</p>

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    try {
        await transporter.sendMail({
            from: `"Arcade Mainframe" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, 
            replyTo: email, // <-- THE MAGIC FIX FOR GMAIL
            subject: `🚨 NEW PILOT DEBRIEF: ${initials} - ${rating}/5 Stars`,
            text: textBody,
            html: htmlBody
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Mail routing error:', error);
        res.status(500).json({ error: 'Failed to transmit debrief message' });
    }
}
