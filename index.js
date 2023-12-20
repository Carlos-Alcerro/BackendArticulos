const {connection} = require("./database/connection")
const express = require("express")
const cors = require("cors")

connection()

//CREAR SERVIDOR DE NODE
const app = express()

const puerto = 3000;

//CONFIGURAR CORS
app.use(cors())

//CONVERTIR BODY A OBJETO JS
app.use(express.json())

app.use(express.urlencoded({extended:true})) //FORM URL-ENCODED 

//RUTAS 
const rutas_articulo = require('./routes/Articulo')

//CARGO LAS RUTAS
app.use('/api',rutas_articulo)

//CREAR RUTAS PRUEBA
app.get('/Probando',(req,res)=>{
    res.status(200).send(`
        <div>
            <h1>Probando con Send</h1>
            <p>Si sirve</p>
        </div>
    `)
})


//CREAR SERVIDOR Y ESCUCHAR PETICIONES
app.listen(puerto,()=>{
    console.log("SERVIDOR CORRIENDO EN EL PUERTO",puerto);
})