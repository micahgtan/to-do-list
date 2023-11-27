import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type { IEvent } from './interface'
import type { IHttpResponse } from '../interface'
import type { IParameters } from '@features/create-session/parameters'
import type { IResponse } from '@features/create-session/response'
import type { IExecutable } from '@interfaces/executable'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHttpResponse> => {
    const createSession: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
    const {
        body,
    } = event
    const bodyParameters: IParameters = JSON.parse(body)
    try {
        const response = await createSession.execute(bodyParameters)
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
