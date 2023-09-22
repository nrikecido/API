// Este está completo y funcionando
const express = require('express');
const router = express.Router();
const DB = require('../config/db');

// Obtener comentarios de una historia en concreto
router.get('/stories/:id', async (req, resp) => {

    const result = await DB.select(['userID','content', 'created'])
	.from('comments')
	.where('storyID', req.params.id);

	resp.json({status: true, data: result});
});

// Obtener comentario en concreto
router.get('/:id', async (req, resp) => {

    const result = await DB.select(['userID','content', 'created'])
	.from('comments')
	.where('ID', req.params.id);

	resp.json({status: true, data: result});
});


// Publicar nuevo comentario
router.post('/:id/', async (req, resp) => {

    try {

		const result = await DB('comments')
			.insert({
			storyID: req.body.storyID,
            userID: req.body.userID,
            content: req.body.content
		})
		console.log(result);
		
	} catch (error) {
		return resp.json({status: false, error: "Algo falló"});
	}
	return resp.json({status: true});
});

// Modificar comentario
router.put('/:id', async (req, resp) => {

	const whitelist = ["content"];
	const ID = req.params.id;

	const toEdit = {};

	Object.keys(req.body).forEach(e => {
		if( whitelist.includes(e) ){
			toEdit[e] = req.body[e];
		}
	})

	const result = await DB('comments')
	.update('content')
	.where('ID', ID);

	console.log(req.body);
	console.log(toEdit);
	console.log(result);

	resp.json({status:true});

});

// eliminar comentario
router.delete('/:id', async (req, resp) => {

	const result = await DB('comments')
	.delete()
	.where('ID', req.params.id);

	resp.json({status:true});

});

module.exports = router;