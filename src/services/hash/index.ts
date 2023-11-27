import bcrypt from 'bcrypt'
import { injectable } from 'inversify'
import type {
    IHashServiceHashParameters,
    IHashServiceCompareParameters,
    IHashService,
} from './interface'

@injectable()
export default class HashService implements IHashService {
    hash(parameters: IHashServiceHashParameters): Promise<string> {
        const {
            data,
            salt_rounds,
        } = parameters
        return bcrypt.hash(data, salt_rounds)
    }

    compare(parameters: IHashServiceCompareParameters): Promise<boolean> {
        const {
            data,
            hash,
        } = parameters
        return bcrypt.compare(data, hash)
    }
}
