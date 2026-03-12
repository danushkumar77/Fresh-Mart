const axios = require('axios');

const imageUrls = [
  'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400', // Apple
  'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', // Banana
  'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', // Orange
  'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', // Cheese
  'https://images.unsplash.com/photo-1595535873420-a599152b3f4a?w=400', // Bread -> wait, previous was broken, let's test a new one:
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', // Bread
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', // Biscuits/Rusk
  'https://images.unsplash.com/photo-1627464010834-3996773a4d85?w=400', // Salt
  'https://images.unsplash.com/photo-1594631252845-29fc4cc8cbf9?w=400', // Green tea
  'https://images.unsplash.com/photo-1566478989037-e924e5080bf1?w=400', // Chips (wait this was broken, let's test new)
  'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', // Chips
  'https://images.unsplash.com/photo-1581691314981-22920253592e?w=400', // Jam
];

(async () => {
  for (const url of imageUrls) {
    try {
      const res = await axios.head(url);
      if (res.status >= 400) {
        console.log(`BROKEN [${res.status}]: ${url}`);
      } else {
        console.log(`OK: ${url}`);
      }
    } catch (err) {
      console.log(`ERROR [${err.response ? err.response.status : err.code}]: ${url}`);
    }
  }
  console.log('Finished testing images.');
})();
