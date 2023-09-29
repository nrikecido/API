// Faltan las 3 que dijo Luis
const express = require('express');
const router = express.Router();
const DB = require('../config/db');
const utils = require('../config/utils');
const authtoken = require('../config/authtoken');
const hash = require('../config/password');

// Rutas de la API de usuarios
router.get('/list', [authtoken], async (req, resp) => {

	const result = await DB.select(['nameSurname', 'description'])
	.from('users');

	if( result.length === 1 ){
		return resp.json({status: true, data: result[0]});
	}else{
		return resp.json({status: false, error: "Token no válido"});
	}
});

// Obtener el propio perfil
router.get('/self', [authtoken], async (req, resp) => {

	const result = await DB.select(['email', 'nameSurname', 'description'])
	.from('users')
	.where('ID', req.user.ID);

	if( result.length === 1 ){
		return resp.json({status: true, data: result[0]});
	}else{
		return resp.json({status: false, error: "Token no válido"});
	}
});

// Obtener perfil concreto (no amigo)
router.get('/:id', [authtoken], async (req, resp) => {

	const result = await DB
		.select(['nameSurname', 'description'])
		.from('users')
		.where('ID', req.params.id);

	if( result.length === 1 ){
		return resp.json({status: true, data: result[0]});
	}else{
		return resp.json({status: false, error: "ID no válido"});
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
		token: hash(req.body.email + req.body.password),
		description: req.body.description,
		nameSurname: req.body.nameSurname,
		birthDate: new Date(req.body.birthDate),
		city: req.body.city,
	  });
  
	  return resp.json({ status: true });
	} catch (error) {
	  console.error(error);
	  return resp.json({ status: false, error: 'Algo falló' });
	}
});

// Modificar dato de usuario
router.put('/', [authtoken], async (req, resp) => {

	const whitelist = ["email", "password", "description", "nameSurname", "birthDate", "city"];
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
	.where('ID', req.user.ID);

	resp.json({ status: true, message: 'Perfil actualizado correctamente', data: toEdit });
});

// Borrar usuario
router.delete('/', [authtoken], async (req, resp) => {

	const result = await DB('users')
	.delete()
	.where('ID', req.user.ID);

	if(result > 0){
		resp.json({ status: true, message: 'Perfil eliminado correctamente', deletedProfile: req.user});
	}
});

// Estas 3 hacerlas para el final

router.post('/login', [authtoken], async (req, resp) => {

	const userData = await DB('users')
      .select('email', 'password')
      .where('ID', req.user.ID)
      .first();

	if (req.body.email === userData.email && req.body.password === userData.password) {
		const newToken = hash(req.user.token);
		await DB('users')
		.where('ID', req.user.ID)
		.update('token', newToken)
	  	resp.json({ status: true, data: 'Usuario logueado' });
	} else {
	  // Las credenciales son incorrectas, devolvemos un error
	  resp.status(401).json({ error: 'Credenciales inválidas' });
	}
});

// Pedir para resetear la contraseña
router.post('/reset', [authtoken], async (req, resp) => {

}
);

// Introducir nueva contraseña
router.put('/users/reset/:token', (req, resp) => {
	
}
);

module.exports = router;
