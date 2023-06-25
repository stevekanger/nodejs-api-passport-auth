import { Request, Response } from 'express'

export default async function login(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    msg: 'You have been logged in.',
  })
}
