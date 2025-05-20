import Pengguna from '@/database/model/pengguna';
import { ok } from 'assert';
import { Hono } from 'hono';

const pengguna = new Hono();

pengguna
    .get("/", async c => {
        console.log("Mengambil data semua pengguna");

        // Query dan lain-lain
        try {
            const pengguna = await Pengguna.find();
            // console.log("Cek\n");
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
        return c.json({ 
            status: "berhasil", 
            data: pengguna 
        }, 200);
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
    .get("/admin", async c => {
        console.log("Mengambil detail pengguna menurut id");
        
        // Query dan lain-lain
        try {
            const { username, password } = c.req.query();
            const pengguna = await Pengguna.find({ username, password });
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
            const existingUser = await Pengguna.find(body.username);
            if (existingUser.length > 0) {
                return c.json({
                    ok: true, 
                    message: "Username sudah dipakai", 
                });
            }
            const newUser = await Pengguna.create({
                username: body.username,
                email: body.email,
                password: body.password, // Harus di-hash dalam produksi
                role: body.role,
            });
    
            await newUser.save();
            return c.json({ 
                message: "Berhasil menambahkan data manual", 
                data: newUser 
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