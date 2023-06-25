import type { IUser } from '../models/User'
import passport from 'passport'
import './local'
import './oAuth'

passport.serializeUser((user: IUser, done) => {
  done(null, user)
})

passport.deserializeUser((user: IUser, done) => {
  done(null, user)
})
