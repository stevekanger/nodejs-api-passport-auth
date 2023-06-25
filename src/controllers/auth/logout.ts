import { Request, Response } from 'express'

export default async function logout(req: Request, res: Response) {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        msg: 'There was an error logging you out.',
      })
    }

    return res.status(200).json({
      success: true,
      msg: 'You have successfully logged out.',
    })
  })
}
