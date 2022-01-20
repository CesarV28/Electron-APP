const { Sequelize, Op } = require('sequelize');
const { db } = require('../src/database');


const Testimonial = db.define('testimoniales', {
    nombre: {
        type: Sequelize.STRING
    },
    correo: {
        type: Sequelize.STRING
    },
    mensaje: {
        type: Sequelize.STRING
    },
});

module.exports = {
    Testimonial,
    Op
}