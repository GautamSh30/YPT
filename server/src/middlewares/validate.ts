import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate =
(schema: Joi.ObjectSchema) =>
(req: Request, res: Response, next: NextFunction) => {
    const data = { body: req.body, params: req.params, query: req.query };
    const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true });
    if (error) return res.status(400).json({ error: 'Validation error', details: error.details });
    next();
};