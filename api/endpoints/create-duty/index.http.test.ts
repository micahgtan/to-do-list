import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import { Factory } from 'rosie'
import request from 'supertest'
import type {
    IAccountDataSource,
    IDutyDataSource,
} from '@interfaces/data-sources'
import type {
    IAccount,
    IDuty,
} from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateDuty } from '@tests/assertions'
import app from '../..'

const URL = '/duties'

describe('CreateDutyEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const dutyDataSource: IDutyDataSource = container.get(Types.DutyDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockDuty: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockValidCreateDutyParameters = _.omit(mockDuty, ['id', 'created_at', 'updated_at'])

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
    })

    afterEach(async (): Promise<void> => {
        await dutyDataSource.truncate()
        await accountDataSource.truncate()
    })

    it('returns a success response if the parameters are valid', async (): Promise<void> => {
        const response = await request(app)
            .post(URL)
            .send(mockValidCreateDutyParameters)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        const {
            data,
        }: { data: IDuty } = body
        expect(body).toHaveProperty('status', 'success')
        expect(body).toHaveProperty('data')
        validateDuty(data)
    })

    describe('returns a failed response if the parameters are invalid', (): void => {
        Object.keys(mockValidCreateDutyParameters).forEach((key: string): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockInvalidCreateDutyParameters: any = _.omit(mockValidCreateDutyParameters, [key])
            it(`fails when the ${key} parameter is missing`, async (): Promise<void> => {
                const response = await request(app)
                    .post(URL)
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    .send(mockInvalidCreateDutyParameters)
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
