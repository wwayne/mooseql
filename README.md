<img src="https://cloud.githubusercontent.com/assets/5305874/18496120/e0d471bc-7a55-11e6-9172-19d2592a7edf.png" width = "260" height = "65"/>

[![Version](http://img.shields.io/npm/v/mooseql.svg)](https://www.npmjs.org/package/mooseql)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm download][download-image]][download-url]
[![Build Status](https://travis-ci.org/wwayne/mooseql.svg?branch=master)](https://travis-ci.org/wwayne/mooseql)
[![Coverage Status](https://coveralls.io/repos/github/wwayne/mooseql/badge.svg?branch=master)](https://coveralls.io/github/wwayne/mooseql?branch=master)

[download-image]: https://img.shields.io/npm/dm/mooseql.svg?style=flat-square
[download-url]: https://npmjs.org/package/mooseql
***

Both Graphql and Mongoose are aim for improving and simplifing the developing workflow, but it is verbose to use them together, you have to build repeated Graphql type based on Mongoose schema, create simple CRUD method for each model. MooseQL is created to glue Mongoose to Graphql for making everything to become easy again.

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
#### 3. That's it, you can use it now, let's using express + express-graphql for example
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

post('/graphql')
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
##### See we have a Mongoose schema for User model:

```
{
  name: {
    first: String,
    last: {
      fst: String,
      snd: Number
    }
  },
  userName: { type: String, required: [true, 'userName is required'] },
  age: Number,
  isBot: Boolean,
  birth: { type: Date, default: Date.now },
  binary: Buffer,
  info: Schema.Types.Mixed,
  hobbies: { type: [String], required: 'hobbies should have one at least' },
  currentSchool: { type: Schema.Types.ObjectId, ref: 'School' },
  education: [{ type: Schema.Types.ObjectId, ref: 'School' }]
}
```

#### You can query like this after using mooseql to generate the schema

```js
`user (
  	id: "${userInstance.id}"
	name_first: "wayne",
	userNames: ["wwayne01", "wwayne02"],
	age: 1,
	isBot: false,
	birth: "${new Date(2016, 8, 15)}",
	binary: "${new Buffer('wayne')}",
	hobbies: ["basketball"],
	currentSchool: "${schoolInstance.id}"
	education: ["${schoolInstance.id}"]
 ) {
   id
   name {
    first
   }
   currentSchool {
     id
     name
   }
   education {
   	 id
   }
 }`
```

#### Key points:

* Query by id or ids is available for every model
* You can query by plural of the attribute, e.g. `name -> names`
* If the attribute is plural, you can't query by its singular
* When you want to use an object as query arguments, use `_` to replace `.`, e.g.: `name.first` -> `name_first`
* Attribute of Mixed type is not supported to be query arguments
* The response is always an Array

## Mutation
#### Create
The mutation of create is `create{modelName}`, if the attribute of the model is defined as **required** in Mongoose shema, it is required as well for create mutaion. Using User model for example:

```js
`mutation createMyUser {
  user: createUser(
    userName: "wwayne",
    hobbies: ["This", "is", "Required"],
    currentSchool: "${schoolInstance.id}"
  ) {
    id
    userName
    currentSchool {
     id
    }
  }
}`
```

#### Update
The mutation of update is `update{modelName}`. Currently update only support single document update, which means the argument `id` is required and plural attribute can't be used as argument unless it is plural originally. For example, `userNames` is not supposed to be an argument, but `hobbies` and `education` could.

Using User model for example:

```js
`mutation updateMyUser {
  user: updateUser(
    id: "${userInstance.id}"
    userName: "wwayne"
  ) {
    id
    userName
  }
}`
```

#### Delete
The mutation of delete is `delete{modelName}`. Currently delete only support single document update, so it only accept `id` as argument.

The response is `{ success: {Bool}, msg: {String or null} }`

Using User model for example:

```js
`mutation deleteMyUser {
  result: deleteUser(
    id: "${userInstance.id}"
  ) {
    success
    msg
  }
}`
```

## Supported type
All Mongoose types are supported

* String
* Number
* Date
* Buffer
* Boolean
* Mixed (Can't be used as argument in query and mutation)
* ObjectId (Must be accompanied with `ref`)
* Array

In addition, the object type is supported as well, but you have to use `_` to replace `.` when using it as argument, because Graphql only support /.[a-z][A-Z][0-9]/ as name convention for the moment.
> Mongoose: name { first: { one: String, two: Number }, last: String }

```
user (
	name_first_one: "firstOne",
	name_first_two: 21,
	name_last: "nameLast"
) {
	id
}
```

## Extend schema
Mooseql will generate some basic CRUD methods which may not enough for you, then you need to define your own schema.

#### buildTypes
To make it easy, Mooseql exposes an method called `buildTypes` which used for converted Mongoose model to Graphql Type

```
import mooseql, { buildTypes } from 'mooseql'
```
#### Extend default schema
See you have two models `UserModel` and `SchoolModel`, you can extend schema like following:

```js
import mooseql, { buildTypes } from 'mooseql'

// typeMap = {User: GraphqlUserType, School: GraphqlSchoolType }
const typeMap = buildTypes([UserModel, SchoolModel])

const mySchema = mooseql([UserModel, SchoolModel], {
  mutation: {
    customAddUser: {
      type: typeMap['User'],
      args: {
        userName: { type: new GraphQLNonNull(GraphQLString) },
        hobbies: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        age: { type: new GraphQLNonNull(GraphQLFloat) }
      },
      resolve: async (_, args) => {
        const instance = new UserModel(args)
        return await instance.save()
      }
    }
  }
})

```
So it just pass `{ query: {Your custom queries}, mutation: {Your custom mutations} }` into `mooseql()` as the second argument. 

## Advanced usage
### Make use of context
In practice, we store the session in req.session or logged in user data in req.user, and it is usually passed to graphql as context. In this situation, you just need to add an option `context` in your Mongoose schema. Let's using **express + express-graphql + password + express-session** for example.

See you have a model named Article, the author is logged in user, so Mongoose schema may like the following:

```js
const articleSchema = new Schema({
	title: String,
	author: { 
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User',
		context: 'user.id'
	}
})
```
Since express-graphql will use `request` object as context if nothing set to context, and passport will set user object into `req.user`, express-session will use `req.session`. So your context is probably like 

```js
{ 
	user: userObject,
	session: sessionObject
}
```
That's why you set `context: 'user.id'` in your Mongoose schema, because the path `author` only store an ObjectId, so it only cares about `user.id` instead of the completed user object.

In this way, after user login, when you create an new article, you don't need to pass the autor as params even though it has been set to `required`, the author will be got from `req.user.id` automatically. The query string is like:

```js
`mutation create {
 article: createArticle (
 	title: "How to use graphql"
 ) {
 	id
 	title
 	author {
 		id
 		userName
 	}
 }
}`
```

## License
MIT