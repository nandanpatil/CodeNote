const express = require('express');
const app = express();

// Sample data
const items = [
    { name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' },
    { name: 'Item 4' }, { name: 'Item 5' }, { name: 'Item 6' },
    { name: 'Item 7' }, { name: 'Item 8' }, { name: 'Item 9' },
    { name: 'Item 10' }, { name: 'Item 11' }, { name: 'Item 12' },
];

const ITEMS_PER_PAGE = 5;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = items.slice(start, end);

    res.render('index', {
        data: paginatedItems,
        currentPage: page,
        totalPages: totalPages
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
