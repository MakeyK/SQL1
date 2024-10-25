const express = require("express")
require("dotenv").config()
const sequelize = require("./database")
const cors = require('cors')
const {DataTypes} = require("sequelize")
const http = require('http')
const HOST=process.env.HOST
const PORT = process.env.PORT
const app = express()
const server = http.createServer(app)

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
  });
app.use(cors())
app.use(express.json())


const User = sequelize.define('users',{
    id_user: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nickname: {type: DataTypes.STRING, unique: true},
    email: {type: DataTypes.STRING, allowNull: true, unique: true},
    password: {type: DataTypes.STRING, allowNull:true},
    role: {type: DataTypes.STRING, defaultValue: "user"},
    path_avatar: {type: DataTypes.STRING}
})
const FootballTeam = sequelize.define('football_team', {
    id_footballteam: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name_team: {type: DataTypes.STRING, allowNull: true},
    coach: {type: DataTypes.STRING},
    location: {type: DataTypes.STRING},
    stadion: {type: DataTypes.STRING},
    liga: {type: DataTypes.STRING},
    trofei: {type: DataTypes.STRING}
})



// Создание записи
app.post('/create', async(req, res) => {
    const {login, password} = req.body
    const user = await User.create({login, password})
    res.json(user)
   })
// Запрос на вывод всех данных из таблицы users, 
// где id передается через query. в этом запросе ограничена возможность SQL-инъекций с помощью встроенной в sequelize функции .findOne()

   app.get('/getid', async(req, res) =>{
       const id_user = req.query.id_user
       const user = await sequelize.query(`SELECT * FROM users WHERE id_user=${id_user}`);
       return res.json(user[0])
    })
       
// Создание записи
app.post('/createfb', async(req, res) => {
    const {name_team, coach, location, stadion, liga, trofei} = req.body
    const football = await FootballTeam.create({name_team, coach, location, stadion, liga, trofei})
    res.json(football)
   })

// Запрос на вывод всех данных из таблицы football_teams, где id_footballteam передается через query. в этом запросе присутствует SQL-уязвимость
   app.get('/getidfb', async(req, res) =>{
    const id_footballteam = req.query.id_footballteam
    const football = await sequelize.query(`SELECT * FROM football_teams WHERE id_footballteam=${id_footballteam}`);
    return res.json(football[0])
})



const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, HOST, () => console.log(`Сервер работает на ${HOST}:${PORT}`))
    }
    catch(e){
        console.log(e)
    }
}

start()