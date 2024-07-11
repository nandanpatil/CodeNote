const express  = require('express')
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const { verifyUser } = require('../middlewares/authUser');

// render all the notes 
router.get('/',verifyUser,dashboard.dashboard)

// just render the addPage
router.get('/add',verifyUser,dashboard.add)

// actually add the data now
router.post('/addNote',verifyUser,dashboard.addNote)

router.get('/item/:id',verifyUser,dashboard.viewNote)

router.put('/item/:id',verifyUser,dashboard.updateNote)

router.delete('/item-delete/:id',verifyUser,dashboard.deleteNote)

module.exports = router