const express = require('express');
const app = express();
const port = 3000;

app.use( express.json() );

// Inicia los routers para cada una de las rutas API
	app.use('/users', require('./routers/users'));
	app.use('/friends', require('./routers/friends'));
	app.use('/stories', require('./routers/stories'));
	app.use('/messages', require('./routers/messages'));
	app.use('/votes', require('./routers/votes'));
	app.use('/events', require('./routers/events'));
	app.use('/eventgo', require('./routers/eventgo'));
	app.use('/comments', require('./routers/comments'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Hubo un error en el servidor.');
});


// Ruta de prueba
app.get('/', (req, resp) => {
    resp.send('Hola mundo');
});

app.listen(port, () => {
    console.log('Estoy escuchando por el puerto ' + port);
});
