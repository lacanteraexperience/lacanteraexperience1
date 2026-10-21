import { clerkMiddleware } from "@clerk/nextjs/server";

// Inicializa la sesión de Clerk. Las rutas se protegerán por rol cuando el
// panel y la vista de jugadora lean ya los datos compartidos de Neon.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
