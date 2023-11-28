import config from 'config'
import { Factory } from 'rosie'
import type {
    IAccountDataSource,
    IDutyDataSource,
} from '@interfaces/data-sources'
import type {
    IAccount,
    IDuty,
} from '@interfaces/models'
import type { Knex } from 'knex'
import container from '@src/index'
import Types from '@src/types'
import {
    validateAccount,
    validateDuty,
} from '@tests/assertions'

const DUTIES_TABLE: string = config.get('database.tables.duties')

describe('DutyDatabase', (): void => {
    const accountDataSource: IAccountDataSource = container.get(Types.AccountDataSource)
    const dutyDataSource: IDutyDataSource = container.get(Types.DutyDataSource)
    const knex: Knex = container.get(Types.Knex)
    const mockAccount: IAccount = Factory.build('service.account_database.record.account.1')
    const mockDuty: IDuty = Factory.build('service.duty_database.record.duty.1')

    beforeEach(async (): Promise<void> => {
        await accountDataSource.create(mockAccount)
    })

    afterEach(async (): Promise<void> => {
        await dutyDataSource.truncate()
        await accountDataSource.truncate()
    })

    describe('#create', (): void => {
        it('creates a duty record in the database', async (): Promise<void> => {
            await dutyDataSource.create(mockDuty)
            const [createdDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            validateDuty(createdDuty)
        })

        it('returns the correct properties of the created duty record in the database', async (): Promise<void> => {
            const createdDuty = await dutyDataSource.create(mockDuty)
            validateDuty(createdDuty)
        })

        it('creates a duty record in the database with a database transaction', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await dutyDataSource.create(mockDuty, {
                transaction,
            })
            await transaction.commit()
            const [createdDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            validateDuty(createdDuty)
        })

        it('rolls back the database transaction in the database when a database error is encountered', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await dutyDataSource.create(mockDuty, {
                transaction,
            })
            await transaction.rollback()
            const createdDuty = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            expect(createdDuty).toEqual([])
        })
    })

    describe('#get', (): void => {
        beforeEach(async (): Promise<void> => {
            await dutyDataSource.create(mockDuty)
        })

        it('gets all of the duty records in the database', async (): Promise<void> => {
            const duties = await dutyDataSource.get()
            duties.forEach((duty: IDuty): void => {
                expect(duty).toBeTruthy()
            })
        })

        it('returns the correct properties of all of the duty records in the database', async (): Promise<void> => {
            const duties = await dutyDataSource.get()
            duties.forEach((duty: IDuty): void => {
                validateDuty(duty)
            })
        })

        it('gets the duty records with an id property equal to the id parameter in the database', async (): Promise<void> => {
            const {
                id,
            } = mockDuty
            const duties = await dutyDataSource.get({
                id,
            })
            duties.forEach((duty: IDuty): void => {
                validateDuty(duty)
                expect(duty).toHaveProperty('id', id)
            })
        })

        it('gets the duty records with an account_id property equal to the account_id parameter in the database', async (): Promise<void> => {
            const {
                account_id,
            } = mockDuty
            const duties = await dutyDataSource.get({
                account_id,
            })
            duties.forEach((duty: IDuty): void => {
                validateDuty(duty)
                expect(duty).toHaveProperty('account_id', account_id)
            })
        })

        it('gets the location records with a name property equal to the name parameter in the database', async (): Promise<void> => {
            const {
                name,
            } = mockDuty
            const duties = await dutyDataSource.get({
                name,
            })
            duties.forEach((duty: IDuty): void => {
                validateDuty(duty)
                expect(duty).toHaveProperty('name', name)
            })
        })

        it('gets all of the duty records including account in the database', async (): Promise<void> => {
            const duties = await dutyDataSource.get({}, {
                include: {
                    account: true,
                },
            })
            duties.forEach((duty: IDuty): void => {
                validateDuty(duty)
                validateAccount(duty.account!)
            })
        })
    })

    describe('#update', (): void => {
        beforeEach(async (): Promise<void> => {
            await dutyDataSource.create(mockDuty)
        })

        it('updates a duty record in the database', async (): Promise<void> => {
            const name = 'updated_name'
            await dutyDataSource.update({
                name,
            }, {
                id: mockDuty.id,
            })
            const [updatedDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            expect(updatedDuty.name).toEqual(name)
        })

        it('returns the correct properties of the updated duty record in the database', async (): Promise<void> => {
            const updatedDuty = await dutyDataSource.update({
                name: 'updated_name',
            }, {
                id: mockDuty.id,
            })
            validateDuty(updatedDuty)
        })

        it('does not update other duty records in the database', async (): Promise<void> => {
            const excludedDuties = await knex(DUTIES_TABLE).whereNot('id', mockDuty.id)
            await dutyDataSource.update({
                name: 'updated_name',
            }, {
                id: mockDuty.id,
            })
            const notUpdatedDuties = await knex(DUTIES_TABLE).whereNot('id', mockDuty.id)
            expect(notUpdatedDuties).toMatchObject(excludedDuties)
        })

        it('updates a duty record in the database with a database transaction', async (): Promise<void> => {
            const name = 'updated_name'
            const transaction = await knex.transaction()
            await dutyDataSource.update({
                name,
            }, {
                id: mockDuty.id,
            }, {
                transaction,
            })
            await transaction.commit()
            const [updatedDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            validateDuty(updatedDuty)
            expect(updatedDuty).toHaveProperty('name', name)
        })

        it('rolls back the database transaction in the database when a database error is encountered', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await dutyDataSource.update({
                name: 'updated_name',
            }, {
                id: mockDuty.id,
            }, {
                transaction,
            })
            await transaction.rollback()
            const [updatedDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            validateDuty(updatedDuty)
            expect(updatedDuty).toHaveProperty('name', mockDuty.name)
        })
    })

    describe('#delete', (): void => {
        beforeEach(async (): Promise<void> => {
            await dutyDataSource.create(mockDuty)
        })

        it('deletes a duty record in the database', async (): Promise<void> => {
            await dutyDataSource.delete({
                id: mockDuty.id,
            })
            const [deletedDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            expect(deletedDuty).toBeUndefined()
        })

        it('does not delete other duty records in the database', async (): Promise<void> => {
            const excludedDuties = await knex(DUTIES_TABLE).whereNot('id', mockDuty.id)
            await dutyDataSource.delete({
                id: mockDuty.id,
            })
            const notDeletedDuties = await knex(DUTIES_TABLE).whereNot('id', mockDuty.id)
            expect(notDeletedDuties).toMatchObject(excludedDuties)
        })

        it('deletes a duty record in the database with a database transaction', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await dutyDataSource.delete({
                id: mockDuty.id,
            }, {
                transaction,
            })
            await transaction.commit()
            const [deletedDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            expect(deletedDuty).toBeUndefined()
        })

        it('rolls back the database transaction in the database when a database error is encountered', async (): Promise<void> => {
            const transaction = await knex.transaction()
            await dutyDataSource.delete({
                id: mockDuty.id,
            }, {
                transaction,
            })
            await transaction.rollback()
            const [deletedDuty]: IDuty[] = await knex(DUTIES_TABLE).where('id', mockDuty.id)
            validateDuty(deletedDuty)
            expect(deletedDuty).toHaveProperty('id', mockDuty.id)
        })
    })
})
