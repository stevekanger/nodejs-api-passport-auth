import { Application } from 'express'
import auth from './auth'
import api from './api'

export default function routes(app: Application) {
  app.use('/auth', auth)
  app.use('/api', api)

  app.get('/', (req, res) => {
    res.json({
      message: 'You made it to the homepage!',
    })
  })
}
