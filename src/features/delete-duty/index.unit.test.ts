import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type {
    IAccount,
    IDuty,
} from '@interfaces/models'
import DeleteDuty from '.'

describe('DeleteDuty', (): void => {
    const mockAccountDataSource = {
        get: jest.fn(),
    }
    const mockDutyDataSource = {
        get: jest.fn(),
        delete: jest.fn(),
    }
    const mockAccounts: IAccount[] = [Factory.build('service.account_database.record.account.1')]
    const mockDuty: IDuty = Factory.build('service.duty_database.record.duty.1')
    const mockDuties: IDuty[] = [Factory.build('service.duty_database.record.duty.1')]
    const mockDeleteDutyParameterParameters = {
        id: mockDuty.id,
    }
    const mockDeleteDutyResponse = Factory.build('service.duty_database.record.duty.1')
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new DeleteDuty(mockAccountDataSource, mockDutyDataSource)

    beforeEach((): void => {
        mockAccountDataSource.get.mockResolvedValue(mockAccounts)
        mockDutyDataSource.get.mockResolvedValue(mockDuties)
        mockDutyDataSource.delete.mockResolvedValue(mockDeleteDutyResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the DeleteDuty function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const deletedDuty = await subject.execute(mockDeleteDutyParameterParameters)
            expect(deletedDuty).toEqual(mockDeleteDutyResponse)
        })

        describe('when AccountDataSource is called', (): void => {
            it('calls the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteDutyParameterParameters)
                expect(mockAccountDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the AccountDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteDutyParameterParameters)
                const getParameterParameters = mockAccountDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockAccountDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('id')
                expect(getParameterOptions).toHaveProperty('transaction')
            })
        })

        describe('when DutyDataSource is called', (): void => {
            it('calls the DutyDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteDutyParameterParameters)
                expect(mockDutyDataSource.get).toHaveBeenCalled()
            })

            it('passes the correct parameters to the DutyDataSource#get function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteDutyParameterParameters)
                const getParameterParameters = mockDutyDataSource.get.mock.calls[0][0]
                const getParameterOptions = mockDutyDataSource.get.mock.calls[0][1]
                expect(getParameterParameters).toHaveProperty('id')
                expect(getParameterOptions).toHaveProperty('transaction')
            })

            it('calls the DutyDataSource#delete function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteDutyParameterParameters)
                expect(mockDutyDataSource.delete).toHaveBeenCalled()
            })

            it('passes the correct parameters to the DutyDataSource#delete function', async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = getInstance()
                await subject.execute(mockDeleteDutyParameterParameters)
                const deleteParameterParameters = mockDutyDataSource.delete.mock.calls[0][0]
                const deleteParameterOptions = mockDutyDataSource.delete.mock.calls[0][1]
                expect(deleteParameterParameters).toHaveProperty('id')
                expect(deleteParameterOptions).toHaveProperty('transaction')
            })
        })
    })
})
