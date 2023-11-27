import { injectable } from 'inversify'
import { snakeCase } from 'lodash'
import type { IValidationError } from './interface'
import type { IExecutable } from '@interfaces/executable'
import type Joi from 'joi'
import type {
    Schema,
    ValidationErrorItem,
    ValidationResult,
} from 'joi'
import ObjectUtility from '@utils/object'
import SystemError from '@utils/system-error'

@injectable()
export default abstract class AbstractFeature<IParameters, IResponse> implements IExecutable<IParameters, IResponse> {
    protected schema: Schema

    constructor(
        schema: Schema,
    ) {
        this.schema = schema
    }

    protected sanitize(parameters: IParameters): IParameters {
        return parameters
    }

    protected validate(parameters: IParameters): void {
        const errors = AbstractFeature.joiValidate(parameters, this.schema)
        if (errors.length) throw new SystemError({
            code: 'ValidationError',
            message: 'Validation error',
            details: errors,
        })
    }

    static joiValidate(parameters: unknown, schema: Schema): IValidationError[] {
        const validateOptions = {
            abort_early: false,
        }
        const formattedValidateOptions: Joi.ValidationOptions = ObjectUtility.changeCaseStyle(validateOptions, (key: string): string => snakeCase(key))
        const validationResult: ValidationResult = schema.validate(parameters, formattedValidateOptions)
        return validationResult.error
            ? validationResult.error.details.map((detail: ValidationErrorItem): IValidationError => {
                return {
                    message: detail.message,
                    key: detail.context?.key,
                }
            })
            : []
    }

    protected abstract process(parameters: IParameters): IResponse

    public execute(parameters: IParameters): IResponse {
        this.validate(parameters)
        const sanitizedParameters = this.sanitize(parameters)
        return this.process(sanitizedParameters)
    }
}
