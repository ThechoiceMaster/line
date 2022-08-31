require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { randomUUID } = require('crypto')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json('is line login')
})

app.get('/line', (req, res) => {
    const url = new URL(process.env.LINE_ME_URL + '/authorize')
    console.log(url)
    url.search = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINE_CLIENT_ID,
      redirect_uri: `${process.env.LINE_ENDPOIN}/auth/line/redirect`,
      state: randomUUID(),
      scope: 'profile openid email',
    }).toString()
    console.log(url.href)
    return res.redirect(url.href)
})

app.get('/line/redirect', async () => {
    const urlToken = process.env.LINE_ME_URL_TOKEN + '/token'
    const urlVerify = process.env.LINE_ME_URL_TOKEN + '/verify'
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const bodyToken = new URLSearchParams({
      grant_type: 'authorization_code',
      code: query.code,
      redirect_uri: `${process.env.LINE_ENDPOIN}/auth/line/redirect`,
      client_id: process.env.LINE_CLIENT_ID,
      client_secret: process.env.LINE_CLIENT_SECRET,
    })
    const resToken = await fetch({
        url: urlToken,
        method: 'POST',
        headers,
        body: bodyToken
    })
    const dataToken = await resToken.json()
    const bodyVerify = new URLSearchParams({
        id_token: dataToken.id_token,
        client_id: process.env.LINE_CLIENT_ID,
    })
    const res = await fetch({
        url: urlVerify,
        method: 'POST',
        headers,
        body: bodyVerify
    })
    const dataVerify = await res.json()
    return res.json(dataVerify)
})

const APP_PORT = process.env.APP_PORT || 3000

app.listen(APP_PORT, () => {
    console.log('server is running... ' + APP_PORT)
})