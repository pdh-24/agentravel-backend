import Reservasi from '@/database/model/reservasi';
import { Hono } from 'hono';

const reservasi = new Hono();

reservasi
    .get("/", async c => {
        console.log("Mengambil data semua reservasi");
        
        // Query dan lain-lain
        try {
            const reservasi = await Reservasi.find();
            return c.json({ 
                status  : "berhasil", 
                data    : reservasi 
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
        console.log("Menambahkan data reservasi baru");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const reservasiBaru = new Reservasi({ 
                nik: body.nik,
                name: body.name,
                contact: body.contact, 
                ticket_id: body.ticket_id,
                
                destination: body.destination,
                date: body.date,
                estimated_budget: body.estimated_budget,
                total_price: body.total_price,
                payment_method: body.payment_method,
                payment_status: body.payment_status,
                status: body.status,
                admin_id: body.admin_id,
            });

            await reservasiBaru.save();
            return c.json({ 
                message : "Berhasil menambahkan data reservasi", 
                data    : reservasiBaru 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .get("/:id", async c => {
        console.log("Mengambil detail reservasi menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const reservasi = await Reservasi.findById(id);
            return c.json({ 
                status  : "berhasil", 
                data    : reservasi 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal mengambil data reservasi', 
                error   : String(error) 
            }, 500); 
        }
    })
    .put("/:id", async c => {
        console.log("Memperbarui data reservasi menurut id");
        
        // Query dan lain-lain
        try {
            const body = await c.req.json();
            const { id } = c.req.param();
            const reservasi = await Reservasi.findByIdAndUpdate(id, { $set: 
                { 
                    nik: body.nik,
                    name: body.name,
                    contact: body.contact, 
                    ticket_id: body.ticket_id,
                    destination: body.destination,
                    date: body.date,
                    estimated_budget: body.estimated_budget,
                    total_price: body.total_price,
                    payment_method: body.payment_method,
                    payment_status: body.payment_status,
                    status: body.status,
                    admin_id: body.admin_id,
                }
            }, { new: true });
            return c.json({ 
                status  : "berhasil", 
                data    : reservasi 
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
        console.log("Menghapus reservasi menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            await Reservasi.findOneAndDelete({ "id": id });
            
            return c.json({ 
                status  : "berhasil", 
                message : 'Data reservasi berhasil dihapus' 
            }, 200);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ 
                status  : "gagal", 
                message : 'Gagal menghapus data reservasi', 
                error   : String(error) 
            }, 500); 
        }
    });

export { reservasi };