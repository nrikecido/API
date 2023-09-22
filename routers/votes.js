// Este está completo y funcionando
const express = require('express');
const router = express.Router();
const DB = require('../config/db');

//Votar un evento
router.post('/:id', async (req, resp) => {
	try {
		const result = await DB('votes').insert({
			eventID: req.body.eventID,
			userID:  req.body.userID,
            valoration: req.body.valoration
		})
		console.log(result);
	} catch (error) {
		return resp.json({status: false, error: "Algo falló"});
	}
	return resp.json({status: true});
});

// Obtener votos totales de un evento
router.get('/:id', async (req, resp) => {
	const eventId = req.params.id;
	const result = await DB.select(DB.raw('AVG(valoration) as average_valoration'))
	.from('events')
	.where('ID', eventId);
  
	if (result.length === 0) {
	  resp.json({ status: false, message: 'Evento no encontrado' });
	  return;
	}
	const averageValoration = result[0].average_valoration;
	resp.json({ status: true, averageValoration });
  });
  

module.exports = router;