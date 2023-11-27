import Joi from 'joi'
import { CONTACT_NUMBER_LENGTH } from '@constants/account'

export default Joi.object({
    first_name: Joi.string().required(),
    middle_name: Joi.string().required(),
    last_name: Joi.string().required(),
    contact_number: Joi.string().length(CONTACT_NUMBER_LENGTH)
        .required(),
    email_address: Joi.string().email()
        .required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
})
