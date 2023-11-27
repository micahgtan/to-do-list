import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import app from '../..'

const URL = '/'

describe('GetHealthEndpoint', (): void => {
    it('returns a success response', async (): Promise<void> => {
        const response = await request(app)
            .get(URL)
            .expect(StatusCodes.OK)
        const {
            body,
        } = response
        expect(body).toHaveProperty('status', 'success')
        expect(body).toHaveProperty('data')
    })
})
