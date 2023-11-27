import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type { IEvent } from './interface'
import type { IHttpResponse } from '../interface'
import type { IParameters } from '@features/create-account/parameters'
import type { IResponse } from '@features/create-account/response'
import type { IExecutable } from '@interfaces/executable'
import type { Knex } from 'knex'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHttpResponse> => {
    const createAccount: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
    const knex: Knex = container.get(Types.Knex)
    const {
        body,
    } = event
    const bodyParameters: IParameters = JSON.parse(body)
    const transaction: Knex.Transaction = await knex.transaction()
    try {
        const response = await createAccount.execute(bodyParameters)
        await transaction.commit()
        return {
            status_code: StatusCodes.OK,
            body: JSON.stringify({
                status: 'success',
                data: response,
            }),
        }
    } catch (error) {
        await transaction.rollback()
        const {
            code,
            message,
            details,
        } = error
        return {
            status_code: StatusCodes.OK,
            body: JSON.stringify({
                status: 'failed',
                error: {
                    code,
                    message,
                    details,
                },
            }),
        }
    }
}

export default handler
