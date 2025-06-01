import Pengguna from '@/database/model/pengguna';
import { Context } from "hono";
import { Hono } from 'hono';
import { check_authToken } from '../middleware/check_token';
import { getCookie, setCookie } from 'hono/cookie';

const pengguna = new Hono();
type MyContext = Context<{
    Variables: {
      user: {
        id: string;
        username: string;
        email: string;
        role: string;
        exp: number;
      };
    };
}>;
pengguna
    .get("/", async c => {
        console.log("Mengambil data semua pengguna");

        // Query dan lain-lain
        try {
            const pengguna = await Pengguna.find();
            // console.log("Cek\n");
            return c.json({ 
                status: "berhasil", 
                data: pengguna 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            
            return c.json({ 
                status: "gagal", 
                message: 'Gagal mengambil data pengguna', 
                error: String(error) 
            }, 500); 
        }
    })
    .post('afterSignIn', async (c: MyContext) => {
        const tokenFromCookie = getCookie(c, 'token');
        if (!tokenFromCookie) {
            return c.json({
                loggedIn: false,
                message: 'Akses ditolak. Token autentikasi tidak ditemukan dalam cookie.',
                path: c.req.url,
                cookie: tokenFromCookie
            }, 401);
        }
        const authenticatedUser = c.get('user') as {
            id: string;
            username: string;
            email: string;
            role: string;
            exp: number;
        }; // Dapatkan 'user' dari context

        if (!authenticatedUser) {
            // Seharusnya tidak terjadi jika middleware bekerja dengan benar,
            // tapi sebagai fallback atau jika 'user' tidak selalu di-set.
            return c.json({ ok: false, message: "Informasi pengguna tidak tersedia setelah otentikasi." }, 500);
        }
        return c.json({
            ok: true,
            loggedIn: true,
            message: "Berhasil mendapatkan informasi pengguna setelah otentikasi.",
            user: authenticatedUser
        });
    })
    .get("/:id", async c => {
        console.log("Mengambil detail pengguna menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const pengguna = await Pengguna.findById(id);
            return c.json({ 
                status: "berhasil", 
                data: pengguna 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    })
    .post("/", async c => {
        console.log("Menambah data pengguna baru");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const existingUser = await Pengguna.find({ username: body.username.toLowerCase() });
            if (existingUser.length > 0) {
                return c.json({
                    ok: true, 
                    message: "Username sudah cek", 
                    data: existingUser
                });
            }
            const argonHash = await Bun.password.hash(body.password, {
                algorithm: "argon2id",
                memoryCost: 4, // memory usage in kibibytes
                timeCost: 3, // the number of iterations
            });
            const newUser = await Pengguna.create({
                username: body.username,
                email: body.email,
                password: argonHash, // Harus di-hash dalam produksi
                role: body.role,
            });
    
            await newUser.save();
            return c.json({ 
                message: "Berhasil menambahkan data manual", 
                data: {
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                } 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .put("/:id", async c => {
        console.log("Memperbarui data pengguna menurut id");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const { id } = c.req.param();
            const pengguna = await Pengguna.findByIdAndUpdate(id, { $set: 
                { 
                  username: body.username,
                  email: body.email,
                  password: body.password, // Harus di-hash dalam produksi
                  role: body.role,
                }
            }, { new: true });
            
            return c.json({ 
                status  : "berhasil", 
                data    : pengguna
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data pengguna', 
                error   : String(error) 
            }, 500); 
        }
    })
    .delete("/:id", async c => { 
        console.log("Menghapus data pengguna menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            await Pengguna.findOneAndDelete({ "id": id });
            
            return c.json({ 
                status: "berhasil", 
                message: 'Data pengguna berhasil dihapus' 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status: "gagal", 
                message: 'Gagal menghapus data pengguna', 
                error: String(error) 
            }, 500); 
        }
    })
;

export { pengguna };