import config from 'config'
import type { Knex } from 'knex'

const ACCOUNTS_TABLE: string = config.get('database.tables.accounts')
const DUTIES_TABLE: string = config.get('database.tables.duties')

export function up(knex: Knex): Promise<void> {
    return knex.raw(`
        create table ${DUTIES_TABLE} (
            id text not null primary key,
            account_id text not null,
            name text not null unique,
            created_at timestamptz not null default now(),
            updated_at timestamptz not null default now(),
            constraint duties_account_id_fkey foreign key (account_id) references ${ACCOUNTS_TABLE} (id)
        );
    `)
}

export function down(knex: Knex): Promise<void> {
    return knex.raw(`
        alter table ${DUTIES_TABLE}
            drop constraint duties_account_id_fkey foreign key (account_id) references ${ACCOUNTS_TABLE} (id);
        drop table ${DUTIES_TABLE};
    `)
}
