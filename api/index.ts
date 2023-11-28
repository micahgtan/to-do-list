import express from 'express'
import createAccount from './endpoints/create-account'
import createDuty from './endpoints/create-duty'
import createSession from './endpoints/create-session'
import deleteAccount from './endpoints/delete-account'
import deleteDuty from './endpoints/delete-duty'
import getAccounts from './endpoints/get-accounts'
import getDuties from './endpoints/get-duties'
import getHealth from './endpoints/get-health'
import updateAccount from './endpoints/update-account'
import updateDuty from './endpoints/update-duty'

const app = express()

app.use(express.json())

app.post('/accounts', createAccount)
app.get('/accounts', getAccounts)
app.put('/accounts/:id', updateAccount)
app.delete('/accounts/:id', deleteAccount)
app.post('/duties', createDuty)
app.get('/duties', getDuties)
app.put('/duties/:id', updateDuty)
app.delete('/duties/:id', deleteDuty)
app.post('/session', createSession)
app.get('/', getHealth)

export default app
