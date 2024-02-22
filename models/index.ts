import {Sequelize, DataTypes} from 'sequelize-cockroachdb';

const sequelize = new Sequelize({
    database: 'defaultdb',
    dialect: 'postgres',
    port: 26257,
    password: 'cockroach',
    username: 'cockroach'
});

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    birthday: DataTypes.DATE,
});



// sequelize.sync()
//     .then(() => User.create({
//         username: 'janedoe',
//         birthday: new Date(1980, 6, 20)
//     }))
//     .then(jane => {
//         console.log(jane.toJSON());
//     });



// create a sequalize model for typscript which stores a string ID and
// a 1536 dimensional vector
