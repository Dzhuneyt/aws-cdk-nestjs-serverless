Quick start:

1. pnpm i --shamefully-hoist
2. Build the backend: cd nestjs && pnpm run build
3. Deploy the infrastructure (that includes the backend): cd cdk && npx cdk deploy

Issues so far:

* Can't use nest.js inside a PNPM workspace, because libraries like 'tslib' are not available inside the nest.js
  node_modules folder but they are required at runtime
* Nest.js maintainers seem to discourage any usage of bundlers like esbuild, webpack, pkg, etc., and instead suggest
  that the nest.js compiled output should be always deployed along with the node_modules
  dependencies (https://github.com/nestjs/nest-cli/issues/731). I suggest this is because of the fact that supporting
  this feature is hard. However, deploying the whole monolithic nest.js app and all its dependencies exceeds a Lambda
  limitation: maximum 256MB deployable source code.
* At the same time, the esbuild maintainers are hesitant about implementing support for Decorators (which nest.js uses
  heavily), because they are considered non-standard by the EcmaScript
  community (https://github.com/evanw/esbuild/issues/104#issuecomment-627645920
  and https://github.com/nestjs/nest-cli/issues/731#issuecomment-1041573532)
* SWC support: https://github.com/nestjs/nest-cli/issues/731#issuecomment-1358366880
