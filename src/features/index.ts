import { Container } from 'inversify'
import Types from '@src/types'
import CreateAccount from './create-account'
import CreateDuty from './create-duty'
import CreateSession from './create-session'
import DeleteAccount from './delete-account'
import DeleteDuty from './delete-duty'
import UpdateAccount from './update-account'
import UpdateDuty from './update-duty'

const container = new Container()

container.bind(Types.CreateAccount).to(CreateAccount)
container.bind(Types.CreateDuty).to(CreateDuty)
container.bind(Types.DeleteAccount).to(DeleteAccount)
container.bind(Types.DeleteDuty).to(DeleteDuty)
container.bind(Types.UpdateAccount).to(UpdateAccount)
container.bind(Types.UpdateDuty).to(UpdateDuty)
container.bind(Types.CreateSession).to(CreateSession)

export default container
