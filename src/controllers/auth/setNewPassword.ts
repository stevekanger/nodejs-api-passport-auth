import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../models/User'
import sendEmail from '../../utils/email/sendEmail'
import config from '../../config'

export default async function setNewPasswordController(
  req: Request,
  res: Response
) {
  try {
    const authHeader = req.get('Authorization')
    const token = authHeader?.split(' ')[1] as string

    const { password } = req.body

    const { _id } = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string
    }

    const user = await User.findOne({ _id })

    if (!user?.verified) {
      return res.status(401).json({
        success: false,
        msg: 'Unauthorized',
      })
    }

    if (!user)
      return res.status(400).json({
        success: false,
        msg: 'Bad request',
      })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    user.authProviders.local = hash
    user.save()

    await sendEmail({
      from: `"Security" <noreply@${config.clientUrl}>`,
      to: user.email,
      subject: 'Your Password Was Changed',
      html: `Your password was recently changed. If this was not you contact us immediately.`,
    })

    return res.status(200).json({
      success: true,
      msg: 'New password saved you may now log in',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'There was an error',
    })
  }
}
