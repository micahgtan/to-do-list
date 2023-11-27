import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import request from 'supertest'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'
import app from '../..'

const URL = '/account'

describe('DeleteAccountEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount1: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccount2: IAccount = Factory.build('service.account_database.record.account.2')
    const mockValidDeleteAccountParameters = mockAccount1.id

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount1)
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    it('returns a success response if the parameters are valid', async (): Promise<void> => {
        const response = await request(app)
            .delete(`${URL}/${mockAccount1.id}`)
            .send(mockValidDeleteAccountParameters)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        const {
            data,
        }: { data: IAccount } = body
        expect(body).toHaveProperty('status', 'success')
        expect(body).toHaveProperty('data')
        validateAccount(data)
    })

    it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
        const response = await request(app)
            .delete(`${URL}/${mockAccount2.id}`)
            .send(mockValidDeleteAccountParameters)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        const {
            data,
        }: { data: IAccount } = body
        expect(body).toHaveProperty('status', 'failed')
        expect(body).toHaveProperty('data')
        expect(data).toHaveProperty('code', 'NoDataFoundError')
    })
})
