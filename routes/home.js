const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Home called');
    res.render('index', { title: 'Homepage' });
});

module.exports = router;