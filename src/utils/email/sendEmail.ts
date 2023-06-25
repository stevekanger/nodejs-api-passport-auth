import nodemailer from 'nodemailer'

export default async function sendEmail({
  from,
  to,
  subject,
  html,
}: {
  from: string
  to: string
  subject: string
  html: string
}) {
  try {
    // Only used for testing purposes remove when adding your own smtp client settings
    let testMailerAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testMailerAccount.user, // generated ethereal user
        pass: testMailerAccount.pass, // generated ethereal password
      },
    })

    const info = await transporter.sendMail({ from, to, subject, html })

    // Preview only available when sending through an Ethereal account remove when using your own email transporter
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  } catch (error) {
    throw new Error('There was an error sending email')
  }
}
