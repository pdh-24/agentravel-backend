import Customer from '@/database/model/customer';
import { Hono } from 'hono';

const customer = new Hono();

customer.get("/customer", async c => {
        console.log("Mengambil data semua customer");
        // Query dan lain-lain
        c.json({ message: 'Hello from Hono!' });
    })
    .post("/customer", async c => {
        console.log("Menambah data customer baru");
        // Query dan lain-lain
    })
    .get("/customer/:id", async c => {
        console.log("Mengambil data customer menurut id");
        // Query dan lain-lain
    })
    .put("/customer/:id", async c => {
        console.log("Memperbarui data customer menurut id");
        // Query dan lain-lain
    })
    .delete("/customer/:id", async c => {
        console.log("Menghapus data customer menurut id");
        // Query dan lain-lain
    });

export { customer };