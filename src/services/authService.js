import jwt from 'jsonwebtoken';

const SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";  // Güvenlik için çevresel değişkenlerde saklanmalı!

export const generateToken = (userData) => {
    return jwt.sign(userData, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.error("Invalid token");
        return null;
    }
};
