import type { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import User, { IUser } from '../models/User'

passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user || !user.authProviders.local || !user.verified) {
        return done(null)
      }

      const compared = await bcrypt.compare(password, user.authProviders.local)
      if (compared) return done(null, user)

      return done(null)
    } catch (err) {
      return done(null)
    }
  })
)

export function localLoginMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate('local', (err: any, user: IUser) => {
    if (!user)
      return res.status(401).json({
        success: false,
        msg: 'Unauthorized',
      })

    req.logIn(user, (err) => {
      next(err)
    })
  })(req, res, next)
}
