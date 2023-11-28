import config from 'config'
import {
    inject,
    injectable,
} from 'inversify'
import type { IOptions } from '@features/interface'
import type {
    IGetDutyParameters,
    IQueryDutyParameters,
    IDeleteDutyParameters,
    IDutyDataSource,
} from '@interfaces/data-sources'
import type { IDuty } from '@interfaces/models'
import type { Knex } from 'knex'
import Types from '@src/types'
import SystemError from '@utils/system-error'

const ACCOUNTS_TABLE: string = config.get('database.tables.accounts')
const DUTIES_TABLE: string = config.get('database.tables.duties')
const UNIQUE_ERROR_CODE: string = config.get('database.postgres_errors.unique')
const NO_DATA_FOUND_ERROR_CODE: string = config.get('database.postgres_errors.no_data_found')

@injectable()
export default class DutyDatabase implements IDutyDataSource {
    @inject(Types.Knex) private readonly knex!: Knex

    async create(parameters: Partial<IDuty>, options?: IOptions): Promise<IDuty> {
        const {
            transaction,
        } = {
            ...options,
        }
        const queryBuilder = this.knex(DUTIES_TABLE)
        try {
            if (transaction) await queryBuilder.transacting(transaction)
            const [duty]: IDuty[] = await queryBuilder.insert(parameters).returning('*')
            const {
                created_at,
                updated_at,
            } = duty
            return {
                ...duty,
                created_at: new Date(created_at).toISOString(),
                updated_at: new Date(updated_at).toISOString(),
            }
        } catch (error) {
            const {
                code,
                detail,
            } = error
            switch (code) {
                case UNIQUE_ERROR_CODE:
                    throw new SystemError({
                        code: 'UniqueConstraintError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new SystemError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    async get(parameters?: IGetDutyParameters, options?: IOptions): Promise<IDuty[]> {
        const {
            id,
            account_id,
            name,
        } = {
            ...parameters,
        }
        const {
            transaction,
            include,
        } = {
            ...options,
        }
        const {
            account,
        } = {
            ...include,
        }
        const queryBuilder = this.knex(DUTIES_TABLE)
        try {
            if (transaction) await queryBuilder.transacting(transaction)
            if (account) queryBuilder.join(ACCOUNTS_TABLE, `${ACCOUNTS_TABLE}.id`, `${DUTIES_TABLE}.account_id`).select(this.knex.raw(`to_json(${ACCOUNTS_TABLE}.*) AS account`))
            const duties: IDuty[] = await queryBuilder.where((builder: Knex.QueryBuilder): void => {
                if (id) builder.where(`${DUTIES_TABLE}.id`, id)
                if (account_id) builder.where(`${DUTIES_TABLE}.account_id`, account_id)
                if (name) builder.where(`${DUTIES_TABLE}.name`, name)
            })
                .select(`${DUTIES_TABLE}.*`)
            return duties.map((duty: IDuty): IDuty => {
                const {
                    created_at,
                    updated_at,
                } = duty
                return {
                    ...duty,
                    created_at: new Date(created_at).toISOString(),
                    updated_at: new Date(updated_at).toISOString(),
                }
            })
        } catch (error) {
            const {
                code,
                detail,
            } = error
            switch (code) {
                case NO_DATA_FOUND_ERROR_CODE:
                    throw new SystemError({
                        code: 'NoDataFoundError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new SystemError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    async update(parameters: Partial<IDuty>, queryParameters: IQueryDutyParameters, options?: IOptions): Promise<IDuty> {
        const {
            id,
        } = queryParameters
        const {
            transaction,
            for_update,
        } = {
            ...options,
        }
        const queryBuilder = this.knex(DUTIES_TABLE)
        try {
            if (transaction) {
                await queryBuilder.transacting(transaction)
                if (for_update) await queryBuilder.forUpdate()
            }
            const [duty]: IDuty[] = await queryBuilder.where((builder: Knex.QueryBuilder): void => {
                if (id) builder.where(`${DUTIES_TABLE}.id`, id)
            })
                .update({
                    ...parameters,
                    updated_at: new Date().toISOString(),
                })
                .returning('*')
            const {
                created_at,
                updated_at,
            } = duty
            return {
                ...duty,
                created_at: new Date(created_at).toISOString(),
                updated_at: new Date(updated_at).toISOString(),
            }
        } catch (error) {
            const {
                code,
                detail,
            } = error
            switch (code) {
                case UNIQUE_ERROR_CODE:
                    throw new SystemError({
                        code: 'UniqueConstraintError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new SystemError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    async delete(parameters?: IDeleteDutyParameters, options?: IOptions): Promise<IDuty> {
        const {
            id,
        } = {
            ...parameters,
        }
        const {
            transaction,
        } = {
            ...options,
        }
        const queryBuilder = this.knex(DUTIES_TABLE)
        try {
            if (transaction) await queryBuilder.transacting(transaction)
            const [duty]: IDuty[] = await queryBuilder.where((builder: Knex.QueryBuilder): void => {
                if (id) builder.where(`${DUTIES_TABLE}.id`, id)
            })
                .delete()
                .returning('*')
            return duty
        } catch (error) {
            const {
                code,
                detail,
            } = error
            switch (code) {
                case NO_DATA_FOUND_ERROR_CODE:
                    throw new SystemError({
                        code: 'NoDataFoundError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new SystemError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    truncate(): Promise<void> {
        return this.knex.raw(`truncate ${DUTIES_TABLE} cascade;`)
    }
}
