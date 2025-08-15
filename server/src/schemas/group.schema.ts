import Joi from 'joi';

export const createGroupSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().max(150).required(),
        description: Joi.string().allow('', null),
        is_private: Joi.boolean().default(false),
    }),
});

export const groupIdParam = Joi.object({
    params: Joi.object({ id: Joi.number().integer().positive().required() }),
});