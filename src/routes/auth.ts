import express from 'express'
import login from '../controllers/auth/login'
import logout from '../controllers/auth/logout'
import signup from '../controllers/auth/signup'
import verification from '../controllers/auth/verification'
import requestNewPassword from '../controllers/auth/requestNewPassword'
import setNewPassword from '../controllers/auth/setNewPassword'
import { localLoginMiddleware } from '../passport/local'
import { oAuthMiddleware, oAuthCallbackMiddleware } from '../passport/oAuth'

const router = express.Router()

// OAuth
router.get('/oauth', oAuthMiddleware, login)
router.get('/oauth/callback', oAuthCallbackMiddleware)

// local
router.post('/login', localLoginMiddleware, login)
router.post('/logout', logout)
router.post('/signup', signup)
router.post('/verification', verification)
router.post('/request-new-password', requestNewPassword)
router.post('/set-new-password', setNewPassword)

export default router
