import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, redirect } = context;

  // Cek jika user mengakses folder /admin/ (kecuali halaman login-nya)
  if (url.pathname.startsWith("/admin/") && url.pathname !== "/admin/login") {
    const accessToken = cookies.get("sb-access-token");

    // Jika tidak ada token (belum login), paksa pindah ke halaman login
    if (!accessToken) {
      return redirect("/admin/login");
    }
  }

  // Jika sudah login atau akses halaman selain /admin/, lanjutkan proses
  return next();
});