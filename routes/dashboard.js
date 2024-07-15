const express  = require('express')
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const { verifyUser,canView,verifyUserNote } = require('../middlewares/authUser');

// render all the notes 
router.get('/',verifyUser,dashboard.dashboard)

// just render the addPage
router.get('/add',verifyUser,dashboard.add)

// actually add the data now
router.post('/addNote',verifyUser,dashboard.addNote)

router.get('/item/:id',canView,verifyUserNote,dashboard.viewNote)

router.put('/item-update/:id',verifyUserNote,dashboard.updateNote)

router.delete('/item-delete/:id',verifyUserNote,dashboard.deleteNote)

router.post('/fetchQuestion',dashboard.getQuestion)

router.get('/search', verifyUser, dashboard.dashboardSearch);

router.post('/search', verifyUser, dashboard.dashboardSearchSubmit);
module.exports = router