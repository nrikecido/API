// Necesita un repaso, algunos por completar
const express = require('express');
const router = express.Router();
const DB = require('../config/db');
const utils = require('../config/utils');
const authtoken = require('../config/authtoken');
const hash = require('../config/password');

// Ver lista de amigos
router.get('/list', [authtoken], async (req, resp) =>{

	myID = req.user.ID;

    const result = await DB.select(['u2.nameSurname as friendName', 'friends.created'])
        .from('friends')
        .where('friends.accepted', 1)
        .andWhere(builder => {
            builder.where('friends.sendFriend', myID).orWhere('friends.acceptFriend', myID);
        })
        .innerJoin('users as u1', 'friends.sendFriend', 'u1.ID')
        .innerJoin('users as u2', 'friends.acceptFriend', 'u2.ID');

    resp.json({status: true, data: result});
});

// Ver un amigo concreto
router.get('/:id', [authtoken], async (req, resp) => {
    const friendID = req.params.id;
    const myID = req.user.ID;

    const result = await DB.select(['users.nameSurname as friendName', 'friends.created'])
        .from('friends')
        .where('friends.accepted', 1)
        .andWhere(function () {
            this.where('friends.sendFriend', myID).andWhere('friends.acceptFriend', friendID)
            .orWhere('friends.sendFriend', friendID).andWhere('friends.acceptFriend', myID);
        })
        .innerJoin('users', function () {
            this.on('friends.sendFriend', '=', 'users.ID').orOn('friends.acceptFriend', '=', 'users.ID');
        });

    if (result.length === 1) {
        resp.json({ status: true, data: result[0] });
    } else {
        resp.json({ status: false, error: 'Amigo no encontrado' });
    }
});


// Enviar petición de amistad
router.post('/', [authtoken], async (req, resp) => {
    try {
        const sendFriend = req.body.sendFriend;
        const acceptFriend = req.body.acceptFriend;

        const existingRequest = await DB('friends')
            .where({ sendFriend, acceptFriend, accepted: false })
            .orWhere({ sendFriend: acceptFriend, acceptFriend: sendFriend, accepted: false })
            .first();

        if (existingRequest) {
            return resp.json({ status: false, data: 'Ya existe una petición enviada a este usuario' });
        }

        const result = await DB('friends').insert({
            sendFriend,
            acceptFriend,
            accepted: false
        });

        if (result.length > 0) {
            return resp.json({ status: true, data: 'Petición de amistad enviada a usuario' });
        }
    } catch (error) {
        return resp.json({ status: false, error: 'Algo falló' });
    }
});


// Aceptar o rechazar solicitud
router.put('/:id', [authtoken], async (req, resp) => {
	try {
	  const myID = req.user.ID;
	  const friendID = req.params.id;

	  if (typeof req.body.accepted !== 'boolean') {
		throw 'accepted is not valid';
	  }
  
	  if (req.body.accepted === true) {
		const result = await DB('friends')
		  .where('sendFriend', myID)
		  .andWhere('acceptFriend', friendID)
		  .update({ accepted: true });
		  
		  console.log(req.body.accepted);
		  console.log(result);
	  } else {
		const result = await DB('friends')
		  .del()
		  .where({ sendFriend: myID, acceptFriend: friendID });
		  console.log(req.body.accepted);
	  }
	  resp.json({ status: true });
	} catch (error) {
	  resp.status(400).json({ status: false, error });
	}
  });
  

// Eliminar amistad
router.delete('/:id', [authtoken], async (req, res) => {
    try {
      const friendID = req.params.id;
      const myID = req.user.ID;
  
      const result = await DB('friends')
        .del()
        .where({
          sendFriend: myID,
          acceptFriend: friendID,
        });
  
      if (result > 0) {
        res.status(200).json({ message: 'Amistad eliminada con éxito.' });
      } else {
        res.status(404).json({ message: 'No se encontró la amistad para eliminar.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor.' });
    }
  });
  
module.exports = router;
