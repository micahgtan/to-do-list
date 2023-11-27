import config from 'config'
import { Factory } from 'rosie'

const BCRYPT_SALT_ROUNDS: number = config.get('app.bcrypt.salt_rounds')

Factory.define('service.hash.hash.parameter.parameters')
    .attr('data', 'data')
    .attr('salt_rounds', BCRYPT_SALT_ROUNDS)
