### An improved structure for serverless on nodejs...

<!-- TOC depthFrom:1 depthTo:3 -->
- [Overview](#overview)
- [Get started](#getstarted)
<!-- /TOC -->

## Overview

Components:
- Nodejs 18.x
- Typescript
- Serverless v3
- LocalStack v1.4

Features:
- Modularization.
- Alias import.
- Dynamic resources.
- Dynamic functions.
- Dependency Injection pattern, Singleton pattern, Interception.

Folder structure:
```
.
`-- Root/
    |-- dist/
    |-- src/
    |   `-- app/
    |       |-- core/
    |       |   `-- ...
    |       |-- extension/
    |       |   |-- VendorA/
    |       |   |   |-- ModuleA1/
    |       |   |   |   |-- Api/
    |       |   |   |   |   `-- Rest/
    |       |   |   |   |       |-- Todo.ts
    |       |   |   |   |       `-- ...
    |       |   |   |   |-- etc/
    |       |   |   |   |   `-- di.ts
    |       |   |   |   |-- Handler/
    |       |   |   |   |   |-- Api.ts
    |       |   |   |   |   `-- ...
    |       |   |   |   |-- Model/
    |       |   |   |   |   |-- ResourceModel/
    |       |   |   |   |   |   |-- Todo.ts
    |       |   |   |   |   |   `-- ...
    |       |   |   |   |   |-- Todo.ts
    |       |   |   |   |   `-- ...
    |       |   |   |   |-- Resources/
    |       |   |   |   |   |-- tbl_todo.yml
    |       |   |   |   |   `-- ...
    |       |   |   |   |-- functions.yml
    |       |   |   |   `-- ...
    |       |   |   |-- ModuleA2
    |       |   |   `-- ...
    |       |   |-- VendorB/
    |       |   |   |-- ModuleB1
    |       |   |   |-- ModuleB2
    |       |   |   `-- ...
    |       |   `-- ...
    |       `-- Autoload.ts
    |-- serverless.yml
    |-- serverless-dynamic-functions.js
    |-- serverless-dynamic-resources.js
    `-- ...
```

## Get started

#### Requirement:
- Docker.
- Nodejs 18: Make sure you are using node 18. You can use `nvm` to switch between node versions easily. See: https://github.com/nvm-sh/nvm

#### Installation:
- `npm install`
- `npm run deploy:local`
- `npm run start:local`

That all. We are ready to develop.
