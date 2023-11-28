import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type {
    IAccountDataSource,
    IDutyDataSource,
} from '@interfaces/data-sources'
import type { IExecutable } from '@interfaces/executable'
import type {
    IAccount,
    IDuty,
} from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateDuty } from '@tests/assertions'

describe('DeleteDuty', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const dutyDataSource: IDutyDataSource = container.get(Types.DutyDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockDuty: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockValidDeleteDutyParameters = {
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

    describe('#process', (): void => {
        it('deletes a duty record in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.DeleteDuty)
            const deletedDuty = await subject.execute(mockValidDeleteDutyParameters)
            validateDuty(deletedDuty)
        })

        it('fails when an account record with an id property equal to the account_id parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.DeleteDuty)
            try {
                await accountDataSource.truncate()
                await subject.execute(mockValidDeleteDutyParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'NoDataFoundError')
                expect(error).toHaveProperty('message', 'Account record does not exist')
                return
            }
            throw new Error('fail')
        })

        it('fails when a duty record with an id property equal to the id parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.DeleteDuty)
            try {
                await dutyDataSource.truncate()
                await subject.execute(mockValidDeleteDutyParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'NoDataFoundError')
                expect(error).toHaveProperty('message', 'Duty record does not exist')
                return
            }
            throw new Error('fail')
        })
    })
})
