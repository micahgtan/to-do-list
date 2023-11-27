import bcrypt from 'bcrypt'
import config from 'config'
import { Factory } from 'rosie'
import type {
    IHashServiceHashParameters,
    IHashService,
} from './interface'
import container from '@src/index'
import Types from '@src/types'

const BCRYPT_SALT_ROUNDS: number = config.get('app.bcrypt.salt_rounds')

describe('HashService', (): void => {
    const hashService: IHashService = container.get(Types.HashService)

    describe('#hash', (): void => {
        it('hashes a data', async (): Promise<void> => {
            const hashParameters: IHashServiceHashParameters = Factory.build('service.hash.hash.parameter.parameters')
            const {
                data,
            } = hashParameters
            const hash = await hashService.hash(hashParameters)
            const comparedDataAndHash = await bcrypt.compare(data, hash)
            expect(comparedDataAndHash).toEqual(true)
        })
    })

    describe('#compare', (): void => {
        it('compares a data to its hash', async (): Promise<void> => {
            const data = 'data'
            const hash = await bcrypt.hash(data, BCRYPT_SALT_ROUNDS)
            const compareParameters = {
                data,
                hash,
            }
            const comparedDataAndHash = await hashService.compare(compareParameters)
            expect(comparedDataAndHash).toEqual(true)
        })
    })
})
