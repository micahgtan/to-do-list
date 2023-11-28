import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'

describe('DeleteAccount', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockValidDeleteAccountParameters = {
        id: mockAccount.id,
    }

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    describe('#process', (): void => {
        it('deletes an account record in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.DeleteAccount)
            const deletedAccount = await subject.execute(mockValidDeleteAccountParameters)
            validateAccount(deletedAccount)
        })

        it('fails when an account record with an id property equal to the id parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.DeleteAccount)
            try {
                await accountDataSource.truncate()
                await subject.execute(mockValidDeleteAccountParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'NoDataFoundError')
                expect(error).toHaveProperty('message', 'Account record does not exist')
                return
            }
            throw new Error('fail')
        })
    })
})
