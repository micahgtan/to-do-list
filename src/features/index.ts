import { Container } from 'inversify'
import Types from '@src/types'
import CreateAccount from './create-account'
import CreateSession from './create-session'
import DeleteAccount from './delete-account'
import UpdateAccount from './update-account'

const container = new Container()

container.bind(Types.CreateAccount).to(CreateAccount)
container.bind(Types.DeleteAccount).to(DeleteAccount)
container.bind(Types.UpdateAccount).to(UpdateAccount)
container.bind(Types.CreateSession).to(CreateSession)

export default container
