import config from 'config'
import { Container } from 'inversify'
import Knex from 'knex'
import AccountDataSource from '@services/account-database'
import DutyDataSource from '@services/duty-database'
import EncryptionService from '@services/encryption'
import HashService from '@services/hash'
import IdService from '@services/id'
import Types from '@src/types'

const container = new Container()
// eslint-disable-next-line @typescript-eslint/naming-convention
const DATABASE_ETC: object = config.get('database.etc')
// eslint-disable-next-line new-cap
const knex = Knex({
    client: config.get('database.client'),
    connection: {
        database: config.get('database.name'),
        host: config.get('database.connection.host'),
        user: config.get('database.connection.user'),
        password: config.get('database.connection.password'),
    },
    ...DATABASE_ETC,
})

container.bind(Types.AccountDataSource).to(AccountDataSource)
container.bind(Types.DutyDataSource).to(DutyDataSource)
container.bind(Types.HashService).to(HashService)
container.bind(Types.EncryptionService).to(EncryptionService)
container.bind(Types.IdService).to(IdService)
container.bind(Types.Knex).toConstantValue(knex)

export default container
