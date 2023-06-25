import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/User'
import sendEmail from '../../utils/email/sendEmail'
import validateEmail from '../../utils/email/validateEmail'
import createVerificationToken from '../../utils/auth/createVerifiactionToken'
import config from '../../config'

export default async function signupController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password || !validateEmail(email))
      return res.status(400).json({
        success: false,
        msg: 'Bad request',
      })

    const user = await User.findOne({ email: email })

    if (user)
      return res.status(400).json({
        success: false,
        msg: 'Bad request',
      })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      authProviders: {
        local: hashedPassword,
      },
    })

    newUser.save()

    const verificationToken = createVerificationToken(newUser._id)

    await sendEmail({
      from: `"Security" <noreply@${config.clientUrl}>`,
      to: email,
      subject: 'Email Verification',
      html: `You have signed up for a new account. Please verify your email by following the link below<br>
       <a href="${config.clientUrl}/email-verification?token=${verificationToken}">Email Verification</a>.`,
    })

    return res.status(200).json({
      success: true,
      msg: `User was created successfully.  Please check the email you provided to verify your email`,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'There was an error',
    })
  }
}
