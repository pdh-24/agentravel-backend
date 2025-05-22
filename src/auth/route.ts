import { Hono } from "hono";
import Pengguna from "@/database/model/pengguna";
import { sign, verify } from "hono/jwt";

const autentikasi = new Hono();

autentikasi
    .post('signin', async (c) => {
        try {
            const { username, password } = await c.req.json();
            const pengguna = await Pengguna.find({ username, password });
            
            if (pengguna.length === 0) {
                return c.json({
                    ok: false,
                    message: "Username dan password tidak valid",
                })
            }
            
            const payload = {
                username: username,
                role: "user",
                exp: Math.floor(Date.now() / 1000) + 3600 * 72, // Token expires in 3 days (72 hours)
            }
            
            const secret = process.env.ENDPOINT_KEY ?? ""; // Replace with your secret key
            const token = await sign(payload, secret, "HS256");
            
            c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Secure`);
            return c.json({
                ok: true,
                message: "Login berhasil",
                username: username,
                token: token
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            
            return c.json({ 
                status: "gagal", 
                message: String(error) , 
            }, 500);
        }
    })
    .post('signup', async (c) => {
        /*
        const new_user = await c.req.json() as { username: string, email: string, password: string, role: string };
        await fetch("/api/pengguna", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: new_user.username,
                email: new_user.email,
                password: new_user.password, // hash di backend nanti!
                role: new_user.role
            })
        })
        .then(res => res.json())
        */
        return c.json({
            ok: true,
            message: "Signup feature is currently disabled."
        })
    })
    .get('signout', async (c) => {
        c.header("Set-Cookie", `token=; HttpOnly; Path=/; Secure; Max-Age=0`);
        return c.json({
            ok: true,
            message: "Logout berhasil"
        })
    })

export { autentikasi };