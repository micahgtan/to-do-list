import config from 'config'
import { Factory } from 'rosie'

const JWT_SECRET: string = config.get('app.jwt.secret')
const JWT_ACCESS_TOKEN_EXPIRES_IN: string = config.get('app.jwt.access_token_expires_in')

Factory.define('service.encryption.sign.parameter.parameters')
    .attr('payload', {
        payload: 'payload',
    })
    .attr('key', JWT_SECRET)
    .attr('expires_in', JWT_ACCESS_TOKEN_EXPIRES_IN)
