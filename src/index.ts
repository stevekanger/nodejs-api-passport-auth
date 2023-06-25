require('dotenv').config()

import type { IUser } from './models/User'
import type { SessionOptions } from 'express-session'
import express from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import session from 'express-session'
import MongoDbSession from 'connect-mongodb-session'
import ms from 'ms'
import routes from './routes'
import config from './config'
import passport from 'passport'
import './passport'

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

declare module 'express-session' {
  interface SessionData {
    authOptions?: {
      type: string
      provider: string
      redirect: string
      msg: string
    }
    passport: {
      user: IUser
    }
  }
}

const app = express()
const MongoDbSessionStore = MongoDbSession(session)

connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log('Successfully connected To Database')
  })
  .catch((error) => {
    console.log('Error Connecting To DataBase', error)
  })

const corsOptions = {
  origin: config.clientUrl,
  credentials: true,
}

const store = new MongoDbSessionStore({
  uri: process.env.MONGO_URI as string,
  collection: 'authSessions',
})

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  name: config.appName + '_xAuth',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: ms(config.sessionLifespan),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  },
  store,
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
routes(app)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`)
})
