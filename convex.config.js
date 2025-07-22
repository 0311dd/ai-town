// convex.config.ts
import { defineConfig } from 'convex/config';

export default defineConfig({
  auth: {
    providers: [
      {
        domain: 'https://api.clerk.dev',
        applicationID: 'app_301hjsijTy2qA46Qc694NURdwS7',
      },
    ],
  },
});
