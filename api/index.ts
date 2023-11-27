import express from 'express'
import createAccount from './endpoints/create-account'
import createSession from './endpoints/create-session'
import deleteAccount from './endpoints/delete-account'
import getAccount from './endpoints/get-account'
import getHealth from './endpoints/get-health'
import updateAccount from './endpoints/update-account'

const app = express()

app.use(express.json())

app.post('/account', createAccount)
app.get('/account', getAccount)
app.put('/account/:id', updateAccount)
app.delete('/account/:id', deleteAccount)
app.post('/session', createSession)
app.get('/', getHealth)

export default app
