// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Exclude static files/_next
    '/',                      // Include root
    '/(api|trpc)(.*)'         // Include API routes
  ],
};
