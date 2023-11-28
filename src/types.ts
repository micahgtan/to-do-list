/* eslint-disable @typescript-eslint/naming-convention */
export default {
    // Features
    CreateAccount: Symbol.for('CreateAccount'),
    CreateDuty: Symbol.for('CreateDuty'),
    CreateSession: Symbol.for('CreateSession'),
    DeleteAccount: Symbol.for('DeleteAccount'),
    DeleteDuty: Symbol.for('DeleteDuty'),
    UpdateAccount: Symbol.for('UpdateAccount'),
    UpdateDuty: Symbol.for('UpdateDuty'),

    // Databases
    AccountDataSource: Symbol.for('AccountDataSource'),
    DutyDataSource: Symbol.for('DutyDataSource'),

    // Services
    EncryptionService: Symbol.for('EncryptionService'),
    HashService: Symbol.for('HashService'),
    IdService: Symbol.for('IdService'),

    // Dependencies
    Knex: Symbol.for('Knex'),
}
