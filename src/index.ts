import { Hono } from 'hono';
import dbConnect from '@/database/connection/mongodb';
import { pengguna, customer, reservasi, pembayaran, invois, logTransaksi, laporan } from '@/src/routes/all';
import { tes } from './routes/tes';
import { autentikasi } from './auth/route';

export const app = new Hono().basePath("/api");

app.get('/', async (c) => c.json({ message: 'Hello from Hono!' }));
app.route("", tes)

// Koneksi database hanya sekali sebelum rute dijalankan
await dbConnect();

app.route("", autentikasi);
/* -------------- MANAJEMEN PENGGUNA -------------- */
app.route("/pengguna", pengguna)

/* -------------- MANAJEMEN CUSTOMER -------------- */
app.route("/customer", customer)


/* -------------- MANAJEMEN RESERVASI -------------- */
app.route("/reservasi", reservasi)

/* -------------- MANAJEMEN PEMBAYARAN -------------- */
app.route("/pembayaran", pembayaran)

/* -------------- MANAJEMEN INVOIS -------------- */
app.route("/invois", invois)

/* ---------- MANAJEMEN RIWAYAT TRANSAKSI ---------- */
app.route("/log-transaksi", logTransaksi);

/* -------------- MANAJEMEN LAPORAN -------------- */
app.route("/laporan", laporan)

// Jalankan aplikasi di port 3000
export default { 
    port: 3000, 
    fetch: app.fetch, 
} 
// export default app