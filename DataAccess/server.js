//'use strict';
//var http = require('http');
//var port = process.env.port || 1337;

//http.createServer(function (req, res) {
//    //res.writeHead(200, { 'Content-Type': 'text/plain' });
//   // res.end('Hello World\n');

//    const Sequelize = require('sequelize');
//    const sequelize = new Sequelize('soda_dev', 'root', 'mysql', {
//        host: '127.0.0.1',
//        dialect: 'mysql',
//        operatorsAliases: false,

//        pool: {
//            max: 5,
//            min: 0,
//            acquire: 30000,
//            idle: 10000
//        },

//        // SQLite only
//       // storage: 'path/to/database.sqlite'
//    });

//    sequelize.authenticate()
//    .then(() => {
//      console.log('Connection has been established successfully.');
//  })
//  .catch(err => {
//      console.error('Unable to connect to the database:', err);
//  });

//}).listen(port);

'use strict';
var http = require('http');
var port = process.env.port || 1337;
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/Config/config.json')[env];
const db = {};
var sequelize = new Sequelize(config.database, config.username, config.password, config);
http.createServer(function (req, res) {
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} //else {
 //   sequelize = new Sequelize(config.database, config.username, config.password, config);
//}

fs
  .readdirSync(__dirname)
  .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
      const model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize
		.authenticate()
		.then(() => {
		    console.log('Connection has been established successfully.');
		})
		.catch((err) => {
		    console.log('Unable to connect to the database:', err);
		});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models such that I can use them in the api just by importing 'db'
//db.user = require('./user')(sequelize, Sequelize);
//db.admin = require('./admin')(sequelize, Sequelize);
    //db.articles = require('./articles')(sequelize, Sequelize);

//const Medium = sequelize
//.query('CALL SoDa_GetMedium ()',
//    { })
    //.then(v=>console.log(v[0].mediumtype));


   // const Medium = sequelize
   // .query('CALL SoDa_GetMedium ()',
   //     {});
   //Medium.(x=>console.log(x.name));
   // //Medium.findOne({ where: { mediumtype: 'Water' } }).then(p => {
     
   // //    console.log(p.mediumtype) // 'jane'

        
   // //})

//const project = Project.build({
//    title: 'Water',
//    description: 'woot woot. this will make me a rich man'
//})
    
//projectfindOne({ where: { title: 'Water' } }).then(p => {
//    console.log(p.description) // 'jane'
    //        });

//const Project = sequelize.define('Project', {
//    title: Sequelize.STRING,
//    description: Sequelize.TEXT
//})
//Project.sync();

//var Task = sequelize.define('Task', {
//    title: Sequelize.STRING,
//    description: Sequelize.TEXT,
//    deadline: Sequelize.DATE
//})

//Project.create({ title: '123', description: 'omnomnom' });
    const Project = sequelize.define('Projects', { title: Sequelize.STRING, description: Sequelize.TEXT });
    const Users = sequelize.define('Users', { name: Sequelize.STRING });
    const UsersProject = sequelize.define('Users_Projects', { users_id: Sequelize.INTEGER, project_id: Sequelize.INTEGER });

//Project.findOne({
//    where: { title: 'fnord' },
//    attributes: ['id', ['title', 'description']]
//}).then(project => {
//    console.log("Found")
//    console.log(project.description)
//})
    //Project.belongsTo(UsersProject, {        
    //    as: 'Id',
    //    foreignKey: 'project_id'
    //});
    //UsersProject.hasMany(Project);
    //Users.belongsTo(UsersProject, {      
    //    as: 'Id',
    //    foreignKey: 'users_id'
    //});
    //UsersProject.hasMany(Users);

    //Project.belongsToMany(UsersProject, {    
    //    keys : 'id',
    //    through: {
    //       // model: UsersProject
    //        model: Users,
    //        foreignKey: 'project_id'
    //    }
    //})

    //Users.belongsToMany(UsersProject, {  
    //    keys: 'id',
    //    through: {
    //        // model: UsersProject
    //        model: Project,
    //        foreignKey: 'users_id'
    //    }
    //})
    //Project.hasMany(Users, { foreignKey: 'users_id' })
    Project.belongsTo(UsersProject);
    Project.hasMany(UsersProject, { as: 'UsersProject', foreignKey: 'project_id', constraints: false } );
    Users.belongsTo(UsersProject);
    Users.hasMany(UsersProject, { as: 'UsersProject', foreignKey: 'users_id', constraints: false });

  

    Project.findOne({
        where: { title: 'fnord' },
        attributes: ['id', ['title', 'description']],
        include: [
            { model: UsersProject, as: 'UsersProject', attributes: ['users_id', 'project_id']}, 
        ]
    }).then(project => {
        console.log(project.UsersProject.users_id)
        console.log(project.description)
    })
  
   

    //Project.findOne({
    //    where: { title: 'fnord' },
    //    attributes: ['id', ['title', 'description']],
    //    include: [{ model: Users, as: 'secondaryUsers' }]
    //}).then(project => {
    //    console.log("Found")
    //    console.log(project.description)
    //})
    //Project.hasMany(Users, { foreignKey: 'users_id' })

    //UsersProject.belongsTo(Project, {
    //    as: 'id',
    //    foreignKey: 'users_id'
    //})


    //User.findOne({
    //    where: {
    //        id: request.user.id
    //    },
    //    attributes: [
    //        'id',
    //        'name'
    //    ],
    //    include: [{
    //        model: Users,
    //        where: {},
    //        attributes: [
    //            'id'
    //        ],
    //        as: 'rats',
    //        include: [{
    //            model: Project,
    //            where: {},
    //            attributes: [
    //                'id'
    //            ]
    //        }]
    //    }]
    //})


for (var i = 0; i < 10; i++) {
    console.log(i)
}
console.log(i)

////for (let A = 0; A < 10; A++) {
////    console.log(A)
////}
////console.log(A)


//var i
//i = 34
//for (let i = 0; i < 4; i++) {
//    console.log(i)
//}
//console.log(i)

module.exports = db;
}).listen(port);