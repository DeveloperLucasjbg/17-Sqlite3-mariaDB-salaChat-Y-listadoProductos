const express = require("express");
const metodos = require("./metodos");
const { urlencoded } = require("express");

const { getProductos, createTable } = require("./productosDB/crudPRODUCTOS.js");
const { getMsjs, insertarMsjs, createMSJsTable } = require("./DB/msjsCRUD.js");

const app = express();
const PORT = 3333;
const router = express.Router();

const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/api", router);

//ceate table If err table exist => callback select *
let productos = require("./productosDB/db.js");
createTable().then(() => getProductos().then((data) => (productos = data)));

//rutes
router.get("/productos/listar", async (_, res) => {
  await res.json(new metodos(null, null).listar());
});
router.get("/productos/listar/:id", async (req, res) => {
  const { id } = req.params;
  await res.json(new metodos(id, null).listarPorId());
});
router.post("/productos/guardar", async (req, res) => {
  await res.json(new metodos(null, req.body).guardar());
  console.log("productos guardados");
});
router.put("/productos/actualizar/:id", (req, res) => {
  const { id } = req.params;
  res.json(new metodos(id, req.body).actualizar());
});
router.delete("/productos/borrar/:id?", (req, res) => {
  const { id } = req.params;
  res.json((productos = new metodos(id, req.body).borrar()));
});

//listen port
http.listen(PORT, () => {
  console.log("escuchando el servidor", http.address().port);
});
// set engine
app.set("view engine", "ejs");
// RUTA VISTA
router.get("/productos/vista", (_, res) => {
  res.render("pages/", (products = new metodos(null, null).listar()));
});

// sokets //
//ceate table If err exist => callback select *
let mensajes = require("./DB/mensajesDB.js");
createMSJsTable().then(() => getMsjs().then((data) => (mensajes = data)));

io.on("connection", async (socket) => {
  console.log("cliente conectado");
  await io.sockets.emit("mensajes", mensajes); // emit mensajes
  await io.sockets.emit("PRODUCTOS", productos); //  emit productos

  // productos In
  socket.on("productIn", async(newP) => {
    await new metodos(null, newP, productos)
      .guardar().then(()=> getProductos().then((data) => (productos = data)))
      .then(() => io.sockets.emit("PRODUCTOS", productos));
  });
  // Msjs In
  socket.on("newMsj", async(data) => {
   await insertarMsjs(data)
      .then(() => getMsjs().then((data) => (mensajes = data)))
      .then(() => io.sockets.emit("mensajes", mensajes));
  });
});
