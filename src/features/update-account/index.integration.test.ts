import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'

describe('UpdateAccount', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockValidUpdateAccountParameters = {
        id: mockAccount.id,
        first_name: 'updated_first_name',
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    describe('#process', (): void => {
        it('updates an account record in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.UpdateAccount)
            const updatedAccount = await subject.execute(mockValidUpdateAccountParameters)
            validateAccount(updatedAccount)
            expect(updatedAccount).toHaveProperty('first_name', mockValidUpdateAccountParameters.first_name)
        })

        it('fails when an account record with an id property equal to the account_id parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.UpdateAccount)
            try {
                await accountDataSource.truncate()
                await subject.execute(mockValidUpdateAccountParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'NoDataFoundError')
                expect(error).toHaveProperty('message', 'Account record does not exist')
                return
            }
            throw new Error('fail')
        })
    })
})
