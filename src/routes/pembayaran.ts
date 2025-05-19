import Pembayaran from '@/database/model/pembayaran';
import { Hono } from 'hono';

const pembayaran = new Hono();

pembayaran
    .post("/pembayaran", async c => {
        console.log("Membuat pembayaran");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const pembayaranBaru = new Pembayaran({ 
                reservasiId: body.reservasiId,
                jumlah: body.jumlah,
                metode: body.metode, 
                status: body.status,
            });

            await pembayaranBaru.save();
            return c.json({ 
                message : "Berhasil menambahkan data pembayaran", 
                data    : pembayaranBaru 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .put("/pembayaran/:id", async c => {
        console.log("Memperbarui data pembayaran menurut id");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const { id } = c.req.param();
            const pembayaran = await Pembayaran.findByIdAndUpdate(id, { $set: 
                { 
                    reservasiId: body.reservasiId,
                    jumlah: body.jumlah,
                    metode: body.metode, 
                    status: body.status,
                }
            }, { new: true });
            return c.json({ 
                status  : "berhasil", 
                data    : pembayaran 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal memperbarui data pembayaran', 
                error   : String(error) 
            }, 500); 
        }
    })
;

export { pembayaran };