import dotenv from 'dotenv';
dotenv.config();
export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    dbUrl: process.env.DATABASE_URL as string,
    jwtSecret: process.env.JWT_SECRET as string,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
};