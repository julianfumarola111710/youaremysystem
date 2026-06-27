const express = require("express");
const router = express.Router();

const {
  crearStakeholder,
  obtenerTodos,
  obtenerClientes,
  obtenerProveedores,
  obtenerPorId,
  actualizarStakeholder,
  eliminarStakeholder,
} = require("../controllers/stakeholderController");

router.post("/", crearStakeholder);           
router.get("/", obtenerTodos);                

router.get("/clientes", obtenerClientes);     
router.get("/proveedores", obtenerProveedores); 

router.get("/:id", obtenerPorId);             
router.put("/:id", actualizarStakeholder);    
router.delete("/:id", eliminarStakeholder);   

module.exports = router;
