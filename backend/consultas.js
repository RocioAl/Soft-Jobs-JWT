const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({

    host: 'localhost',
    user: 'postgres',
    password: '123',
    database: 'softjobs',
    allowExitOnIdle: true
})

const registrarUsuario = async (email, password, rol, lenguaje) => {
    const query = 'INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)'
    const encryptedPassword = bcrypt.hashSync(password)
    const values = [email, encryptedPassword, rol, lenguaje]
    await pool.query(query, values)
}

const loginUsuario = async (email, password) => {
    const values = [email]
    const query = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(query, values)
    const { password: encryptedPassword } = usuario
    const correctPassword = bcrypt.compareSync(password, encryptedPassword)
    if (!correctPassword || !rowCount)
        throw { code: 401, message: "Contraseña incorrecta" }
}

const obtenerDatos = async (email) => {
    const query = "SELECT * FROM usuarios WHERE email = $1"
    const values = [email]
    const { rows: [usuario], rowCount } = await pool.query(query, values)

    if (!rowCount) {
        throw { code: 404, message: "Usuario incorrecto" }
    }
    delete usuario.password
    return usuario
}

module.exports = { registrarUsuario, loginUsuario, obtenerDatos }

