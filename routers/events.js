// Este está completo y funcionando
const express = require('express');
const router = express.Router();
const DB = require('../config/db');

// Obtener lista de eventos
router.get('/list', async (req, resp) => {

	const result = await DB.select(['title',])
	.from('events');

	resp.json({status: true, data: result});

});

// Obtener un evento en concreto
router.get('/:id', async (req, resp) => {

	const result = await DB.select(['title', 'description', 'created'])
	.from('events')
	.where('id', req.params.id);

	resp.json({status: true, data: result});

});

// Crear nuevo evento
router.post('/', async (req, resp) => {
	try {
		const result = await DB('events')
			.insert({
			userID:  req.body.userID,
			title: req.body.title,
			description:  req.body.description,
			date:  req.body.date,
			duration: req.body.duration,
			needed: req.body.needed,
            capacity: req.body.capacity,
            GPS: req.body.GPS,
            valoration: 0 // ¿valor por defecto?
        })
		console.log(result);
	} catch (error) {
		return resp.json({status: false, error: "Algo falló"});
	}
	return resp.json({status: true});
});

// Modificar un evento
router.put('/:id', async (req, resp) => {

	const whitelist = ["title", "description", "date", "duration", "needed", "capacity", "GPS", "valoration"];
	const ID = req.params.id;

	const toEdit = {};

	Object.keys(req.body).forEach(e => {
		if( whitelist.includes(e) ){
			toEdit[e] = req.body[e];
		}
	})

	const result = await DB('events')
	.update(toEdit)
	.where('ID', ID);

	console.log(req.body);
	console.log(toEdit);
	console.log(result);

	resp.json({status:true});
});

// Eliminar un evento
router.delete('/:id', async (req, resp) => {

	const result = await DB('events')
	.delete()
	.where('ID', req.params.id);

	resp.json({status:true});
});

module.exports = router;
