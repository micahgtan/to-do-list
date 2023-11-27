import _ from 'lodash'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import { CONTACT_NUMBER_LENGTH } from '@constants/account'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'

describe('CreateAccount', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount1: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccount2: IAccount = Factory.build('service.account_database.record.account.2')
    const mockValidCreateAccountParameters = _.omit(mockAccount1, ['id', 'created_at', 'updated_at'])

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    describe('#process', (): void => {
        it('creates an account record in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
            const createdAccount = await subject.execute(mockValidCreateAccountParameters)
            validateAccount(createdAccount)
        })

        Object.keys(mockValidCreateAccountParameters).forEach((key: string): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockInvalidCreateAccountParameters: any = _.omit(mockValidCreateAccountParameters, [key])

            it(`fails when the ${key} parameter is missing`, async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    await subject.execute(mockInvalidCreateAccountParameters)
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

        it(`fails when the length of the contact_number parameter is not ${CONTACT_NUMBER_LENGTH} characters long`, async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
            const mockInvalidCreateAccountParameters = {
                ...mockValidCreateAccountParameters,
                contact_number: '0123456789',
            }
            try {
                await subject.execute(mockInvalidCreateAccountParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'ValidationError')
                expect(error).toHaveProperty('details')
                expect(error.details[0]).toHaveProperty('message', `"contact_number" length must be ${CONTACT_NUMBER_LENGTH} characters long`)
                expect(error.details[0]).toHaveProperty('key', 'contact_number')
                return
            }
            throw new Error('fail')
        })

        it('fails when the email_address parameter is not a valid email_address', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
            const mockInvalidCreateAccountParameters = {
                ...mockValidCreateAccountParameters,
                email_address: 'david.uy.com',
            }
            try {
                await subject.execute(mockInvalidCreateAccountParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'ValidationError')
                expect(error).toHaveProperty('details')
                expect(error.details[0]).toHaveProperty('message', '"email_address" must be a valid email')
                expect(error.details[0]).toHaveProperty('key', 'email_address')
                return
            }
            throw new Error('fail')
        })

        it('fails when an account record with an email_address property equal to the email_address parameter already exists in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
            const mockInvalidCreateAccountParameters = {
                ...mockValidCreateAccountParameters,
                username: mockAccount2.username,
            }
            try {
                await subject.execute(mockValidCreateAccountParameters)
                await subject.execute(mockInvalidCreateAccountParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'UniqueConstraintError')
                expect(error).toHaveProperty('details')
                return
            }
            throw new Error('fail')
        })

        it('fails when an account record with a username property equal to the username parameter already exists in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
            const mockInvalidCreateAccountParameters = {
                ...mockValidCreateAccountParameters,
                email_address: mockAccount2.email_address,
            }
            try {
                await subject.execute(mockValidCreateAccountParameters)
                await subject.execute(mockInvalidCreateAccountParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'UniqueConstraintError')
                expect(error).toHaveProperty('details')
                return
            }
            throw new Error('fail')
        })
    })
})
