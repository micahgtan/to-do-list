import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/create-session/parameters'
import type { IResponse } from '@features/create-session/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request,
    Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

export default async (req: Request, res: Response): Promise<Response> => {
    const createSession: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
    const parameters: IParameters = req.body
    try {
        const createdSession = await createSession.execute(parameters)
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: createdSession,
        })
    } catch (error) {
        return res.status(StatusCodes.OK).json({
            status: 'failed',
            data: error,
        })
    }
}
