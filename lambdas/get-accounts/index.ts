import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type { IEvent } from './interface'
import type { IHttpResponse } from '../interface'
import type { IAccountDataSource } from '@interfaces/data-sources'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHttpResponse> => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const {
        query,
    } = event
    try {
        const response = await accountDataSource.get({
            ...query,
        })
        return {
            status_code: StatusCodes.OK,
            body: JSON.stringify({
                status: 'success',
                data: response,
            }),
        }
    } catch (error) {
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
