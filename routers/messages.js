// Este está completo y funcionando
const express = require('express');
const router = express.Router();
const DB = require('../config/db');

// Obtener lista de mensajes
router.get('/list', async (req, resp) => {
    const result = await DB.select(['senderID', 'receiverID', 'content'])
    .from('messages');
	resp.json({status: true, data: result});
});

// Obtener conversación en concreto
router.get('/:id', async (req, resp) => {
    const result = await DB.select(['content'])
    .from('messages')
    .where('messageID', req.params.id);
	resp.json({status: true, data: result});
});

// Enviar nuevo mensaje
router.post('/', async (req, resp) => {
    try {
        const result = await DB('messages')
            .insert({
            senderID: req.body.senderID,
            receiverID: req.body.receiverID,
            content: req.body.content
        });
        if (result.length > 0) {
            return resp.json({ status: true, message: 'Mensaje enviado con éxito' });
        } else {
            return resp.json({ status: false, message: 'No se pudo enviar el mensaje' });
        }
    } catch (error) {
        console.error(error);
        return resp.json({ status: false, message: 'Algo falló' });
    }
});

//Modificar mensajes
router.put('/:id', async (req, resp) => {
    const whitelist = ["content"];
	const ID = req.params.id;
	const toEdit = {};
	Object.keys(req.body).forEach(e => {
		if( whitelist.includes(e) ){
			toEdit[e] = req.body[e];
		}
	})
	const result = await DB('messages')
    .update(toEdit)
    .where('messageID', ID);
	console.log(req.body);
	console.log(toEdit);
	console.log(result);
	resp.json({status:true});
});

// Eliminar mensajes
router.delete('/:id', async (req, resp) => {
    const result = await DB('messages')
    .delete()
    .where('messageID', req.params.id);
    if (result > 0) {
        return resp.json({ status: true, message: 'Mensaje eliminado' });
    } else {
        return resp.json({ status: false, message: 'No se pudo eliminar el mensaje' });
    }
});

module.exports = router;