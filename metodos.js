const {
  insertarProducto,
  createTable,
  getProductos,
  dbDelete,
  updateRow,
} = require("./productosDB/crudPRODUCTOS.js");

class metodos {
  constructor(id, req) {
    this.idToSearch = id;
    this.productos = require("./productosDB/db.js");
    this.newReq = req;
  }

  async listar() {
    await createTable().then(() =>
      getProductos().then((data) => (this.productos = data))
    );
    if (this.productos.length == 0) {
      return "tabla vacia";
    } else {
      console.log(this.productos);
      return this.productos
    }
  }

  async listarPorId() {
    await createTable().then(() =>
      getProductos().then((data) => (this.productos = data))
    );
    let thisProduct = this.productos.find(
      (productos) => productos.id == this.idToSearch
    );
    console.log(thisProduct);
    return thisProduct || "nose encontro producto";
  }
  async guardar() {
    await insertarProducto(this.newReq).catch((e) => console.log(e));
    return;
  }
  async actualizar() {
    await createTable().then(() =>
      getProductos().then((data) => (this.productos = data))
    );
    let thisProduct = await this.productos.find(
      (productos) => productos.id == this.idToSearch
    );
    if (!thisProduct) {
      return json({ msg: "prod no encontrad" });
    }
    thisProduct.tittle = this.newReq.tittle || thisProduct.tittle;
    thisProduct.price = this.newReq.price || thisProduct.price;
    thisProduct.thumbail = this.newReq.thumbail || thisProduct.thumbail;
    await updateRow(this.idToSearch, thisProduct);
    return 201;
  }
  borrar() {
    if (this.productos.length !== 0) {
      if (this.idToSearch == undefined) {
        dbDelete();
        return 201;
      } else {
        dbDelete(this.idToSearch);
        return 201;
      }
    } else {
      return "no hay productos para borrar";
    }
  }
}
module.exports = metodos;
