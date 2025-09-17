const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth.middleware');
const ContactController = require('../controllers/contact.controller')


router.get('/', requireAuth, ContactController.listContacts );
router.get('/:id', requireAuth, ContactController.getContactById );
router.post('/', requireAuth, ContactController.ajouterContact );
router.patch('/:id', requireAuth, ContactController.patchContact );
router.delete('/:id', requireAuth, ContactController.deleteContact );

module.exports = router;
