import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import { Factory } from 'rosie'
import request from 'supertest'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'
import app from '../..'

const URL = '/accounts'

describe('CreateAccountEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockValidCreateAccountParameters = _.omit(mockAccount, ['id', 'created_at', 'updated_at'])

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    it('returns a success response if the parameters are valid', async (): Promise<void> => {
        const response = await request(app)
            .post(URL)
            .send(mockValidCreateAccountParameters)
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

    describe('returns a failed response if the parameters are invalid', (): void => {
        Object.keys(mockValidCreateAccountParameters).forEach((key: string): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockInvalidCreateAccountParameters: any = _.omit(mockValidCreateAccountParameters, [key])
            it(`fails when the ${key} parameter is missing`, async (): Promise<void> => {
                const response = await request(app)
                    .post(URL)
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    .send(mockInvalidCreateAccountParameters)
                    .expect(StatusCodes.BAD_REQUEST)
                const {
                    body,
                } = response
                const {
                    data,
                } = body
                expect(body).toHaveProperty('status', 'failed')
                expect(body).toHaveProperty('data')
                expect(data).toHaveProperty('code', 'ValidationError')
                expect(data).toHaveProperty('details')
            })
        })
    })
})
