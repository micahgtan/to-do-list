module.exports = {
    app: {
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        greeting_response: {
            message: 'Hello',
        },
        bcrypt: {
            salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
            refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
    },
    database: {
        migrations: 'knex_migrations',
        client: 'postgres',
        name: process.env.DB_NAME,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        etc: {
            pool: {
                min: 0,
                max: 10,
            },
            acquire_connection_timeout: 60000,
        },
        tables: {
            accounts: 'accounts',
            duties: 'duties',
        },
        postgres_errors: {
            foreign_key: '23503',
            unique: '23505',
            no_data_found: 'P0002',
        },
    },
}
