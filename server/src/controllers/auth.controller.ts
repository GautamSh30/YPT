import express from 'express';
import type { Request, Response } from 'express';
import { createUser, findByEmail } from '../models/user.models.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signJwt } from '../config/jwt.js';

export const register = async (req: Request, res: Response) => {
    console.log("Here")
    const { name, email, password } = req.body;
    const existing = await findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const password_hash = await hashPassword(password);
    const user = await createUser({ name, email, password_hash });
    const token = signJwt({ id: user.id, email: user.email });
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
};

export const login = async (req: Request, res: Response) => {
const { email, password } = req.body;
const user = await findByEmail(email);
if (!user?.password_hash) return res.status(401).json({ error: 'Invalid credentials' });
const ok = await comparePassword(password, user.password_hash);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
const token = signJwt({ id: user.id, email: user.email });
return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
};

export const me = async (req: Request, res: Response) => {
// user is attached by auth middleware
// Optionally re-fetch more fields if needed
// For v1, echo user payload
// @ts-ignore
const user = req.user;
return res.json({ user });
};