import _ from 'lodash'
import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import CreateAccount from '.'

describe('CreateAccount', (): void => {
    const mockAccountDataSource = {
        create: jest.fn(),
        get: jest.fn(),
    }
    const mockHashService = {
        hash: jest.fn(),
    }
    const mockIdService = {
        generate: jest.fn(),
    }
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccounts: IAccount[] = []
    const mockHashServiceHashResponse = 'hashed_password'
    const mockIdServiceGenerateResponse = 'generated_id'
    const mockCreateAccountParameterParameters = _.omit(mockAccount, ['id', 'created_at', 'updated_at'])
    const mockCreateAccountResponse = Factory.build('service.account_database.record.account.1')
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new CreateAccount(mockAccountDataSource, mockHashService, mockIdService)

    beforeEach((): void => {
        mockAccountDataSource.create.mockResolvedValue(mockAccount)
        mockAccountDataSource.get.mockResolvedValue(mockAccounts)
        mockHashService.hash.mockResolvedValue(mockHashServiceHashResponse)
        mockIdService.generate.mockReturnValue(mockIdServiceGenerateResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the CreateAccount function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const createdAccount = await subject.execute(mockCreateAccountParameterParameters)
            expect(createdAccount).toEqual(mockCreateAccountResponse)
        })

        describe('when AccountDataSource is called', (): void => {
            it('calls the AccountDataSource#create function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateAccountParameterParameters)
                expect(mockAccountDataSource.create).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#create function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateAccountParameterParameters)
                const createParameterParameters = mockAccountDataSource.create.mock.calls[0][0]
                expect(createParameterParameters).toHaveProperty('id')
                expect(createParameterParameters).toHaveProperty('first_name')
                expect(createParameterParameters).toHaveProperty('middle_name')
                expect(createParameterParameters).toHaveProperty('last_name')
                expect(createParameterParameters).toHaveProperty('contact_number')
                expect(createParameterParameters).toHaveProperty('email_address')
                expect(createParameterParameters).toHaveProperty('username')
                expect(createParameterParameters).toHaveProperty('password')
            })

            it('fails when the AccountDataSource#create function throws a unique constraint error', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                const mockError = {
                    code: 'UniqueConstraintError',
                    message: 'Account record already exists',
                }
                mockAccountDataSource.create.mockRejectedValue(mockError)
                try {
                    await subject.execute(mockCreateAccountParameterParameters)
                } catch (error) {
                    const {
                        code,
                        message,
                    } = mockError
                    expect(error).toHaveProperty('code', code)
                    expect(error).toHaveProperty('message', message)
                    return
                }
                throw new Error('fail')
            })

            it('calls the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateAccountParameterParameters)
                expect(mockAccountDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateAccountParameterParameters)
                const getParameterParameters = mockAccountDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockAccountDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('email_address')
                expect(getParameterParameters).toHaveProperty('username')
                expect(getParameterOptions).toHaveProperty('transaction')
            })
        })

        describe('when HashService is called', (): void => {
            it('calls the HashService#hash function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateAccountParameterParameters)
                expect(mockHashService.hash).toHaveBeenCalled()
            })

            it('passes the correct parameters to the HashService#hash function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateAccountParameterParameters)
                const hashParameterParameters = mockHashService.hash.mock.calls[0][0]
                expect(hashParameterParameters).toHaveProperty('data')
                expect(hashParameterParameters).toHaveProperty('salt_rounds')
            })
        })

        describe('when IdService is called', (): void => {
            it('calls the IdService#generate function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateAccountParameterParameters)
                expect(mockIdService.generate).toHaveBeenCalled()
            })
        })
    })
})
