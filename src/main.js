const { BrowserWindow, ipcMain } = require('electron');
const { Testimonial, Op } = require('../models/Testimonial');

let win;

const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
      }
    });
  
    win.loadFile('src/ui/index.html');
}

// Catch user:add
ipcMain.on('testimonial:add', async (e, item) => {
    
    try {
        const { nombre, correo, mensaje } = item;

        await Testimonial.create({
            nombre,
            correo,
            mensaje
        });
        e.reply('testimonial:created', JSON.stringify(item));
        win.webContents.send('testimonial:add', item);
    } catch (error) {
        console.log(error)
    }
});

ipcMain.on('testimonial:get', async (e, args) => {
    const testimoniales = await Testimonial.findAll();
    e.reply('testimonial:get', JSON.stringify(testimoniales));
});

ipcMain.on('nombre:find', async (e, args) => {

    const query = await Testimonial.findAll( {
        where: { nombre: { [Op.like]: `%${args}%`} }
    });
    e.reply('testimonial:get', JSON.stringify(query));
});

ipcMain.on('test:find', async (e, args) => {

        const query = await Testimonial.findOne({
            where: { id: args }
        });
        e.reply('test:find', JSON.stringify(query));
 
});

ipcMain.on('test:edit', async (e, args) => {

    try {
        const { id, ...rest} = args;
    
        const query = await Testimonial.update( rest , {
            where: {
                id: id
            }
        });

        e.reply('test:edit-success', JSON.stringify(query));

    } catch (error) {
        console.log(error);
    }

});

module.exports = {
    createWindow
}
