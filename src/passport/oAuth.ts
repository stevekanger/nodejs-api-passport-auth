import type { Response, Request, NextFunction } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as GithubStrategy } from 'passport-github2'
import { isValidProvider, getOptions, getInfoFromProfile } from './utils'
import User, { IUser } from '../models/User'
import config from '../config'

type OAuthRequest = Request<
  {},
  {},
  {},
  {
    type?: string
    provider?: string
    redirect?: string
  }
>

type DoneFunction = (err?: Error | null, profile?: any) => void

const callbackURL = '/auth/oauth/callback'

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL,
      passReqToCallback: true,
    },
    strategyCallback
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
      callbackURL,
      profileFields: ['id', 'emails', 'name'],
      passReqToCallback: true,
    },
    strategyCallback
  )
)

passport.use(
  new TwitterStrategy(
    {
      consumerKey: `${process.env.TWITTER_CLIENT_ID}`,
      consumerSecret: `${process.env.TWITTER_CLIENT_SECRET}`,
      callbackURL,
      includeEmail: true,
      passReqToCallback: true,
    },
    strategyCallback
  )
)

passport.use(
  new GithubStrategy(
    {
      clientID: `${process.env.GITHUB_CLIENT_ID}`,
      clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
      scope: ['user:email'],
      callbackURL,
      passReqToCallback: true,
    },
    strategyCallback
  )
)

async function strategyCallback(
  req: OAuthRequest,
  token: string,
  tokenSecret: string,
  profile: any,
  done: DoneFunction
) {
  const type = req.session.authOptions?.type

  if (type === 'signup') {
    await strategySignup(req, profile, done)
    return
  }
  await strategyLogin(req, profile, done)
}

async function strategySignup(
  req: OAuthRequest,
  profile: any,
  done: DoneFunction
) {
  const userInfo = getInfoFromProfile(profile)
  try {
    const user = await User.findOne({ email: userInfo?.email })
    if (user) {
      req.session.authOptions &&
        (req.session.authOptions.msg = 'A user with that email already exists.')
      return done(null)
    }

    if (!userInfo) {
      req.session.authOptions &&
        (req.session.authOptions.msg =
          'There was an error getting your info from provider.')
      return done(null)
    }

    const newUser = new User({
      name: userInfo.name,
      email: userInfo.email,
      verified: true,
      authProviders: {
        [userInfo.provider]: userInfo.id,
      },
    })
    await newUser.save()
    req.session.authOptions &&
      (req.session.authOptions.msg = 'Your profile was created successfully.')
    done(null, newUser)
  } catch (err) {
    done(null)
  }
}

async function strategyLogin(
  req: OAuthRequest,
  profile: any,
  done: DoneFunction
) {
  const id = profile.id?.toString()
  const { provider } = profile
  try {
    const user = await User.findOne({ [`authProviders.${provider}`]: id })
    if (!user) {
      req.session.authOptions!.msg = 'No user found in database.'
      done(null)
      return
    }
    done(null, user)
  } catch (err) {
    done(null)
  }
}

export function oAuthMiddleware(
  req: OAuthRequest,
  res: Response,
  next: NextFunction
) {
  const { type = 'login', provider = '', redirect = '/' } = req.query
  if (!isValidProvider(provider)) return res.sendStatus(401)
  req.session.authOptions = { type, provider, redirect, msg: '' }
  passport.authenticate(provider!, getOptions(provider!))(req, res, next)
}

export function oAuthCallbackMiddleware(
  req: OAuthRequest,
  res: Response,
  next: NextFunction
) {
  const { provider } = req.session.authOptions!
  if (!isValidProvider(provider)) return res.sendStatus(401)
  passport.authenticate(provider, (err: any, user: IUser, info: any) => {
    const { type, redirect, msg } = req.session.authOptions!

    const successRedirect = config.clientUrl + redirect + '?msg=' + msg
    const failureRedirect =
      config.clientUrl +
      `/${type === 'signup' ? 'signup' : 'login'}?failure=true&msg=${msg}`

    if (user) {
      req.logIn(user, () => {
        res.redirect(successRedirect)
      })
      return
    }
    res.redirect(failureRedirect)
  })(req, res, next)
}
