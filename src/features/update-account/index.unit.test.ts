import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import UpdateAccount from '.'

describe('UpdateAccount', (): void => {
    const mockAccountDataSource = {
        get: jest.fn(),
        update: jest.fn(),
    }
    const mockHashService = {
        hash: jest.fn(),
    }
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccounts: IAccount[] = [Factory.build('service.account_database.record.account.1')]
    const mockHashServiceHashResponse = 'hashed_password'
    const mockUpdateAccountParameterParameters = {
        id: mockAccount.id,
        first_name: 'updated_first_name',
        password: 'updated_password',
    }
    const mockUpdateAccountResponse = {
        ...mockAccount,
        first_name: 'updated_first_name',
        password: 'updated_password',
    }
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new UpdateAccount(mockAccountDataSource, mockHashService)

    beforeEach((): void => {
        mockAccountDataSource.get.mockResolvedValue(mockAccounts)
        mockAccountDataSource.update.mockResolvedValue(mockUpdateAccountResponse)
        mockHashService.hash.mockResolvedValue(mockHashServiceHashResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the UpdateAccount function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const updatedAccount = await subject.execute(mockUpdateAccountParameterParameters)
            expect(updatedAccount).toEqual(mockUpdateAccountResponse)
        })

        describe('when AccountDataSource is called', (): void => {
            it('calls the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateAccountParameterParameters)
                expect(mockAccountDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateAccountParameterParameters)
                const getParameterParameters = mockAccountDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockAccountDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('id')
                expect(getParameterOptions).toHaveProperty('transaction')
            })

            it('calls the AccountDataSource#update function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateAccountParameterParameters)
                expect(mockAccountDataSource.update).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#update function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateAccountParameterParameters)
                const updateParameterParameters = mockAccountDataSource.update.mock.calls[0][0]
                const updateParameterQueryParameters = mockAccountDataSource.update.mock.calls[0][1]
                const updateParameterOptions = mockAccountDataSource.update.mock.calls[0][2]
                expect(updateParameterParameters).toHaveProperty('id')
                expect(updateParameterParameters).toHaveProperty('first_name')
                expect(updateParameterParameters).toHaveProperty('password')
                expect(updateParameterQueryParameters).toHaveProperty('id')
                expect(updateParameterOptions).toHaveProperty('transaction')
                expect(updateParameterOptions).toHaveProperty('for_update')
            })
        })

        describe('when HashService is called', (): void => {
            it('calls the HashService#hash function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateAccountParameterParameters)
                expect(mockHashService.hash).toHaveBeenCalled()
            })

            it('passes the correct parameters to the HashService#hash function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateAccountParameterParameters)
                const hashParameterParameters = mockHashService.hash.mock.calls[0][0]
                expect(hashParameterParameters).toHaveProperty('data')
                expect(hashParameterParameters).toHaveProperty('salt_rounds')
            })
        })
    })
})
