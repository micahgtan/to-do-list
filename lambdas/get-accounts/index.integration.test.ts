import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'
import { handler } from '.'

describe('GetAccountEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockGetAccountParameters = {
        id: mockAccount.id,
    }
    const mockEvent = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        query: mockGetAccountParameters,
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
        jest.resetAllMocks()
    })

    describe('#handler', (): void => {
        it('returns a success response', async (): Promise<void> => {
            const response = await handler(mockEvent)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            const {
                data,
            }: { data: IAccount[] } = parsedBody
            expect(response).toHaveProperty('status_code', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'success')
            expect(parsedBody).toHaveProperty('data')
            data.forEach((account: IAccount): void => {
                validateAccount(account)
            })
        })

        describe('when no account record exists in the database', (): void => {
            beforeEach(async (): Promise<void> => {
                await accountDataSource.truncate()
            })

            it('returns an empty array', async (): Promise<void> => {
                const response = await handler(mockEvent)
                const {
                    body,
                } = response
                const parsedBody = JSON.parse(body)
                expect(response).toHaveProperty('status_code', StatusCodes.OK)
                expect(response).toHaveProperty('body')
                expect(parsedBody).toHaveProperty('status', 'success')
                expect(parsedBody).toHaveProperty('data')
                expect(parsedBody.data).toEqual([])
            })
        })
    })
})
