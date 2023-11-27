import config from 'config'
import { Factory } from 'rosie'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IAccount } from '@interfaces/models'
import type { Knex } from 'knex'
import container from '@src/index'
import Types from '@src/types'
import { validateAccount } from '@tests/assertions'

const ACCOUNTS_TABLE: string = config.get('database.tables.accounts')

describe('AccountDatabase', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const knex: Knex = container.get(Types.Knex)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')

    afterEach(async (): Promise<void> => {
        await accountDataSource.truncate()
    })

    describe('#create', (): void => {
        it('creates an account record in the database', async (): Promise<void> => {
            await accountDataSource.create(mockAccount)
            const [createdAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            validateAccount(createdAccount)
        })

        it('returns the correct properties of the created account record in the database', async (): Promise<void> => {
            const createdAccount = await accountDataSource.create(mockAccount)
            validateAccount(createdAccount)
        })

        it('creates an account record in the database with a database transaction', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await accountDataSource.create(mockAccount, {
                transaction,
            })
            await transaction.commit()
            const [createdAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            validateAccount(createdAccount)
        })

        it('rolls back the database transaction in the database when a database error is encountered', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await accountDataSource.create(mockAccount, {
                transaction,
            })
            await transaction.rollback()
            const createdAccount = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            expect(createdAccount).toEqual([])
        })
    })

    describe('#get', (): void => {
        beforeEach(async (): Promise<void> => {
            await accountDataSource.create(mockAccount)
        })

        it('gets all of the account records in the database', async (): Promise<void> => {
            const accounts = await accountDataSource.get()
            accounts.forEach((account: IAccount): void => {
                expect(account).toBeTruthy()
            })
        })

        it('returns the correct properties of all of the account records in the database', async (): Promise<void> => {
            const accounts = await accountDataSource.get()
            accounts.forEach((account: IAccount): void => {
                validateAccount(account)
            })
        })

        it('gets the account records with an id property equal to the id parameter in the database', async (): Promise<void> => {
            const {
                id,
            } = mockAccount
            const accounts = await accountDataSource.get({
                id,
            })
            accounts.forEach((account: IAccount): void => {
                validateAccount(account)
                expect(account).toHaveProperty('id', id)
            })
        })

        it('gets the account records with an email_address property equal to the email_address parameter in the database', async (): Promise<void> => {
            const {
                email_address,
            } = mockAccount
            const accounts = await accountDataSource.get({
                email_address,
            })
            accounts.forEach((account: IAccount): void => {
                validateAccount(account)
                expect(account).toHaveProperty('email_address', email_address)
            })
        })

        it('gets the account records with a username property equal to the username parameter in the database', async (): Promise<void> => {
            const {
                username,
            } = mockAccount
            const accounts = await accountDataSource.get({
                username,
            })
            accounts.forEach((account: IAccount): void => {
                validateAccount(account)
                expect(account).toHaveProperty('username', username)
            })
        })
    })

    describe('#update', (): void => {
        beforeEach(async (): Promise<void> => {
            await accountDataSource.create(mockAccount)
        })

        it('updates an account record in the database', async (): Promise<void> => {
            const firstName = 'updated_first_name'
            await accountDataSource.update({
                first_name: firstName,
            }, {
                id: mockAccount.id,
            })
            const [updatedAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            expect(updatedAccount.first_name).toEqual(firstName)
        })

        it('returns the correct properties of the updated account record in the database', async (): Promise<void> => {
            const updatedAccount = await accountDataSource.update({
                first_name: 'updated_first_name',
            }, {
                id: mockAccount.id,
            })
            validateAccount(updatedAccount)
        })

        it('does not update other account records in the database', async (): Promise<void> => {
            const excludedAccounts = await knex(ACCOUNTS_TABLE).whereNot('id', mockAccount.id)
            await accountDataSource.update({
                first_name: 'updated_first_name',
            }, {
                id: mockAccount.id,
            })
            const notUpdatedAccounts = await knex(ACCOUNTS_TABLE).whereNot('id', mockAccount.id)
            expect(notUpdatedAccounts).toMatchObject(excludedAccounts)
        })

        it('updates an account record in the database with a database transaction', async (): Promise<void> => {
            const firstName = 'updated_first_name'
            const transaction = await knex.transaction()
            await accountDataSource.update({
                first_name: firstName,
            }, {
                id: mockAccount.id,
            }, {
                transaction,
            })
            await transaction.commit()
            const [updatedAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            validateAccount(updatedAccount)
            expect(updatedAccount).toHaveProperty('first_name', firstName)
        })

        it('rolls back the database transaction in the database when a database error is encountered', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await accountDataSource.update({
                first_name: 'updated_first_name',
            }, {
                id: mockAccount.id,
            }, {
                transaction,
            })
            await transaction.rollback()
            const [updatedAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            validateAccount(updatedAccount)
            expect(updatedAccount).toHaveProperty('first_name', mockAccount.first_name)
        })
    })

    describe('#delete', (): void => {
        beforeEach(async (): Promise<void> => {
            await accountDataSource.create(mockAccount)
        })

        it('deletes an account record in the database', async (): Promise<void> => {
            await accountDataSource.delete({
                id: mockAccount.id,
            })
            const [deletedAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            expect(deletedAccount).toBeUndefined()
        })

        it('does not delete other account records in the database', async (): Promise<void> => {
            const excludedAccounts = await knex(ACCOUNTS_TABLE).whereNot('id', mockAccount.id)
            await accountDataSource.delete({
                id: mockAccount.id,
            })
            const notDeletedAccounts = await knex(ACCOUNTS_TABLE).whereNot('id', mockAccount.id)
            expect(notDeletedAccounts).toMatchObject(excludedAccounts)
        })

        it('deletes an account record in the database with a database transaction', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await accountDataSource.delete({
                id: mockAccount.id,
            }, {
                transaction,
            })
            await transaction.commit()
            const [deletedAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            expect(deletedAccount).toBeUndefined()
        })

        it('rolls back the database transaction in the database when a database error is encountered', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await accountDataSource.delete({
                id: mockAccount.id,
            }, {
                transaction,
            })
            await transaction.rollback()
            const [deletedAccount]: IAccount[] = await knex(ACCOUNTS_TABLE).where('id', mockAccount.id)
            validateAccount(deletedAccount)
            expect(deletedAccount).toHaveProperty('id', mockAccount.id)
        })
    })
})
