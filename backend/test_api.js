const axios = require('axios');

(async () => {
    try {
        const query = 'Chocolate';
        console.log('Testing DummyJSON API for Chocolate...');
        const dummyRes = await axios.get(`https://dummyjson.com/products/search?q=${query}&limit=5`);
        console.log('DummyJSON Results:', dummyRes.data.products.length, dummyRes.data.products.map(p => p.title));
        
        console.log('\nTesting OpenFoodFacts API for Chocolate...');
        const offRes = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=5`);
        console.log('OpenFoodFacts Results:', offRes.data.products.length, offRes.data.products.map(p => p.product_name));

    } catch (err) {
        console.error('Error fetching data:', err.message);
    }
})();
