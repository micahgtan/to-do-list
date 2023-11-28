import Joi from 'joi'

export default Joi.object({
    account_id: Joi.string().required(),
    name: Joi.string().required(),
})
