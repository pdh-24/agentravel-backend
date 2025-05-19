import Invois from '@/database/model/invois';
import { Hono } from 'hono';

const invois = new Hono();

invois
    .post("/", async c => {
    console.log("Membuat dan mengirim invois");
    
    // Query dan lain-lain
        try {
            const body = await c.req.json();
            const invoisBaru = new Invois({ 
                reservation_id: body.reservation_id,
                total_amount: body.total_amount,
                fee: body.fee,
                payment_method: body.payment_method,
                payment_date: body.payment_date,
                issued_date: body.issued_date,
                due_date: body.due_date,
                status: body.status,
            });

            await invoisBaru.save();
            return c.json({ 
                message : "Berhasil menambahkan data invois", 
                data    : invoisBaru 
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: String(error) }, 500);
        }
    })
    .get("/:id", async c => {
        console.log("Mendapatkan detail invois menurut id");
        
        // Query dan lain-lain
        try {
            const { id } = c.req.param();
            const invois = await Invois.findById(id);
            
            return c.json({ 
                status  : "berhasil", 
                data    : invois 
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
;
export { invois };