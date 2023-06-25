import { Request, Response } from 'express'
import sendEmail from '../../utils/email/sendEmail'
import User from '../../models/User'
import config from '../../config'
import createVerificationToken from '../../utils/auth/createVerifiactionToken'

export default async function requestNewPasswordController(
  req: Request,
  res: Response
) {
  try {
    const { email } = req.body

    if (!email)
      return res.status(400).json({
        success: false,
        msg: 'Bad request',
      })

    const user = await User.findOne({ email })

    if (!user)
      return res.status(400).json({
        success: false,
        msg: 'Bad request',
      })

    const verificationToken = createVerificationToken(user._id)

    await sendEmail({
      from: '"Security" <noreply@example.com>',
      to: email,
      subject: 'Password Change Request',
      html: `You have requested to change your password. Please follow the link below.<br>
       <a href="${config.clientUrl}/set-new-password?token=${verificationToken}">Change Password</a>`,
    })

    return res.status(200).json({
      success: true,
      msg: `An email was sent to ${email} please check your email for verification`,
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      msg: 'There was an error',
    })
  }
}
