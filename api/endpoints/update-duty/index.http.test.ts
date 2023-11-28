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

describe('UpdateDutyEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const dutyDataSource: IDutyDataSource = container.get(Types.DutyDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockDuty1: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockDuty2: IDuty = Factory.build('service.duty_database.record.duty.2')
    const mockValidUpdateDutyParameters = {
        name: 'updated_name',
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
        await dutyDataSource.create(mockDuty1)
    })

    afterEach(async (): Promise<void> => {
        await dutyDataSource.truncate()
        await accountDataSource.truncate()
    })

    it('returns a success response if the parameters are valid', async (): Promise<void> => {
        const response = await request(app)
            .put(`${URL}/${mockDuty1.id}`)
            .send(mockValidUpdateDutyParameters)
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

    it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
        const response = await request(app)
            .put(`${URL}/${mockDuty2.id}`)
            .send(mockValidUpdateDutyParameters)
            .expect(StatusCodes.BAD_REQUEST)
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
