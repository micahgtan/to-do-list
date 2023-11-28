import config from 'config'
import type { Knex } from 'knex'

const ACCOUNTS_TABLE: string = config.get('database.tables.accounts')

export function up(knex: Knex): Promise<void> {
    return knex.raw(`
        create table ${ACCOUNTS_TABLE} (
            id text not null primary key,
            first_name text not null,
            middle_name text not null,
            last_name text not null,
            contact_number text not null,
            email_address text not null unique,
            username text not null unique,
            password text not null,
            created_at timestamptz not null default now(),
            updated_at timestamptz not null default now()
        );
    `)
}

export function down(knex: Knex): Promise<void> {
    return knex.raw(`drop table ${ACCOUNTS_TABLE};`)
}
