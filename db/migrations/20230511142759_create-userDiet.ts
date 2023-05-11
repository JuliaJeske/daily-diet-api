import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('userDiet', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').after('id').index()
    table.text('name').notNullable()
    table.text('description')
    table.date('date').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('hour').defaultTo(knex.fn.now()).notNullable()
    table.text('isInsideDiet').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('userDiet')
}

