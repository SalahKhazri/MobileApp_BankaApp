import jwt from "jsonwebtoken";
import { ENV } from '../config/env.js';

const generateToken = (userId) => {
    return jwt.sign({id: userId}, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRES_IN,
    });
};

export default generateToken;