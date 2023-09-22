// Faltan las 3 que dijo Luis
const express = require('express');
const router = express.Router();
const DB = require('../config/db');
const utils = require('../config/utils');

// Rutas de la API de usuarios
router.get('/list', async (req, resp) => {

	const result = await DB.select(['nameSurname', 'description'])
	.from('users');

	resp.json({status: true, data: result});
});

// Obtener el propio perfil
router.get('/self', async (req, resp) => {

	const token = "mamamama";

	const result = await DB.select(['email', 'nameSurname', 'description'])
	.from('users')
	.where('token', token);

	if( result.length === 1 ){
		return resp.json({status: true, data: result[0]});
	}else{
		return resp.json({status: false, error: "token no válido"});
	}

});

// Obtener perfil concreto (no amigo)
router.get('/:id', async (req, resp) => {

	const result = await DB
		.select(['nameSurname', 'description'])
		.from('users')
		.where('id', req.params.id);

	if( result.length === 1 ){
		return resp.json({status: true, data: result[0]});
	}else{
		return resp.json({status: false, error: "id no válido"});
	}

});

// Crear nuevo usuario
router.post('/', async (req, resp) => {
	try {
  
	  if (!utils.validarCorreo(req.body.email)) {
		return resp.json({ status: false, error: 'Correo electrónico no válido' });
	  }
  
	  const result = await DB('users').insert({
		email: req.body.email,
		password: req.body.password,
		token: Math.random().toString().replace('0.', ''),
		description: req.body.description,
		nameSurname: req.body.nameSurname,
		birthDate: new Date(req.body.birthDate),
		city: req.body.city,
	  });
  
	  console.log(result);
  
	  return resp.json({ status: true });
	} catch (error) {
	  console.error(error);
	  return resp.json({ status: false, error: 'Algo falló' });
	}
  });

// Modificar dato de usuario
router.put('/:id', async (req, resp) => {

	const whitelist = ["email", "password", "description", "nameSurname", "birthDate", "city"];
	const ID = req.params.id;

	const toEdit = {};

	if (!utils.validarCorreo(req.body.email)) {
		return resp.json({ status: false, error: 'Correo electrónico no válido' });
	}

	Object.keys(req.body).forEach(e => {
		if( whitelist.includes(e) ){
			toEdit[e] = req.body[e];
		}
	})

	const result = await DB('users')
	.update(toEdit)
	.where('ID', ID);

	console.log(req.body);
	console.log(toEdit);
	console.log(result);

	resp.json({status:true});

});

// Borrar usuario
router.delete('/:id', async (req, resp) => {

	const result = await DB('users')
	.delete()
	.where('ID', req.params.id);

	resp.json({status:true});

});

// Estas 3 hacerlas para el final

router.post('/login', (req, resp) => 
resp.send('Soy el endpoint de LOGUEAR DEL USUARIO.')
);

router.post('/reset', (req, resp) => 
resp.send('Soy el endpoint de RESETEO DE LA CONTRASEÑA.')
);

router.put('/users/reset/:token', (req, resp) => 
resp.send('Soy el endpoint para MODIFICAR LA CONTRASEÑA de usuario.')
);

module.exports = router;
