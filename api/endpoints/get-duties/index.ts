import { StatusCodes } from 'http-status-codes'
import type { IDutyDataSource } from '@interfaces/data-sources'
import type {
    Request,
    Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

export default async (req: Request, res: Response): Promise<Response> => {
    const dutyDataSource: IDutyDataSource = container.get(Types.DutyDataSource)
    const parameters = req.query
    try {
        const duties = await dutyDataSource.get(parameters)
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: duties,
        })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: 'failed',
            data: error,
        })
    }
}
