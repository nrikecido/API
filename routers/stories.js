// Este está completo y funcionando
const express = require('express');
const router = express.Router();
const DB = require('../config/db');

// Ver todas las historias
router.get('/list', async (req, resp) => {

    const result = await DB.select(['userID', 'content', 'created'])
	.from('stories');

	resp.json({status: true, data: result});

});

// Ver historias de un amigo en concreto (hay que repasar este)
router.get('/friends/:id', async (req, resp) => {

    const result = await DB.select(['ID', 'content'])
	.from('stories')
	.join('friends')
	.where('userID', req.params.id)
	.andWhere('friends.accepted', 1)

	resp.json({status: true, data: result});
});

// Ver historia concreta
router.get('/:id', async (req, resp) =>  {

    const result = await DB.select(['ID', 'content', 'created'])
	.from('stories')
	.where('ID', req.params.id);

	resp.json({status: true, data: result});
});

// Publicar nueva historia
router.post('/', async (req, resp) => {

    try {
		const result = await DB('stories')
			.insert({
			userID: req.body.userID,
            content: req.body.content
		})
		console.log(result);
		
	} catch (error) {
		return resp.json({status: false, error: "Algo falló"});
	}

	return resp.json({status: true});

});

// Modificar una publicación

router.put('/:id', async (req, resp) => {
    const whitelist = ["content"];
	const ID = req.params.id;

	const toEdit = {};

	Object.keys(req.body).forEach(e => {
		if( whitelist.includes(e) ){
			toEdit[e] = req.body[e];
		}
	})

	const result = await DB('stories')
	.update(toEdit)
	.where('ID', ID);

	console.log(req.body);
	console.log(toEdit);
	console.log(result);

	resp.json({status:true});
});

// Borrar una publicación
router.delete('/:id', async (req, resp) => {

	const result = await DB('stories').delete().where('ID', req.params.id);

	resp.json({status:true});

});

module.exports = router;