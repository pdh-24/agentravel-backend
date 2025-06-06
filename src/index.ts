import { Hono } from 'hono';
import { cors } from 'hono/cors'
import dbConnect from '@/database/connection/mongodb';
import { pengguna, customer, reservasi, pembayaran, invois, logTransaksi, laporan } from '@/src/routes/routes';
import { tes } from './routes/tes';
import { autentikasi } from './auth/route';
import { check_authToken } from './middleware/check_token';

export const app = new Hono().basePath("/api");

app.get('/', async (c) => c.json({ message: 'Hello from Hono!' }));
app.route("", tes)
app.use(
    '*',
    cors({
        origin: 'http://localhost:3000',
        allowHeaders: ['Content-Type', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
        allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        
        maxAge: 600,
        credentials: true,
    })
)
// .use("/api/*", check_authToken)
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
    port: 3001, 
    fetch: app.fetch, 
} 
// export default app