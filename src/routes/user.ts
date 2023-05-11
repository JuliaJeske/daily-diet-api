import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { knex }from '../database'
import { z } from 'zod'
import { checkUserIdExist } from '../middleware/check-user-id-exist'


export async function userRoutes(app:FastifyInstance) {
  app.get('/meal',{
    preHandler: [checkUserIdExist], 
  }, async(req,reply) => {
    const { sessionId } = req.cookies
    const meals = await knex('userDiet').where({
      session_id: sessionId,
    }).select()
    return { meals }
  })

  app.get('/meal/:id',{
    preHandler: [checkUserIdExist], 
  },async (req) => {
    const getUserMealParamsSchema = z.object({
     id: z.string().uuid(),
    })
    const { sessionId } = req.cookies
    const { id } = getUserMealParamsSchema.parse(req.params)
    const meals = await knex('userDiet')
     .where({
       id,
       sessionId
     })
     .first()
   return { meals }
 })

 app.put('/meal/:id',{
  preHandler: [checkUserIdExist], 
} ,async(req,reply) => {
  const getUserMealParamsSchema = z.object({
    id: z.string().uuid(),
   })
   const { sessionId } = req.cookies
   const { id } = getUserMealParamsSchema.parse(req.params)
   const changes = req.body;
   const meals = await knex('userDiet')
   .where({
    id,
    sessionId
  }).update(changes)

  return reply.status(200).send()
 })

  app.post('/meal', async (req,reply) => {
    const createdUserMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.string(),
      isInsideDiet: z.enum(['sim', 'não'])
    })
    const { name, description, date, hour, isInsideDiet} = createdUserMealSchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/', 
        maxAge: 1000 * 60 * 60 * 24 * 7, 
      }) 
    }

    await knex('userDiet').insert({
      id: randomUUID(),
      name,
      description,
      date,
      hour,
      isInsideDiet,
      session_id: sessionId,
    })
 
    return reply.status(200).send()
  })

  app.get('/meal/metrics', {
    preHandler: [checkUserIdExist],
  }, async (req,reply) => {
    const { sessionId } = req.cookies
    const metrics = await knex('userDiet')
    .where('session_id', sessionId)
    .sum('name', {as: 'meals'})
    .first()

    return { metrics }
  })

  app.delete('/meal/:id', {
    preHandler: [checkUserIdExist], 
  },async (req,reply) => {
     const getUserMealParamsSchema = z.object({
      id: z.string().uuid(),
     })
     const { sessionId } = req.cookies
     const { id } = getUserMealParamsSchema.parse(req.params)
     await knex('userDiet')
      .where({
        id,
        sessionId
      })
      .delete()
    return reply.status(204).send()
  })
}