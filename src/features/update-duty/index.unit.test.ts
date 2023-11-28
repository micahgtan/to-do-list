import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type {
    IAccount,
    IDuty,
} from '@interfaces/models'
import UpdateDuty from '.'

describe('UpdateDuty', (): void => {
    const mockAccountDataSource = {
        get: jest.fn(),
    }
    const mockDutyDataSource = {
        get: jest.fn(),
        update: jest.fn(),
    }
    const mockAccounts: IAccount[] = [Factory.build('service.account_database.record.account.1')]
    const mockDuty: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockDuties: IDuty[] = [Factory.build('service.duty_database.record.duty.1')]
    const mockUpdateDutyParameterParameters = {
        id: mockDuty.id,
        name: 'updated_name',
    }
    const mockUpdateDutyResponse = {
        ...mockDuty,
        name: 'updated_name',
    }
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new UpdateDuty(mockAccountDataSource, mockDutyDataSource)

    beforeEach((): void => {
        mockAccountDataSource.get.mockResolvedValue(mockAccounts)
        mockDutyDataSource.get.mockResolvedValue(mockDuties)
        mockDutyDataSource.update.mockResolvedValue(mockUpdateDutyResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the UpdateDuty function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const updatedDuty = await subject.execute(mockUpdateDutyParameterParameters)
            expect(updatedDuty).toEqual(mockUpdateDutyResponse)
        })

        describe('when AccountDataSource is called', (): void => {
            it('calls the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateDutyParameterParameters)
                expect(mockAccountDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateDutyParameterParameters)
                const getParameterParameters = mockAccountDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockAccountDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('id')
                expect(getParameterOptions).toHaveProperty('transaction')
            })
        })

        describe('when DutyDataSource is called', (): void => {
            it('calls the DutyDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateDutyParameterParameters)
                expect(mockDutyDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the DutyDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateDutyParameterParameters)
                const getParameterParameters = mockDutyDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockDutyDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('id')
                expect(getParameterOptions).toHaveProperty('transaction')
            })

            it('calls the DutyDataSource#update function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateDutyParameterParameters)
                expect(mockDutyDataSource.update).toHaveBeenCalled()
            })

            it('passes the correct parameters to the DutyDataSource#update function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockUpdateDutyParameterParameters)
                const updateParameterParameters = mockDutyDataSource.update.mock.calls[0][0]
                const updateParameterQueryParameters = mockDutyDataSource.update.mock.calls[0][1]
                const updateParameterOptions = mockDutyDataSource.update.mock.calls[0][2]
                expect(updateParameterParameters).toHaveProperty('id')
                expect(updateParameterParameters).toHaveProperty('name')
                expect(updateParameterQueryParameters).toHaveProperty('id')
                expect(updateParameterOptions).toHaveProperty('transaction')
                expect(updateParameterOptions).toHaveProperty('for_update')
            })
        })
    })
})
