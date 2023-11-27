// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ObjectUtility {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    static changeCaseStyle(parameter: any, changeCaseFunction: (key: string) => string): any {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!parameter || typeof parameter !== 'object') return parameter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedObject: any = Array.isArray(parameter) ? [] : {}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.keys(parameter).forEach((key: string): void => {
            const transformedKey = changeCaseFunction(key)
            transformedObject[transformedKey] = typeof parameter[key] === 'object' ? this.changeCaseStyle(parameter[key], changeCaseFunction) : parameter[key]
        })
        return transformedObject
    }
}
