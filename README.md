Quick start:

1. pnpm i --shamefully-hoist
2. Build the backend: cd nestjs && pnpm run build
3. Deploy the infrastructure (that includes the backend): cd cdk && npx cdk deploy

Issues so far:

* Can't use nest.js inside a PNPM workspace, because libraries like 'tslib' are not available inside the nest.js node_modules folder but they are required at runtime
