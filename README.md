<img src="https://cloud.githubusercontent.com/assets/5305874/18496120/e0d471bc-7a55-11e6-9172-19d2592a7edf.png" width = "260" height = "65"/>

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

***

Both Graphql and Mongoose are aim for improving and simplifing the developing workflow, but it is verbose to use them together, you have to build repeated Graphql type based on Mongoose schema, creat simple CRUD method for each model. MooseQL is created to glue Mongoose to Graphql for making everything to become easy again.

## Installation
> npm install mongoose --save


## Getting Started
#### 1. Creating Mongoose model as usual
```js
import mongoose, { Schema } from 'mongoose'
const userSchema = new Schema({
  name: {
    first: { type: String, required: 'first name required' },
    last: String
  },
  school: { type: Schema.Types.ObjectId, ref: 'School' }
})
export const UserModel = mongoose.model('User', userSchema)
```

#### 2. Passing model to MooseQL to get GraphQL schema
```js
import mooseql from 'mooseql'
const mySchema = mooseql([UserModel])
```
#### 3. That's it, using express + express-graphql for example
> Server side

```js
import express from 'express'
import graphqlHTTP from 'express-graphql'

const app = express()
app.use('/graphql', graphqlHTTP({
	schema: mySchema
}))
app.listen(3000)
```
> Client side

```js
- Create a new user

post('/graphql)
 .send({
   query: `mutation create {
     user: createUser(
       name_first: "wwayne"
       school: school.id
     ) {
      id,
      name { 
        first,
        last
      },
      school {
        id,
        schoolName
      }
     }
   }`
 })
```

## Query
## Mutation
## Supported type
## Extend schema
## License
MIT