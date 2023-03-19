### An improved structure for serverless on nodejs...

<!-- TOC depthFrom:1 depthTo:3 -->
- [Overview](#overview)
- [Get started](#get-started)
  - [Requirement](#requirement)
  - [Installation](#installation)
  - [Alias import](#alias-import)
  - [Create resources](#create-resources)
  - [Dependency Injection](#dependency-injection)
- [Create a Lambda function](#create-a-lambda-function)
- [Create a Rest API](#create-a-rest-api)
- [AWS Policy](#aws-policy)
- [Important](#important)
<!-- /TOC -->

# Overview

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
    |       |   |   |   |   |-- FileNameInHandlerFolder.ts
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

# Get started

## Requirement
- Docker.
- Nodejs 18: Make sure you are using node 18. You can use `nvm` to switch between node versions easily. See: https://github.com/nvm-sh/nvm

## Installation
- `npm install`
- `npm run deploy:local` After deploy, you can invoke lambda function.
- `npm run start:local` Start ApiGateway

That all. We are ready to develop.

To deploy to AWS, add env files `.env.preprod` or `.env.prod`
- `npm run deploy:preprod`

OR

- `npm run deploy:prod`

## Alias import
Define alias import in `modules.json`:
```json
{
    "compilerOptions": {
        "paths": {
            "@VendorA_ModuleA1/*": ["src/app/extension/VendorA/ModuleA1/*"]
        }
    }
}
```

And use in the script:
```typescript
import TodoResourceModel from '@VendorA_ModuleA1/Model/ResourceModel/Todo'
```

## Create resources
By using Autoload from `serverless-dynamic-resources.js`. You can declare the resource in different modules.
The extension must be `.yml` in `Vendor/Module/Resources`. As an example:
```yaml
# src/app/extension/Vendor/Module/Resources/tbl_todo.yml
TBLTODO:
  Type: AWS::DynamoDB::Table
  Properties:
    TableName: tbl_todo
    AttributeDefinitions:
      - AttributeName: task_name
        AttributeType: S
    KeySchema:
      - AttributeName: task_name
        KeyType: HASH
    ProvisionedThroughput:
      ReadCapacityUnits: 1
      WriteCapacityUnits: 1
```

## Dependency Injection
This repository thoroughly uses the features of [tsyringe](https://github.com/Microsoft/tsyringe), a powerful library of Microsoft.

First, we have an interface:
```typescript
interface UserInterface {
    name: string
    setName(value: string): void
    getName(): string
}
```
And a service implement it:
```typescript
class UserService implements UserInterface {
    name: string = ''
    setName(value: string) {
        this.name = value
    }
    getName() {
        return 'Hello ' + this.name
    }
}
```
And we need to register them in the container. File name must be `di.ts` in `etc`: `Vendor/Module/etc/di.ts`

Note that `import 'reflect-metadata'` need to be at the top:
```typescript
// src/app/extension/Vendor/Module/etc/di.ts

import 'reflect-metadata' // Must have
import { container } from 'tsyringe'

container.register('UserInterface', { useClass: UserService })
```
Inject `Userservice` on another class:
```typescript
import 'reflect-metadata' // Must have
import { injectable, inject } from 'tsyringe'

@injectable()
export class Client {
    constructor(@inject('UserInterface') private user: UserInterface) {}

    setUser(name: string) {
        this.user.setName(name)
    }

    getUser() {
        return this.user.getName()
    }
}
```

Resolve it:
```typescript
import 'reflect-metadata' // Must have
import { getContainer } from '@Autoload'

const clientA = getContainer().resolve(Client)
clientA.setUser('Alice')

clientA.getUser() // Hello Alice
```

# Create a Lambda function
By using Autoload from `serverless-dynamic-functions.js`. You can declare the function in different modules.
File name must be `functions.yml` in `Vendor/Module/functions.yml`. As an example:
```yaml
# src/app/extension/Vendor/Module/functions.yml
FunctionName:
    handler: FileNameInHandlerFolder
    memorySize: 512
    timeout: 30
```
You don't need to care about handler path.
In the example above, you just need to declare Handler similar to the file in the `Handler` folder. Ex:`Vendor/Module/Handler/FileNameInHandlerFolder.ts`

```typescript
// src/app/extension/Vendor/Module/Handler/FileNameInHandlerFolder.ts
export default () => {
	// ...
}
```

# Create a Rest API
You need to declare a handler in `Vendor/Module/functions.yml`
```yaml
Vendor-Module-Api:
    handler: Api # Any name
    memorySize: 512
    timeout: 30
    events:
        - http:
            path: /{proxy+}
            method: ANY
            cors: true
            private: true
```
In `Vendor/Module/Handler/Api.ts`:
```typescript
// src/app/extension/Vendor/Module/Handler/Api.ts
import 'reflect-metadata' // Must have
import Server from '@Http/Server'
import { getRestApi } from '@Autoload'

// Autoload api from Api/Rest
export default Server(getRestApi(__dirname))
```
By using autoload in `src/app/Autoload.ts`. This function `getRestApi(__dirname)` will load all route in `Vendor/Module/Api/Rest`.
You must extend `@Http/AbstractApi`. Example:
```typescript
import AbstractApi from '@Http/AbstractApi'
import { Request } from 'express-serve-static-core'
import { inject, injectable } from 'tsyringe'
import { POST } from '@Http/Decorators/HttpMethod'
import Route from '@Http/Decorators/Route'
import TodoModel, { TodoInterface } from '@VendorA_ModuleA1/Model/Todo'

@POST
@Route('/todo/:anyparam')
@injectable()
export default class AddTodo extends AbstractApi {
    /**
     * Constructor
     */
    constructor(@inject('TodoModel') private todoModel: TodoModel) {
        super()
    }

    /**
     * Execute
     */
    async execute(req: Request<TodoInterface>) {
        const data = await this.todoModel.newTodo(req.body.task_name)
        return {
            data,
        }
    }
}
```

#### Method Decorator:
```text
@GET
@POST
@PUT
@DELETE
@PATCH
@HEAD
@OPTIONS
```

#### Route Decorator:
```text
@Route(url, [validator])
```

# AWS Policy
### Customer managed
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAll",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "cloudformation:ValidateTemplate",
        "sts:AssumeRole",
        "apigateway:DELETE",
        "apigateway:PUT",
        "apigateway:PATCH",
        "apigateway:POST",
        "apigateway:GET",
        "apigateway:UpdateRestApiPolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Cloudformation",
      "Effect": "Allow",
      "Action": [
        "cloudformation:DescribeStackResource",
        "cloudformation:DescribeStacks",
        "cloudformation:DeleteChangeSet",
        "cloudformation:CreateChangeSet",
        "cloudformation:DescribeChangeSet",
        "cloudformation:ExecuteChangeSet",
        "cloudformation:DescribeStackEvents",
        "cloudformation:ListStackResources",
        "cloudformation:DescribeStackResources"
      ],
      "Resource": [
        "arn:aws:cloudformation:ap-northeast-1:492135______:stack/demo-node-preprod/*"
      ]
    },
    {
      "Sid": "S3",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Lambda",
      "Effect": "Allow",
      "Action": [
        "lambda:GetFunction",
        "lambda:UpdateFunctionCode",
        "lambda:ListTags",
        "lambda:UntagResource",
        "lambda:ListVersionsByFunction",
        "lambda:TagResource",
        "lambda:PublishVersion"
      ],
      "Resource": [
        "arn:aws:lambda:ap-northeast-1:492135______:function:*"
      ]
    },
    {
      "Sid": "IAM",
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:CreateRole",
        "iam:DeleteRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRole"
      ],
      "Resource": [
        "arn:aws:iam::492135______:role/demo-node-preprod-*"
      ]
    },
    {
      "Sid": "Dynamodb",
      "Effect": "Allow",
      "Action": [
        "dynamodb:DescribeTable",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:492135______:table/*"
      ]
    }
  ]
}
```

# Important

### Package size

Lambda limits the size of the package to 250MB, including `node_modules`.
So, only add libraries that you "require" in the `src` folder to `dependencies` in `package.json`.
Libraries that are not used during runtime, put them in the `devDependencies` section.
This will reduce the size of the package. See `serverless.yml`:

```yaml
package:
    excludeDevDependencies: true
```

By remove unnecessary files in `package-patterns.yml`. After deploy to AWS, the package is just like this:
```text
|-- demo-node.zip (< 250MB)
|    |-- dist/ (compiled code)
|    |-- node_modules/
|    |-- package-lock.json
|    `-- package.json
|-- compiled-cloudformation-template.json
|-- ...
```
