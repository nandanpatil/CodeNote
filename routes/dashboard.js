const express  = require('express')
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const { verifyUser,canView } = require('../middlewares/authUser');

// render all the notes 
router.get('/',verifyUser,dashboard.dashboard)

// just render the addPage
router.get('/add',verifyUser,dashboard.add)

// actually add the data now
router.post('/addNote',verifyUser,dashboard.addNote)

router.get('/item/:id',canView,dashboard.viewNote)

router.put('/item-update/:id',verifyUser,dashboard.updateNote)

router.delete('/item-delete/:id',verifyUser,dashboard.deleteNote)

router.post('/fetchQuestion',dashboard.getQuestion)
module.exports = router