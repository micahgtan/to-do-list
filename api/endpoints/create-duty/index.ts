import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/create-account/parameters'
import type { IResponse } from '@features/create-account/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request,
    Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

export default async (req: Request, res: Response): Promise<Response> => {
    const createDuty: IExecutable<IParameters, IResponse> = container.get(Types.CreateDuty)
    const parameters: IParameters = req.body
    try {
        const createdDuty = await createDuty.execute(parameters)
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: createdDuty,
        })
    } catch (error) {
        return res.status(StatusCodes.OK).json({
            status: 'failed',
            data: error,
        })
    }
}
