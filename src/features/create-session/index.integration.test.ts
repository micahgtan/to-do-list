import bcrypt from 'bcrypt'
import config from 'config'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import type { IEncryptionService } from '@services/encryption/interface'
import container from '@src/index'
import Types from '@src/types'

const JWT_SECRET: string = config.get('app.jwt.secret')
const BCRYPT_SALT_ROUNDS: number = config.get('app.bcrypt.salt_rounds')

describe('CreateSession', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const encryptionService: IEncryptionService = container.get(Types.EncryptionService)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockValidCreateSessionParameters = {
        username: mockAccount.username,
        password: mockAccount.password,
    }

    beforeEach(async (): Promise<void> => {
        const {
            password,
        } = mockAccount
        const generatedSalt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, generatedSalt)
        await accountDataSource.create({
            ...mockAccount,
            password: hashedPassword,
        })
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    describe('#process', (): void => {
        it('returns a jwt authentication response', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
            const response = await subject.execute(mockValidCreateSessionParameters)
            expect(response).toHaveProperty('access_token')
            expect(response).toHaveProperty('access_token_expires_in')
            expect(response).toHaveProperty('refresh_token')
            expect(response).toHaveProperty('refresh_token_expires_in')
            expect(response).toHaveProperty('token_type')
        })

        it('returns a signed access_token', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
            const response = await subject.execute(mockValidCreateSessionParameters)
            const {
                access_token,
            } = response
            const verifiedJwt = encryptionService.verify({
                token: access_token,
                key: JWT_SECRET,
            })
            expect(verifiedJwt).toHaveProperty('username')
            expect(verifiedJwt).toHaveProperty('iat')
            expect(verifiedJwt).toHaveProperty('exp')
        })

        it('returns an access_token that expires in 2 hours', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
            const response = await subject.execute(mockValidCreateSessionParameters)
            const {
                access_token,
            } = response
            const verifiedJwt = encryptionService.verify({
                token: access_token,
                key: JWT_SECRET,
            })
            const parsedVerifiedJwt = JSON.parse(JSON.stringify(verifiedJwt))
            const {
                iat,
                exp,
            }: {
                iat: number,
                exp: number,
            } = parsedVerifiedJwt
            const createdAt = DateTime.fromSeconds(iat)
            const expiresIn = DateTime.fromSeconds(exp)
            const differenceInHours = expiresIn.diff(createdAt, 'hours').hours
            expect(differenceInHours).toBe(Number('2'))
        })

        it('returns a refresh_token that expires in 2 days', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
            const response = await subject.execute(mockValidCreateSessionParameters)
            const {
                refresh_token,
            } = response
            const verifiedJwt = encryptionService.verify({
                token: refresh_token,
                key: JWT_SECRET,
            })
            const parsedVerifiedJwt = JSON.parse(JSON.stringify(verifiedJwt))
            const {
                iat,
                exp,
            }: {
                iat: number,
                exp: number,
            } = parsedVerifiedJwt
            const createdAt = DateTime.fromSeconds(iat)
            const expiresIn = DateTime.fromSeconds(exp)
            const differenceInDays = expiresIn.diff(createdAt, 'days').days
            expect(differenceInDays).toBe(Number('2'))
        })

        Object.keys(mockValidCreateSessionParameters).forEach((key: string): void => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockInvalidCreateSessionParameters: any = _.omit(mockValidCreateSessionParameters, [key])

            it(`fails when the ${key} parameter is missing`, async (): Promise<void> => {
                const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    await subject.execute(mockInvalidCreateSessionParameters)
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

        it('fails when an account record with a username property equal to the username parameter does not exist in the database', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
            try {
                await accountDataSource.truncate()
                await subject.execute(mockValidCreateSessionParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'AuthenticationError')
                expect(error).toHaveProperty('details')
                return
            }
            throw new Error('fail')
        })

        it('fails when an account record with a username property equal to the username parameter already exists in the database but the password property of the account record is not equal to the password parameter', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
            const mockInvalidCreateSessionParameters = {
                ...mockValidCreateSessionParameters,
                password: 'password-2',
            }
            try {
                await subject.execute(mockInvalidCreateSessionParameters)
            } catch (error) {
                expect(error).toHaveProperty('code', 'AuthenticationError')
                expect(error).toHaveProperty('details')
                return
            }
            throw new Error('fail')
        })
    })
})
