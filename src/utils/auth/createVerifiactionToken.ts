import type { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import config from '../../config'

export default function createVerificationToken(_id: Types.ObjectId) {
  return jwt.sign({ _id }, process.env.JWT_SECRET as string, {
    expiresIn: config.jwtVerificationLifespan,
  })
}
