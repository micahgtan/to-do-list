/* eslint-disable @typescript-eslint/naming-convention */
export default {
    // Features
    CreateAccount: Symbol.for('CreateAccount'),
    CreateSession: Symbol.for('CreateSession'),
    DeleteAccount: Symbol.for('DeleteAccount'),
    UpdateAccount: Symbol.for('UpdateAccount'),

    // Databases
    AccountDataSource: Symbol.for('AccountDataSource'),

    // Services
    EncryptionService: Symbol.for('EncryptionService'),
    HashService: Symbol.for('HashService'),
    IdService: Symbol.for('IdService'),

    // Dependencies
    Knex: Symbol.for('Knex'),
}
