import LogTransaksi from '@/database/model/log-transaksi';
import { Hono } from 'hono';

const logTransaksi = new Hono();

logTransaksi
    .get("/", async c => {
        console.log("Mendapatkan daftar log transaksi");
        
        // Query dan lain-lain
        try {
            const logTransaksi = await LogTransaksi.find();
            
            return c.json({ 
                status  : "berhasil", 
                data    : logTransaksi 
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
    .get("/:id", async c => {
        console.log("Mendapatkan detail log transaksi menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const logTransaksi = await LogTransaksi.findById(id);
            
            return c.json({ 
                status  : "berhasil", 
                data    : logTransaksi 
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
    });

export { logTransaksi };