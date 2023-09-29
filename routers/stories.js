// Este está completo y funcionando
const express = require('express');
const router = express.Router();
const DB = require('../config/db');
const authtoken = require('../config/authtoken');


// Ver todas las historias
router.get('/list', [authtoken], async (req, resp) => {
	try {
	  const myID = req.user.ID;
		console.log(myID);
	  // Consulta para obtener las historias de tus amigos cuya amistad ha sido aceptada
	  const result = await DB.select(['stories.userID', 'stories.content', 'stories.created'])
		.from('stories')
		.join('friends', function () {
			this.on(function () {
			this.on('stories.userID', '=', 'friends.sendFriend')
				.orOn('stories.userID', '=', 'friends.acceptFriend');
			});
		})
		.where('friends.accepted', true)
		.andWhere(function () {
			this.where('friends.acceptFriend', myID)
			.orWhere('friends.sendFriend', myID);
		})
		.andWhereNot('stories.userID', myID); 
  
	  resp.json({ status: true, data: result });
	} catch (error) {
	  console.error(error);
	  resp.status(500).json({ status: false, message: 'Error en el servidor.' });
	}
});


// Ver historias de un amigo en concreto (hay que repasar este)
router.get('/friends/:id', [authtoken], async (req, resp) => {

	const myID = req.user.ID;
	const friendID = req.params.id;

    const result = await DB.select(['userID', 'content', 'created'])
	.from('stories')
	.where('userID', friendID)
	.andWhere('')

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