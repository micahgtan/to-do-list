import { snakeCase } from 'lodash'
import ObjectUtility from '.'

describe('ObjectUtility', (): void => {
    describe('#changeCaseStyle', (): void => {
        const mockParameters1 = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            firstName: 'First',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            lastName: 'Last',
            email: 'email@gmail.com',
        }
        const mockChangeCaseFunction = (key: string): string => snakeCase(key)

        it('changes the object key case style to the response of the changeCaseFunction', (): void => {
            const response = ObjectUtility.changeCaseStyle(mockParameters1, (key: string): string => snakeCase(key))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const actualKeys = Object.keys(response).join('')
            const expectedKeys = Object.keys(mockParameters1).map((key: string): string => mockChangeCaseFunction(key))
                .join('')
            expect(actualKeys).toEqual(expectedKeys)
        })

        it('handles nested objects', (): void => {
            const mockParameters2 = {
                ...mockParameters1,
                address: {
                    city: 'Makati',
                    street: 'Mayflower',
                },
            }
            const response = ObjectUtility.changeCaseStyle(mockParameters2, mockChangeCaseFunction)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const actualKeys = Object.keys(response[mockChangeCaseFunction('address')]).join('')
            const expectedKeys = Object.keys(mockParameters2.address).map((key: string): string => mockChangeCaseFunction(key))
                .join('')
            expect(actualKeys).toEqual(expectedKeys)
        })
    })
})
