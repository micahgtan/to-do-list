import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/update-account/parameters'
import type { IResponse } from '@features/update-account/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request,
    Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

export default async (req: Request, res: Response): Promise<Response> => {
    const updateAccount: IExecutable<IParameters, IResponse> = container.get(Types.UpdateAccount)
    const {
        params,
        body,
    } = req
    const {
        id,
    } = params
    const parameters: IParameters = {
        id,
        ...body,
    }
    try {
        const updatedAccount = await updateAccount.execute(parameters)
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: updatedAccount,
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: 'failed',
            data: error,
        })
    }
}
