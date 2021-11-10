const { options } = require("../options/mariaDB.js");
const knex = require("knex")(options);

const createTable = async (cb) => {
  await knex.schema
    .createTable("productos", (table) => {
      table.increments(), table.string("tittle"), table.integer("price");
      table.string("thumbail");
    })
    .then(() => {
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

const getProductos = async () => {
  let aux = [];
  await knex
    .from("productos")
    .select("*")
    .then((productosFromDB) => {
      for (prod of productosFromDB) {
        aux = [
          ...aux,
          {
            id: prod["id"],
            tittle: prod["tittle"],
            price: prod["price"],
            thumbail: prod["thumbail"],
          },
        ];
      }
      return null;
    });
  return aux;
};

const insertarProducto = async (productos) => {
  console.log(productos);
  await knex("productos")
    .insert(productos)
    .then(() => {
      console.log("insertado");
    })
    .catch((e) => {
      console.log(e);
      knex.destroy();
    });
  return 201;
};
const updateRow = async(id,object) => {

  await knex.from("productos").where('id','=',id).update({tittle:object.tittle , price:object.price, thumbail:object.thumbail});
}

const dbDelete = async (id = undefined) => {
  if (id == undefined) {
    await knex.from("productos").del();
    return console.log(`Productos borrados`);
  }
  await knex.from("productos").del().where("id", id);
  return console.log(`Producto borrado`);
};

module.exports = { createTable, dbDelete, getProductos, insertarProducto,updateRow };
