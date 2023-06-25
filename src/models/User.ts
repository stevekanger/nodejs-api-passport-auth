import mongoose, { Document } from 'mongoose'
import ms from 'ms'
import config from '../config'

export interface IUser extends Document {
  name: string
  email: string
  authToken: string
  verified: boolean
  authProviders: {
    local: string | null
    google: string | null
    facebook: string | null
    twitter: string | null
    github: string | null
  }
  expireAt: Date
}

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verificationToken: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  authProviders: {
    local: {
      type: String,
      default: null,
    },
    google: {
      type: String,
      default: null,
    },
    facebook: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },
    github: {
      type: String,
      default: null,
    },
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {
      expireAfterSeconds: ms(config.jwtVerificationLifespan) / 1000,
      partialFilterExpression: { verified: false },
    },
  },
})

const User = mongoose.model<IUser>('user', UserSchema)

export default User
