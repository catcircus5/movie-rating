const router = require('express').Router();
const mc = require('../controllers/moviesController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// PUBLIC
router.get('/', mc.getMovies);
router.get('/search', mc.searchMovies);

router.get('/:tmdbId', mc.getMovie);

// ADMIN
router.post('/', auth, admin, mc.createMovie);
router.put('/:tmdbId', auth, admin, mc.updateMovie);
router.delete('/:tmdbId', auth, admin, mc.deleteMovie);

module.exports = router;
