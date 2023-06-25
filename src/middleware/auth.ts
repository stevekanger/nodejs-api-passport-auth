import { Request, Response, NextFunction } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.session?.passport?.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    })
  }

  next()
}
