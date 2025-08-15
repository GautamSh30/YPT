import Joi from 'joi';

export const sendMessageSchema = Joi.object({
    params: Joi.object({ id: Joi.number().integer().positive().required() }),
    body: Joi.object({ message: Joi.string().min(1).max(2000).required() }),
});

export const listMessagesSchema = Joi.object({
    params: Joi.object({ id: Joi.number().integer().positive().required() }),
    query: Joi.object({ since: Joi.date().iso().optional() }),
});