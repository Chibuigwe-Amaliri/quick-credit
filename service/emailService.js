const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const path = require('path');
const fs = require('fs');

exports.sendEmailVerification = async (email, firstName, verificationToken, verificationTokenExpires) => {
console.log(email, firstName, verificationToken, verificationTokenExpires);
    const expirationTime = verificationTokenExpires.toLocaleString();
    let html = fs.readFileSync(path.join(__dirname, '../views/email-verification.html'), 'utf8');

    const verificationLink =
        `http://localhost:5173/verify-email?token=${verificationToken}`;

        html = html.replace('{{verificationLink}}', verificationLink);
        html = html.replace('{{VERIFICATION_LINK}}', verificationLink);
        html = html.replace('{{firstName}}', firstName);
        html = html.replace('{{expirationTime}}', expirationTime);

        const { error } = await resend.emails.send({
        from: "Quick Credit <onboarding@resend.dev>",
        to: [email],
        subject: "quick credit email verification",
        html,
    });

    if(error) {
        throw new Error(`Email verification failed: ${error.message}`);
    }

}