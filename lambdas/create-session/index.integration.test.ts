import bcrypt from 'bcrypt'
import config from 'config'
import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { handler } from '.'

const BCRYPT_SALT_ROUNDS: number = config.get('app.bcrypt.salt_rounds')
const JWT_ACCESS_TOKEN_EXPIRES_IN: string = config.get('app.jwt.access_token_expires_in')
const JWT_REFRESH_TOKEN_EXPIRES_IN: string = config.get('app.jwt.refresh_token_expires_in')

describe('CreateSessionEndpoint', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const mockAccount1: IAccount = Factory.build('service.account_database.record.account.1')
    const mockAccount2: IAccount = Factory.build('service.account_database.record.account.2')
    const mockValidCreateSessionParameters = {
        username: mockAccount1.username,
        password: mockAccount1.password,
    }
    const mockValidEvent = {
        body: JSON.stringify(mockValidCreateSessionParameters),
    }
    const mockInvalidCreateSessionParameters = {
        username: mockAccount2.username,
        password: mockAccount2.password,
    }
    const mockInvalidEvent = {
        body: JSON.stringify(mockInvalidCreateSessionParameters),
    }

    beforeEach(async (): Promise<void> => {
        const {
            password,
        } = mockAccount1
        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, salt)
        await accountDataSource.create({
            ...mockAccount1,
            password: hashedPassword,
        })
    })

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
        jest.resetAllMocks()
    })

    describe('#handler', (): void => {
        it('returns a success response if the parameters are valid', async (): Promise<void> => {
            const response = await handler(mockValidEvent)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            expect(response).toHaveProperty('status_code', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'success')
            expect(parsedBody).toHaveProperty('data')
            expect(parsedBody.data).toHaveProperty('access_token')
            expect(parsedBody.data).toHaveProperty('access_token_expires_in', JWT_ACCESS_TOKEN_EXPIRES_IN)
            expect(parsedBody.data).toHaveProperty('refresh_token')
            expect(parsedBody.data).toHaveProperty('refresh_token_expires_in', JWT_REFRESH_TOKEN_EXPIRES_IN)
            expect(parsedBody.data).toHaveProperty('token_type', 'Bearer')
        })

        it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
            const response = await handler(mockInvalidEvent)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            expect(response).toHaveProperty('status_code', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'failed')
            expect(parsedBody).toHaveProperty('error')
            expect(parsedBody.error).toHaveProperty('code', 'AuthenticationError')
            expect(parsedBody.error).toHaveProperty('message', 'Invalid username or password')
        })
    })
})
