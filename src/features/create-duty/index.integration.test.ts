import _ from 'lodash'
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

describe('CreateDuty', (): void => {
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

    describe('#process', (): void => {
        it('creates a duty record in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateDuty)
            const createdDuty = await subject.execute(mockValidCreateDutyParameters)
            validateDuty(createdDuty)
        })

        Object.keys(mockValidCreateDutyParameters).forEach((key: string): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockInvalidCreateDutyParameters: any = _.omit(mockValidCreateDutyParameters, [key])

            it(`fails when the ${key} parameter is missing`, async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateDuty)
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    await subject.execute(mockInvalidCreateDutyParameters)
                } catch (error) {
                    expect(error).toHaveProperty('code', 'ValidationError')
                    expect(error).toHaveProperty('details')
                    expect(error.details[0]).toHaveProperty('message', `"${key}" is required`)
                    expect(error.details[0]).toHaveProperty('key', key)
                    return
                }
                throw new Error('fail')
            })
        })

        it('fails when an account record with an id property equal to the account_id parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateDuty)
            try {
                await accountDataSource.truncate()
                await subject.execute(mockValidCreateDutyParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'NoDataFoundError')
                expect(error).toHaveProperty('message', 'Account record does not exist')
                return
            }
            throw new Error('fail')
        })

        it('fails when a duty record with a name property equal to the name parameter exists in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateDuty)
            const mockInvalidCreateDutyParameters = {
                ...mockValidCreateDutyParameters,
            }
            try {
                await subject.execute(mockValidCreateDutyParameters)
                await subject.execute(mockInvalidCreateDutyParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'UniqueConstraintError')
                expect(error).toHaveProperty('details')
                return
            }
            throw new Error('fail')
        })
    })
})
