import express from 'express'
import auth from '../middleware/auth'

const router = express.Router()

router.get('/', auth, (req, res) => {
  res.json({
    success: true,
    message: 'We made it!',
  })
})

export default router
