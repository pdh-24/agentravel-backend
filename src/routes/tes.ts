import { Hono } from "hono";
import Pengguna from "@/database/model/pengguna";

const tes = new Hono();

tes.get('/hello', async (c) => c.json({ message: 'Hello from Hono!' }));
tes.get('/hello2', (c) => c.json({ message: 'Selamat datang di Hono!' }));

tes.post("/tambahManual", async c => {
    console.log("Menambahkan data manual");

    // Query dan lain-lain
    try {
        const body = await c.req.json();
        const newUser = new Pengguna({
            username: body.name,
            email: body.email,
            password: body.password, // Harus di-hash dalam produksi
            role: body.role,
        });

        await newUser.save();
        return c.json({ message: "Berhasil menambahkan data manual" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({ error: String(error) }, 500);
    }
});

export { tes }