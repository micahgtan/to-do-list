import config from 'config'
import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import CreateSession from '.'

const JWT_ACCESS_TOKEN_EXPIRES_IN: string = config.get('app.jwt.access_token_expires_in')
const JWT_REFRESH_TOKEN_EXPIRES_IN: string = config.get('app.jwt.refresh_token_expires_in')

describe('CreateSession', (): void => {
    const mockAccountDataSource = {
        get: jest.fn(),
    }
    const mockEncryptionService = {
        sign: jest.fn(),
    }
    const mockHashService = {
        compare: jest.fn(),
    }
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccounts: IAccount[] = [Factory.build('service.account_database.record.account.1')]
    const mockEncryptionServiceSignResponse = 'token'
    const mockHashServiceCompareResponse = true
    const mockCreateSessionParameterParameters = {
        username: mockAccount.username,
        password: mockAccount.password,
    }
    const mockCreateSessionResponse = {
        access_token: 'token',
        access_token_expires_in: JWT_ACCESS_TOKEN_EXPIRES_IN,
        refresh_token: 'token',
        refresh_token_expires_in: JWT_REFRESH_TOKEN_EXPIRES_IN,
        token_type: 'Bearer',
    }
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new CreateSession(mockAccountDataSource, mockEncryptionService, mockHashService)

    beforeEach((): void => {
        mockAccountDataSource.get.mockResolvedValue(mockAccounts)
        mockEncryptionService.sign.mockReturnValue(mockEncryptionServiceSignResponse)
        mockHashService.compare.mockResolvedValue(mockHashServiceCompareResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the CreateSession function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const response = await subject.execute(mockCreateSessionParameterParameters)
            expect(response).toEqual(mockCreateSessionResponse)
        })

        describe('when AccountDataSource is called', (): void => {
            it('calls the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateSessionParameterParameters)
                expect(mockAccountDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateSessionParameterParameters)
                const getParameterParameters = mockAccountDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockAccountDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('username')
                expect(getParameterOptions).toHaveProperty('transaction')
            })
        })

        describe('when HashService is called', (): void => {
            it('calls the HashService#compare function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateSessionParameterParameters)
                expect(mockHashService.compare).toHaveBeenCalled()
            })

            it('passes the correct parameters to the HashService#compare function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateSessionParameterParameters)
                const compareParameterParameters = mockHashService.compare.mock.calls[0][0]
                expect(compareParameterParameters).toHaveProperty('data')
                expect(compareParameterParameters).toHaveProperty('hash')
            })
        })

        describe('when Encryption is called', (): void => {
            it('calls the Encryption#sign function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateSessionParameterParameters)
                expect(mockEncryptionService.sign).toHaveBeenCalled()
            })

            it('passes the correct parameters to the Encryption#sign function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateSessionParameterParameters)
                const signParameterParameters = mockEncryptionService.sign.mock.calls[0][0]
                expect(signParameterParameters).toHaveProperty('payload')
                expect(signParameterParameters.payload).toHaveProperty('username')
                expect(signParameterParameters).toHaveProperty('key')
                expect(signParameterParameters).toHaveProperty('expires_in')
            })
        })
    })
})
