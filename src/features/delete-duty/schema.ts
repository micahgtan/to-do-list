import Joi from 'joi'

export default Joi.object({
    id: Joi.string().required(),
    account_id: Joi.string(),
})
