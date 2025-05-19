import Customer from '@/database/model/customer';
import { Hono } from 'hono';

const customer = new Hono();

customer.get("/", async c => {
        console.log("Mengambil data semua customer");
        // Query dan lain-lain
        c.json({ message: 'Hello from Hono!' });
    })
    .post("/", async c => {
        console.log("Menambah data customer baru");
        // Query dan lain-lain
    })
    .get("/:id", async c => {
        console.log("Mengambil data customer menurut id");
        // Query dan lain-lain
    })
    .put("/:id", async c => {
        console.log("Memperbarui data customer menurut id");
        // Query dan lain-lain
    })
    .delete("/:id", async c => {
        console.log("Menghapus data customer menurut id");
        // Query dan lain-lain
    });

export { customer };