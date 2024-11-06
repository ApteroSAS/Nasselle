This is a direct src lib module, the file must be compiled in the parent project
# 1
```bash

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  transpilePackages: ['dashboard-core'],
  /* config options here */
  typescript: {
    // WARNING: This allows production builds to successfully complete even if
    // your project has type errors. Use this option with caution.
    ignoreBuildErrors: true,
  },
};

```

# 2
you also need to add the following to the src/pages/api/core/[[path]].ts file
```typescript
// pages/api/core/[[...path]].ts
import { NextApiRequest, NextApiResponse } from 'next';
import {coreApiHandler} from "dashboard-core/backend/CoreApiHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return coreApiHandler(req, res);
}
    
```
