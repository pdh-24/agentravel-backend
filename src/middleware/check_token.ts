import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie"; // setCookie untuk menghapus cookie jika tidak valid
import { verify } from 'hono/jwt';
import { JwtTokenExpired } from 'hono/utils/jwt/types';

export const check_authToken: MiddlewareHandler = async (c, next) => {
    const tokenFromCookie = getCookie(c, 'token'); // 'token' adalah nama cookie Anda
    if (!tokenFromCookie) {
        return c.json({
            loggedIn: false,
            message: 'Akses ditolak. Token autentikasi tidak ditemukan dalam cookie.',
            path: c.req.url
        }, 401);
    }
    
    try {
        // Validate the token here (e.g., using a JWT library)
        const payload = await verify(tokenFromCookie, process.env.ENDPOINT_KEY ?? "", "HS256") as { 
            id: string, username: string, email: string, role: string, exp: number 
        };
        c.set('user', payload); 
        console.log("User with email: " + payload.email + ` is authenticated to access ${c.req.url} at ` + new Date().toISOString())
    } catch (error) {
        if (error instanceof JwtTokenExpired) {
            return c.json({
                loggedIn: false,
                message: error.name,
                token: tokenFromCookie
            }, 401)
        }
    }
    // If valid, call next()
    await next()
}