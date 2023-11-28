import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import request from 'supertest'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'
import app from '../..'

const URL = '/accounts'

describe('GetAccountsEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockValidGetAccountParameters = {
        id: mockAccount.id,
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    it('returns a success response', async (): Promise<void> => {
        const response = await request(app)
            .get(URL)
            .query(mockValidGetAccountParameters)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        const {
            data,
        }: { data: IAccount[] } = body
        expect(body).toHaveProperty('status', 'success')
        expect(body).toHaveProperty('data')
        data.forEach((account: IAccount): void => {
            validateAccount(account)
        })
    })
})
