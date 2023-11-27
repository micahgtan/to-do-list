import { StatusCodes } from 'http-status-codes'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type {
    Request,
    Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

export default async (req: Request, res: Response): Promise<Response> => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const parameters = req.query
    try {
        const accounts = await accountDataSource.get(parameters)
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: accounts,
        })
    } catch (error) {
        return res.status(StatusCodes.OK).json({
            status: 'failed',
            data: error,
        })
    }
}
