import express, { Request, Response } from 'express'

const router = express.Router()

router.get('*', (req: Request, res: Response) => {
  return res.status(404).json({
    msg: 'The path your looking for is not found :(',
  })
})

export default router
