const fs = require("fs");
const validator = require("validator");
const path = require("path");
const { validarArticulo } = require("../helpers/validarParams");
const Articulo = require("../models/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    message: "Accion de Prueba Articulos",
  });
};

const productos = (req, res) => {
  return res.status(200).json({
    nombre: "Carlos",
    apellido: "Alcerro",
    dir: "ffbb",
  });
};

const guardar = (req, res) => {
  // RECOGER LOS DATOS POR POST PARA GUARDAR
  let parametros = req.body;
  console.log(parametros);

  // VALIDAR DATOS
  try {
    let validar_titulo =
      !validator.isEmpty(parametros.titulo) &&
      validator.isLength(parametros.titulo, { min: 5, max: undefined });
    let validar_contenido =
      !validator.isEmpty(parametros.contenido) &&
      validator.isLength(parametros.contenido, { min: 10, max: undefined });

    if (!validar_titulo || !validar_contenido) {
      throw new Error("No se ha validado la informacion");
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Hubo un error en los datos",
    });
  }

  // CREAR EL OBJETO A GUARDAR
  const articulo = new Articulo(parametros);

  // GUARDAR ARTICULO EN LA BASE DE DATOS
  articulo
    .save()
    .then((articuloGuardado) => {
      return res.status(200).json({
        status: "exito",
        articulo: articuloGuardado,
      });
    })
    .catch((error) => {
      console.error("Error al guardar el artículo:", error);
      res.status(400).json({
        status: "error",
        message: "No se ha guardado el Articulo",
      });
    });
};

const listarArticulos = async (req, res) => {
  try {
    const { num } = req.params;
    const articulos = await Articulo.find({})
      .limit(num)
      .sort({ fecha: -1 })
      .exec();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No se pudo encontrar artículos",
      });
    }

    return res.status(200).json({
      status: "Exito",
      articulos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al procesar la solicitud",
    });
  }
};

const unArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const articulo = await Articulo.findOne({ _id: id }).exec();
    if (!articulo) {
      return res.status(404).json({
        status: "error",
        message: "No se encontro el articulo",
      });
    }
    return res.status(200).json({
      ststus: "Exito",
      articulo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "No se pudo encontrar el articulo",
    });
  }
};

const eliminarArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const articulo = Articulo.deleteOne({ _id: id }).exec();
    if (!articulo) {
      return res.status(404).json({
        status: "Error",
        message: "Articulo no encontrado",
      });
    }
    return res.status(200).json({
      status: "Exito",
      message: "Articulo eliminado con Exitos",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "No se pudo realizar la solicitud",
    });
  }
};

const actualizarArticulo = async (req, res) => {
  try {
    const { id } = req.params;
    const parametros = req.body;

    try {
      validarArticulo(parametros);
    } catch (error) {
      return res.status(400).json({
        status: "Error",
        message: "Faltan datos por enviar",
      });
    }

    const articuloActualizado = await Articulo.findOneAndUpdate(
      { _id: id },
      parametros,
      { new: true, runValidators: true }
    ).exec();
    if (!articuloActualizado) {
      return res.status(404).json({
        status: "Error",
        message: "No se pudo actualizar",
      });
    }
    return res.status(200).json({
      status: "Exito",
      articuloActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Error",
      message: "No se pudo realizar esta peticion",
    });
  }
};

const subirImagen = async (req, res) => {
  //CONFIGURAR MULTER

  //RECOGER EL FICHERO DE IMAGEN SUBIDO
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "Error",
      message: "Peticion Invalida",
    });
  }

  //NOMBRE DEL ARCHIVO
  let nombreArchivo = req.file.originalname;

  //EXTENSION DEL ARCHIVO
  let archivo_Split = nombreArchivo.split(".");
  let archivoExtension = archivo_Split[1];

  //COMPROBAR EXTENSION CORRECTA
  if (
    archivoExtension != "jpg" &&
    archivoExtension != "jpeg" &&
    archivoExtension != "png"
  ) {
    //BORRAR ARCHIVO Y DAR RESPUESTA
    fs.unlink(req.file.path, (error) => {
      console.log(error);
      return res.status(400).json({
        status: "Error",
        message: "Arhcivo Invalido",
      });
    });
  } else {
    try {
      const { id } = req.params;

      const articuloActualizado = await Articulo.findOneAndUpdate(
        { _id: id },
        { image: req.file.filename },
        { new: true, runValidators: true }
      ).exec();
      if (!articuloActualizado) {
        return res.status(404).json({
          status: "Error",
          message: "No se pudo actualizar",
        });
      }
      return res.status(200).json({
        status: "Exito",
        articuloActualizado,
        fichero: req.file,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "Error",
        message: "No se pudo realizar esta peticion",
      });
    }
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;
  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        message: "La imagen no existe",
        existe,
        fichero,
        ruta_fisica,
      });
    }
  });
};

const Buscador = async (req, res) => {
  try {
    // SACAR EL STRING DE BUSQUEDA
    const { busqueda } = req.params;

    // find OR
    const articulosEncontrados = await Articulo.find({
      $or: [
        { titulo: { $regex: busqueda, $options: "i" } },
        { contenido: { $regex: busqueda, $options: "i" } },
      ],
    })
      .sort({ fecha: -1 })
      .exec();
    if (!articulosEncontrados || articulosEncontrados.length <= 0) {
      return res.status(404).json({
        status: "Error",
        message: "Busqueda sin exito",
      });
    }

    // DEVOLVER RESULTADO
    return res.status(200).json({
      status: "Exit",
      articulosEncontrados,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error en la búsqueda",
    });
  }
};

module.exports = {
  prueba,
  productos,
  guardar,
  listarArticulos,
  unArticulo,
  eliminarArticulo,
  actualizarArticulo,
  subirImagen,
  imagen,
  Buscador,
};
