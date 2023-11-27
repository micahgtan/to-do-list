import jwt from 'jsonwebtoken'
import { Factory } from 'rosie'
import type {
    IEncryptionServiceSignParameters,
    IEncryptionService,
} from './interface'
import container from '@src/index'
import Types from '@src/types'

describe('EncryptionService', (): void => {
    const encryptionService: IEncryptionService = container.get(Types.EncryptionService)
    const mockSignParameters: IEncryptionServiceSignParameters = Factory.build('service.encryption.sign.parameter.parameters')

    describe('#sign', (): void => {
        it('signs a payload', (): void => {
            const {
                payload,
                key,
            } = mockSignParameters
            const signedPayload = encryptionService.sign(mockSignParameters)
            const verifiedPayload = jwt.verify(signedPayload, key)
            expect(verifiedPayload).toMatchObject(payload)
        })
    })

    describe('#verify', (): void => {
        it('verifies a token', (): void => {
            const {
                payload,
                key,
            } = mockSignParameters
            const signedPayload = jwt.sign(payload, key)
            const mockVerifyParameters = {
                token: signedPayload,
                key,
            }
            const verifiedPayload = encryptionService.verify(mockVerifyParameters)
            expect(verifiedPayload).toMatchObject(payload)
        })
    })
})
