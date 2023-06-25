# Authentication Rest Api Boilerplate

Simple authentication rest api with express, mongoose and passportjs. Built with typescript. This authentication uses passportjs and sessions to authenticate users.

## Installation

```bash
git clone https://github.com/stevekanger/nodejs-api-passport-auth.git
```

```bash
npm install
```

### Add a `.env` file at the root of your project and add the following variables with your credentials.

```
# Mongo db uri
MONGO_URI=mongodb://127.0.0.1:27017/example_database

# JSON web token secret used for signing jwt
JWT_SECRET=YOUR_JWT_SECRET_CODE_HERE

# Session secret used for signing the session cookie
SESSION_SECRET=YOUR_SESSION_SECRET_CODE_HERE

# Google client id
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# Google client secret
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

# Facebook client id
FACEBOOK_CLIENT_ID=YOUR_FACEBOOK_CLIENT_ID_HERE

# Facebook client secret
FACEBOOK_CLIENT_SECRET=YOUR_FACEBOOK_CLIENT_SECRET_HERE

# Twitter client id
TWITTER_CLIENT_ID=YOUR_TWITTER_CLIENT_ID_HERE

# Twitter client secret
TWITTER_CLIENT_SECRET=YOUR_TWITTER_CLIENT_SECRET_HERE

# Github client id
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID_HERE

# Github client secret
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET_HERE
```

### Replace your info in the `config.ts` file

```javascript
const config: TConfig = {
  appName: 'nodejs-api-passport-auth',
  clientUrl: 'http://localhost:5173',
  serverUrl: 'http://localhost:5000',
  jwtVerificationLifespan: '2m',
  sessionLifespan: '2m',
}
```

### Replace your smtp settings in `utils/sendEmail.ts`

Right now the email is set to nodemailers test client. Change these variables to your smpt client for production. It should look something like the following when done.

```javascript
export default async function sendEmail({
  from,
  to,
  subject,
  html,
}: {
  from: string
  to: string
  subject: string
  html: string
}) {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.your-email-host.com',
      port: 465,
      secure: true,
      auth: {
        user: 'Your Username',
        pass: 'Your password',
      },
    })

    await transporter.sendMail({ from, to, subject, html })
  } catch (error) {
    throw new Error('There was an error sending email')
  }
}
```

## Commands

to develop

```bash
npm run dev
```

to build

```bash
npm run build
```

and to start

```bash
npm run start
```
