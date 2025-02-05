# Logger
Logger module abstraction for Nodejs. To provide the capability to log via a common
pattern across the various projects. This can be extended to include DB logging, 
cloud-services, or other Node libraries. 

The primary purpose of this library is to avoid situations where multiple projects
are tightly coupled to any logging library that may need to be updated across
all projects, or involve many code changes for method signature changes or deprecation,
or be limited to Console logging vs persistent storage, etc.

Install
---
```sh
npm i -S https://github.com/snaptech/logger.git
```

This NPM package is also hosted at the following registry:
https://snaptech.pkgs.visualstudio.com/_packaging/snaptech/npm/registry/


Usage
---

Typescript:
```ts
import * as logger from '@snaptech/logger';
import { default as logger } from '@snaptech/logger'

```

Javascript:
```js
const logger = require('logger');
```

Common:
```js
logger.info(...);
logger.trace(...);
logger.warn(...);
logger.debug(...);
logger.error(...);

```

Release/Maintenance
---
Lint if desired but remove the linting dependencies to reduce weight on downstream
applications. Eslint was used for the build-out but the implementation here is outdated.



1. `npm test` -- once implemented
2. `npm pack`
3. Copy .nvmrc for the Snaptech private registry to local folder
3. `npm publish`


Chores / Todo
---
- Update Eslint configuration to Tslint
- Update project to Typescript
- Remove remaining dependencies to keep extra-lightweight
- Add DB/cloud-services logging capability/configuration
- Write test scripts

