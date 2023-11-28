import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/delete-account/parameters'
import type { IResponse } from '@features/delete-account/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request,
    Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

export default async (req: Request, res: Response): Promise<Response> => {
    const deleteDuty: IExecutable<IParameters, IResponse> = container.get(Types.DeleteDuty)
    const {
        params,
    } = req
    const {
        id,
    } = params
    const parameters: IParameters = {
        id,
    }
    try {
        const deletedDuty = await deleteDuty.execute(parameters)
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: deletedDuty,
        })
    } catch (error) {
        return res.status(StatusCodes.OK).json({
            status: 'failed',
            data: error,
        })
    }
}
