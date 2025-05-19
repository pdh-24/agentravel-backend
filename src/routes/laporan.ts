import Laporan from '@/database/model/laporan';
import { Hono } from 'hono';

const laporan = new Hono();

laporan
    .get("/", async c => {
        console.log("Mendapatkan laporan");

        // Query dan lain-lain
        try {
            const laporan = await Laporan.find();
            
            return c.json({ 
                status  : "berhasil", 
                data    : laporan 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data laporan', 
                error   : String(error) 
            }, 500); 
        }
    })
;

export { laporan };