import _ from 'lodash'
import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type {
    IAccount,
    IDuty,
} from '@interfaces/models'
import CreateDuty from '.'

describe('CreateDuty', (): void => {
    const mockAccountDataSource = {
        get: jest.fn(),
    }
    const mockIdService = {
        generate: jest.fn(),
    }
    const mockDutyDataSource = {
        create: jest.fn(),
        get: jest.fn(),
    }
    const mockAccounts: IAccount[] = [Factory.build('service.account_database.record.account.1')]
    const mockDuty: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockDuties: IDuty[] = []
    const mockIdServiceGenerateResponse = 'generated_id'
    const mockCreateDutyParameters = _.omit(mockDuty, ['id', 'created_at', 'updated_at'])
    const mockCreateDutyResponse = Factory.build('service.duty_database.record.duty.1')
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new CreateDuty(mockAccountDataSource, mockIdService, mockDutyDataSource)

    beforeEach((): void => {
        mockAccountDataSource.get.mockResolvedValue(mockAccounts)
        mockIdService.generate.mockReturnValue(mockIdServiceGenerateResponse)
        mockDutyDataSource.create.mockResolvedValue(mockCreateDutyResponse)
        mockDutyDataSource.get.mockResolvedValue(mockDuties)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the CreateDuty function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const createdDuty = await subject.execute(mockCreateDutyParameters)
            expect(createdDuty).toEqual(mockCreateDutyResponse)
        })

        describe('when AccountDataSource is called', (): void => {
            it('calls the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateDutyParameters)
                expect(mockAccountDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateDutyParameters)
                const getParameterParameters = mockAccountDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockAccountDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('id')
                expect(getParameterOptions).toHaveProperty('transaction')
            })
        })

        describe('when IdService is called', (): void => {
            it('calls the IdService#generate function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateDutyParameters)
                expect(mockIdService.generate).toHaveBeenCalled()
            })
        })

        describe('when DutyDataSource is called', (): void => {
            it('calls the DutyDataSource#create function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateDutyParameters)
                expect(mockDutyDataSource.create).toHaveBeenCalled()
            })

            it('passes the correct parameters to the DutyDataSource#create function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateDutyParameters)
                const createParameterParameters = mockDutyDataSource.create.mock.calls[0][0]
                expect(createParameterParameters).toHaveProperty('id')
                expect(createParameterParameters).toHaveProperty('account_id')
                expect(createParameterParameters).toHaveProperty('name')
            })

            it('fails when the DutyDataSource#create function throws a unique constraint error', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                const mockError = {
                    code: 'UniqueConstraintError',
                    message: 'Duty record already exists',
                }
                mockDutyDataSource.create.mockRejectedValue(mockError)
                try {
                    await subject.execute(mockCreateDutyParameters)
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

            it('calls the DutyDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateDutyParameters)
                expect(mockDutyDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the DutyDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockCreateDutyParameters)
                const getParameterParameters = mockDutyDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockDutyDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('name')
                expect(getParameterOptions).toHaveProperty('transaction')
            })
        })
    })
})
