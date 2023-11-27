import config from 'config'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import { Factory } from 'rosie'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import type { Knex } from 'knex'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'
import { handler } from '.'

const ACCOUNTS_TABLE: string = config.get('database.tables.accounts')

describe('CreateAccountEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const knex: Knex = container.get(Types.Knex)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockValidCreateAccountParameters = _.omit(mockAccount, ['id', 'created_at', 'updated_at'])
    const mockValidEvent = {
        body: JSON.stringify(mockValidCreateAccountParameters),
    }

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

        it('creates an account record in the database if the parameters are valid', async (): Promise<void> => {
            await handler(mockValidEvent)
            const [account] = await knex(ACCOUNTS_TABLE).where('first_name', mockAccount.first_name)
            expect(account).toHaveProperty('first_name', mockAccount.first_name)
        })

        describe('returns a failed response if the parameters are invalid', (): void => {
            Object.keys(mockValidCreateAccountParameters).forEach((key: string): void => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mockInvalidCreateAccountParameters: any = _.omit(mockValidCreateAccountParameters, [key])
                const mockInvalidEvent = {
                    body: JSON.stringify(mockInvalidCreateAccountParameters),
                }
                it(`fails when the ${key} parameter is missing`, async (): Promise<void> => {
                    const response = await handler(mockInvalidEvent)
                    const {
                        body,
                    } = response
                    const parsedBody = JSON.parse(body)
                    expect(response).toHaveProperty('status_code', StatusCodes.OK)
                    expect(response).toHaveProperty('body')
                    expect(parsedBody).toHaveProperty('status', 'failed')
                    expect(parsedBody).toHaveProperty('error')
                    expect(parsedBody.error).toHaveProperty('code', 'ValidationError')
                    expect(parsedBody.error).toHaveProperty('message')
                    expect(parsedBody.error).toHaveProperty('details')
                })

                it('does not create an account record in the database if the parameters are invalid', async (): Promise<void> => {
                    await handler(mockInvalidEvent)
                    const accounts = await knex(ACCOUNTS_TABLE).select('*')
                    expect(accounts).toStrictEqual([])
                })
            })
        })
    })
})
