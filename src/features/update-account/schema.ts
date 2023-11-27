import Joi from 'joi'
import { CONTACT_NUMBER_LENGTH } from '@constants/account'

export default Joi.object({
    id: Joi.string().required(),
    first_name: Joi.string(),
    middle_name: Joi.string(),
    last_name: Joi.string(),
    contact_number: Joi.string().length(CONTACT_NUMBER_LENGTH),
    email_address: Joi.string().email(),
    username: Joi.string(),
    password: Joi.string(),
})
