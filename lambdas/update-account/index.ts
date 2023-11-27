import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type {
    IEvent,
    IBodyParameters,
} from './interface'
import type { IHttpResponse } from '../interface'
import type { IParameters } from '@features/update-account/parameters'
import type { IResponse } from '@features/update-account/response'
import type { IExecutable } from '@interfaces/executable'
import type { IAccount } from '@interfaces/models'
import type { Knex } from 'knex'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHttpResponse> => {
    const updateAccount: IExecutable<IParameters, IResponse> = container.get(Types.UpdateAccount)
    const knex: Knex = container.get(Types.Knex)
    const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        pathParameters,
        body,
    } = event
    const bodyParameters: IBodyParameters = JSON.parse(body)
    const {
        ...rest
    } = bodyParameters
    const transaction: Knex.Transaction = await knex.transaction()
    try {
        const response: IAccount = await updateAccount.execute({
            id: pathParameters.id,
            ...rest,
        })
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
