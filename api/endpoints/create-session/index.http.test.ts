import bcrypt from 'bcrypt'
import config from 'config'
import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import request from 'supertest'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import app from '../..'

const URL = '/session'

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
    const mockInvalidCreateSessionParameters = {
        username: mockAccount2.username,
        password: mockAccount2.password,
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
    })

    it('returns a success response if the parameters are valid', async (): Promise<void> => {
        const response = await request(app)
            .post(URL)
            .send(mockValidCreateSessionParameters)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        expect(body).toHaveProperty('status', 'success')
        expect(body).toHaveProperty('data')
        expect(body.data).toHaveProperty('access_token')
        expect(body.data).toHaveProperty('access_token_expires_in', JWT_ACCESS_TOKEN_EXPIRES_IN)
        expect(body.data).toHaveProperty('refresh_token')
        expect(body.data).toHaveProperty('refresh_token_expires_in', JWT_REFRESH_TOKEN_EXPIRES_IN)
        expect(body.data).toHaveProperty('token_type', 'Bearer')
    })

    it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
        const response = await request(app)
            .post(URL)
            .send(mockInvalidCreateSessionParameters)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        expect(body).toHaveProperty('status', 'failed')
        expect(body).toHaveProperty('data')
        expect(body.data).toHaveProperty('code', 'AuthenticationError')
    })
})
