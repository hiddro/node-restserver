const {Router} = require('express');
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch} = require('../controllers/usuarios.controller');
const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRoleValido),
    validarCampos,
], usuariosPut);

//para definir un middleware el validator va en el medio
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    check('edad', 'No es una edad').isInt({min: 6, max: 80}),
    check('telefono', 'El telefono debe tener 9 digitos').isLength({min: 9, max: 9}),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    validarCampos
],usuariosPost);

router.delete('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeUsuarioId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;