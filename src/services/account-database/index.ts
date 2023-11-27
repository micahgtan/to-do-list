import config from 'config'
import {
    inject,
    injectable,
} from 'inversify'
import type { IOptions } from '@features/interface'
import type {
    IGetAccountParameters,
    IQueryAccountParameters,
    IDeleteAccountParameters,
    IAccountDataSource,
} from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import type { Knex } from 'knex'
import Types from '@src/types'
import SystemError from '@utils/system-error'

const ACCOUNTS_TABLE: string = config.get('database.tables.accounts')
const UNIQUE_ERROR_CODE: string = config.get('database.postgres_errors.unique')
const NO_DATA_FOUND_ERROR_CODE: string = config.get('database.postgres_errors.no_data_found')

@injectable()
export default class AccountDatabase implements IAccountDataSource {
    @inject(Types.Knex) private readonly knex!: Knex

    async create(parameters: Partial<IAccount>, options?: IOptions): Promise<IAccount> {
        const {
            transaction,
        } = {
            ...options,
        }
        const queryBuilder = this.knex(ACCOUNTS_TABLE)
        try {
            if (transaction) await queryBuilder.transacting(transaction)
            const [account]: IAccount[] = await queryBuilder.insert(parameters).returning('*')
            const {
                created_at,
                updated_at,
            } = account
            return {
                ...account,
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

    async get(parameters?: IGetAccountParameters, options?: IOptions): Promise<IAccount[]> {
        const {
            id,
            email_address,
            username,
        } = {
            ...parameters,
        }
        const {
            transaction,
        } = {
            ...options,
        }
        const queryBuilder = this.knex(ACCOUNTS_TABLE)
        try {
            if (transaction) await queryBuilder.transacting(transaction)
            const accounts: IAccount[] = await queryBuilder.where((builder: Knex.QueryBuilder): void => {
                if (id) builder.where(`${ACCOUNTS_TABLE}.id`, id)
                if (email_address) builder.where(`${ACCOUNTS_TABLE}.email_address`, email_address)
                if (username) builder.where(`${ACCOUNTS_TABLE}.username`, username)
            })
                .select(`${ACCOUNTS_TABLE}.*`)
            return accounts.map((account: IAccount): IAccount => {
                const {
                    created_at,
                    updated_at,
                } = account
                return {
                    ...account,
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

    async update(parameters: Partial<IAccount>, queryParameters: IQueryAccountParameters, options?: IOptions): Promise<IAccount> {
        const {
            id,
        } = queryParameters
        const {
            transaction,
            for_update,
        } = {
            ...options,
        }
        const queryBuilder = this.knex(ACCOUNTS_TABLE)
        try {
            if (transaction) {
                await queryBuilder.transacting(transaction)
                if (for_update) await queryBuilder.forUpdate()
            }
            const [account]: IAccount[] = await queryBuilder.where((builder: Knex.QueryBuilder): void => {
                if (id) builder.where(`${ACCOUNTS_TABLE}.id`, id)
            })
                .update({
                    ...parameters,
                    updated_at: new Date().toISOString(),
                })
                .returning('*')
            const {
                created_at,
                updated_at,
            } = account
            return {
                ...account,
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

    async delete(parameters?: IDeleteAccountParameters, options?: IOptions): Promise<IAccount> {
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
        const queryBuilder = this.knex(ACCOUNTS_TABLE)
        try {
            if (transaction) await queryBuilder.transacting(transaction)
            const [account]: IAccount[] = await queryBuilder.where((builder: Knex.QueryBuilder): void => {
                if (id) builder.where(`${ACCOUNTS_TABLE}.id`, id)
            })
                .delete()
                .returning('*')
            return account
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
        return this.knex.raw(`truncate ${ACCOUNTS_TABLE} cascade;`)
    }
}
