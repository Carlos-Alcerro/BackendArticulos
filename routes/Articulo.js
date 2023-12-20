
const express = require("express")
const multer = require("multer")
//INDICAR EN QUE CARPETA SE VAN A GUARDAAR LAS IMAGENES
const almacenamiento = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,"./imagenes/articulos/")
    },

    filename:(req,file,cb)=>{
        cb(null,"articulo"+Date.now()+file.originalname)

    }
})

const subidas = multer({storage:almacenamiento})

const router = express.Router()
const { prueba,productos,guardar,listarArticulos,unArticulo,eliminarArticulo,actualizarArticulo,subirImagen,imagen,Buscador } = require("../controllers/Articulo")
const app = express()

router.get("/prueba",prueba)
router.get("/productos",productos)
//RUTAS USADAS
router.post("/productos",guardar)
//EL "?" SIGNIFICA QUE EL PARAMETRO NO ES OBLIGATORIO
router.get("/articulos/:num?",listarArticulos)
router.get("/articulo/:id",unArticulo)
router.delete("/articulo/:id",eliminarArticulo)
router.put("/articulo/:id",actualizarArticulo)
router.post("/subir-imagen/:id",[subidas.single("file")],subirImagen)
router.get("/imagen/:fichero",imagen)
router.get("/buscar/:busqueda",Buscador)

module.exports=router;