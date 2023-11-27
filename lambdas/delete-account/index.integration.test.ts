import config from 'config'
import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import type { Knex } from 'knex'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'
import { handler } from '.'

const ACCOUNTS_TABLE: string = config.get('database.tables.accounts')

describe('DeleteAccountEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const knex: Knex = container.get(Types.Knex)
    const mockAccount1: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccount2: IAccount = Factory.build('service.account_database.record.account.2')
    const mockValidEvent = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        pathParameters: {
            id: mockAccount1.id,
        },
    }
    const mockInvalidEvent = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        pathParameters: {
            id: mockAccount2.id,
        },
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount1)
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
        jest.resetAllMocks()
    })

    describe('#handler', (): void => {
        it('returns a success response if the parameters are valid', async (): Promise<void> => {
            const response = await handler(mockValidEvent)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            const {
                data,
            }: { data: IAccount } = parsedBody
            expect(response).toHaveProperty('status_code', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'success')
            expect(parsedBody).toHaveProperty('data')
            validateAccount(data)
        })

        it('deletes an account record in the database if the parameters are valid', async (): Promise<void> => {
            await handler(mockValidEvent)
            const [account]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount1.id)
            expect(account).toBeUndefined()
        })

        it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
            const response = await handler(mockInvalidEvent)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            expect(response).toHaveProperty('status_code', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'failed')
            expect(parsedBody).toHaveProperty('error')
            expect(parsedBody.error).toHaveProperty('code', 'NoDataFoundError')
            expect(parsedBody.error).toHaveProperty('message')
        })

        it('does not update an account record in the database if the parameters are invalid', async (): Promise<void> => {
            await handler(mockInvalidEvent)
            const [account]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount1.id)
            expect(account.first_name).toEqual(mockAccount1.first_name)
        })
    })
})
