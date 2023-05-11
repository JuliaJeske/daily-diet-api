import fastify from "fastify";
import cookie from '@fastify/cookie'

const app = fastify()

import { userRoutes } from './routes/user'
import {knex} from "./database";

app.register(cookie)

app.register(userRoutes, {
  prefix: 'user',
})



app.listen({
  port: 3333,
}).then(() => {
  console.log('server running...')
})