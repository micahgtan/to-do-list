import { StatusCodes } from 'http-status-codes'
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

describe('GetDutiesEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const dutyDataSource: IDutyDataSource = container.get(Types.DutyDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockDuty: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockValidGetDutyParameters = {
        id: mockDuty.id,
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
        await dutyDataSource.create(mockDuty)
    })

    afterEach(async (): Promise<void> => {
        await dutyDataSource.truncate()
        await accountDataSource.truncate()
    })

    it('returns a success response', async (): Promise<void> => {
        const response = await request(app)
            .get(URL)
            .query(mockValidGetDutyParameters)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        const {
            data,
        }: { data: IDuty[] } = body
        expect(body).toHaveProperty('status', 'success')
        expect(body).toHaveProperty('data')
        data.forEach((duty: IDuty): void => {
            validateDuty(duty)
        })
    })
})
