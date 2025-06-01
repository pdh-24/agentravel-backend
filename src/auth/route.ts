import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import Pengguna from "@/database/model/pengguna";
import { sign, verify } from "hono/jwt";

const autentikasi = new Hono();

autentikasi
    .post('signin', async (c) => {
        try {
            const { username, password } = await c.req.json();
            const pengguna = await Pengguna.find({ username: username.toLowerCase() });
            
            const isMatch = await Bun.password.verify(password, pengguna[0].password);
            if (!isMatch) {
                return c.json({
                    ok: false,
                    message: "Username dan password tidak valid",
                });
            }
            // if (pengguna.length === 0) {
            //     return c.json({
            //         ok: false,
            //         message: "Username dan password tidak valid",
            //     })
            // }
            
            const payload = {
                id: pengguna[0]._id,
                username: username,
                email: pengguna[0].email,
                role: pengguna[0].role,
                exp: Math.floor(Date.now() / 1000) + 3600 * 72, // Token expires in 3 days (72 hours)
            }
            
            const secret = process.env.ENDPOINT_KEY ?? ""; // Replace with your secret key
            const token = await sign(payload, secret, "HS256");
            
            setCookie(c, `token`, token, { 
                path:"/" , 
                domain: "http://localhost:3000", // Adjust domain as needed
                httpOnly: false, 
                secure: false, 
                maxAge: 60 * 60 * 24 * 3 // Set cookie for 3 days
            });
            // console.log(c.header.);
            return c.json({
                ok: true,
                loggedIn: true,
                message: "Login berhasil",
                username: username,
                token: token
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ loggedIn: false, error: error.message }, 400);
            }
            
            return c.json({ 
                status: "gagal", 
                loggedIn: false,
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