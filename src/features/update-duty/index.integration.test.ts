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

describe('UpdateDuty', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const dutyDataSource: IDutyDataSource = container.get(Types.DutyDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockDuty1: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockDuty2: IDuty = Factory.build('service.duty_database.record.duty.2')
    const mockValidUpdateDutyParameters = {
        id: mockDuty1.id,
        name: 'updated_name',
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
        await dutyDataSource.create(mockDuty1)
        await dutyDataSource.create(mockDuty2)
    })

    afterEach(async (): Promise<void> => {
        await dutyDataSource.truncate()
        await accountDataSource.truncate()
    })

    describe('#process', (): void => {
        it('updates a duty record in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.UpdateDuty)
            const updatedDuty = await subject.execute(mockValidUpdateDutyParameters)
            validateDuty(updatedDuty)
            expect(updatedDuty).toHaveProperty('name', mockValidUpdateDutyParameters.name)
        })

        it('fails when an account record with an id property equal to the account_id parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.UpdateDuty)
            try {
                await accountDataSource.truncate()
                await subject.execute(mockValidUpdateDutyParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'NoDataFoundError')
                expect(error).toHaveProperty('message', 'Account record does not exist')
                return
            }
            throw new Error('fail')
        })

        it('fails when a duty record with an id property equal to the id parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.UpdateDuty)
            try {
                await dutyDataSource.truncate()
                await subject.execute(mockValidUpdateDutyParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'NoDataFoundError')
                expect(error).toHaveProperty('message', 'Duty record does not exist')
                return
            }
            throw new Error('fail')
        })

        it('fails when a duty record with a name property equal to the name parameter already exists in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.UpdateDuty)
            const mockInvalidUpdateDutyParameters = {
                ...mockValidUpdateDutyParameters,
                name: mockDuty2.name,
            }
            try {
                await subject.execute(mockValidUpdateDutyParameters)
                await subject.execute(mockInvalidUpdateDutyParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'UniqueConstraintError')
                expect(error).toHaveProperty('details')
                return
            }
            throw new Error('fail')
        })
    })
})
