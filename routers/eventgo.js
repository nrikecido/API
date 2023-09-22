// Este está completo y funcionando
const express = require('express');
const router = express.Router();
const DB = require('../config/db');

// Apuntarse a un evento
router.post('/:id', async (req, resp) => {
	try {
		const result = await DB('eventgo').insert({
			eventID:  req.body.eventID,
			userID: req.body.userID
		})
		console.log(result);
	} catch (error) {
		return resp.json({status: false, error: "Algo falló"});
	}
	return resp.json({status: true});
});

// Borrarse de un evento
router.delete('/:id', async (req, resp) => {
	const result = await DB('eventgo').delete().where('ID', req.params.id);
	resp.json({status:true});
});

module.exports = router;