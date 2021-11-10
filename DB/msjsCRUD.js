const { options } = require("../options/sqlite3.js");
const knex = require("knex")(options);

const createMSJsTable = async (cb) => {
  await knex.schema
    .createTable("mensajes", (table) => {
      table.increments(),
        table.string("autor"),
        table.string("texto"),
        table.timestamp("date").defaultTo(knex.fn.now());
    })
    .then(() => {
      insertarMsjs({
        autor:'from Server',
        texto:'Hola a todes',
        date: new Date()
      })
      return console.log("tabla creada!");
    })
    .catch((e) => {
      if (e.errno == 1050) {
        console.log("la tbla ya existia y la cargamos");
        return cb;
      } else {
        console.log("otro error");
      }
    });
};

const getMsjs = async () => {
  let aux = [];
  await knex
    .from("mensajes")
    .select("*")
    .then((mensajesFromDB) => {
      for (mensaje of mensajesFromDB) {
        aux = [
          ...aux,
          {
            autor: mensaje["autor"],
            texto: mensaje["texto"],
            date: mensaje["date"]
          },
        ];
      }
      return null;
    });
  return aux;
};

const insertarMsjs = async (mensaje) => {
  await knex("mensajes")
    .insert(mensaje)
    .then(() => {
      console.log("MSJ insertado");
    })
    .catch((e) => {
      console.log(e);
      knex.destroy();
    });
  return 201;
};

module.exports = { getMsjs, insertarMsjs, createMSJsTable };
