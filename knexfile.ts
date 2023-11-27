import config from 'config'

export default {
    client: 'pg',
    connection: {
        host: config.get('database.connection.host'),
        database: config.get('database.name'),
        user: config.get('database.connection.user'),
        password: config.get('database.connection.password'),
    },
    migrations: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        tableName: config.get('database.migrations'),
    },
}
