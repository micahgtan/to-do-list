import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import DeleteAccount from '.'

describe('DeleteAccount', (): void => {
    const mockAccountDataSource = {
        get: jest.fn(),
        delete: jest.fn(),
    }
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccounts: IAccount[] = [Factory.build('service.account_database.record.account.1')]
    const mockDeleteAccountParameterParameters = {
        id: mockAccount.id,
    }
    const mockDeleteAccountResponse = Factory.build('service.account_database.record.account.1')
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new DeleteAccount(mockAccountDataSource)

    beforeEach((): void => {
        mockAccountDataSource.get.mockResolvedValue(mockAccounts)
        mockAccountDataSource.delete.mockResolvedValue(mockAccount)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the DeleteAccount function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const deletedAccount = await subject.execute(mockDeleteAccountParameterParameters)
            expect(deletedAccount).toEqual(mockDeleteAccountResponse)
        })

        describe('when AccountDataSource is called', (): void => {
            it('calls the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteAccountParameterParameters)
                expect(mockAccountDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteAccountParameterParameters)
                const getParameterParameters = mockAccountDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockAccountDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('id')
                expect(getParameterOptions).toHaveProperty('transaction')
            })

            it('calls the AccountDataSource#delete function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteAccountParameterParameters)
                expect(mockAccountDataSource.delete).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#delete function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteAccountParameterParameters)
                const deleteParameterParameters = mockAccountDataSource.delete.mock.calls[0][0]
                const deleteParameterOptions = mockAccountDataSource.delete.mock.calls[0][1]
                expect(deleteParameterParameters).toHaveProperty('id')
                expect(deleteParameterOptions).toHaveProperty('transaction')
            })
        })
    })
})
