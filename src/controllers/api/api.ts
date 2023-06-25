import { Request, Response } from 'express'

export default function apiController(req: Request, res: Response) {
  res.status(200).json({
    success: true,
    msg: `You have access to the api`,
  })
}
