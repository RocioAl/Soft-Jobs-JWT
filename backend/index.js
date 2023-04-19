const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken")
const app = express()


app.use(express.json())
app.use(cors())

const { registrarUsuario, loginUsuario, obtenerDatos } = require('./consultas')

app.listen(3000, () => {
    console.log('Servidor up')
})

const reportarConsultas = async (req, res, next) => {
    const params = req.params
    const url = req.url
    console.log(`Hoy ${new Date()} se ha recibido una consulta en la ruta ${url} con los parametros:`, params)
    next()
}


app.post('/usuarios', reportarConsultas, async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body
        await registrarUsuario(email, password, rol, lenguage)
        res.send('Se ha registrado un nuevo usuario')
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})


app.post('/login', reportarConsultas, async (req, res) => {
    try {
        const { email, password } = req.body
        await loginUsuario(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

app.get('/usuarios', reportarConsultas, async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        const query = await obtenerDatos(email)
        res.json(query)
    }
    catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
})

