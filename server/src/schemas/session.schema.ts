import Joi from 'joi';

export const startSessionSchema = Joi.object({
    body: Joi.object({
        start_time: Joi.date().iso().required(),
        subject_id: Joi.number().integer().positive().optional(),
    }),
});

export const pauseSchema = Joi.object({
    body: Joi.object({
        session_id: Joi.number().integer().positive().required(),
        pause_time: Joi.date().iso().required(),
    }),
});

export const resumeSchema = Joi.object({
    body: Joi.object({
        session_id: Joi.number().integer().positive().required(),
        resume_time: Joi.date().iso().required(),
    }),
});

export const stopSchema = Joi.object({
    body: Joi.object({
        session_id: Joi.number().integer().positive().required(),
        end_time: Joi.date().iso().required(),
    }),
});