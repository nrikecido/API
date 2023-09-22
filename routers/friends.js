// Necesita un repaso, algunos por completar
const express = require('express');
const router = express.Router();
const DB = require('../config/db');

// Ver lista de amigos
router.get('/list', async (req, resp) =>{
    
    const result = await DB.select(['acceptFriend', 'sendFriend', 'created'])
	.from('friends')
	.where('accepted', 1);

    resp.json({status: true, data: result});
});

// Ver un amigo concreto
router.get('/:id', async (req, resp) => {
    
    const result = await DB.select(['sendFriend', 'acceptFriend', 'created'])
	.from('friends')
	.where('', req.params.id);
    
    resp.json({status: true, data: result});
});

// Enviar petición de amistad
router.post('/:id', async (req, resp) => {

    try {

		const result = await DB('friends').insert({
			sendFriend: req.params.sendFriend,
            acceptFriend: req.params.acceptFriend,
			accepted: 0
		})
		console.log(result);
		
	} catch (error) {
		return resp.json({status: false, error: "Algo falló"});
	}

	return resp.json({status: true});
});

// Aceptar o rechazar solicitud
router.put('/:id', async (req, resp) => {
    const whitelist = ["accepted"];
	const ID = req.params.id;

	const toEdit = {};

	Object.keys(req.body).forEach(e => {
		if( whitelist.includes(e) ){
			toEdit[e] = req.body[e];
		}
	})

	const result = await DB('friends')
	.update(toEdit)
	.where('ID', ID);

	console.log(req.body);
	console.log(toEdit);
	console.log(result);

	resp.json({status:true});
});

// Eliminar amistad
router.delete('/:id', (req, resp) => 
resp.send('Soy el endpoint para ELIMINAR UNA AMISTAD')
);

module.exports = router;

/*
CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_sender INT,
    user_id_receiver INT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_sender) REFERENCES users(id),
    FOREIGN KEY (user_id_receiver) REFERENCES users(id)
);
*/