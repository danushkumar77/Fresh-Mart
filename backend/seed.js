const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const users = [
  { name: 'Admin User', email: 'admin@gmail.com', password: '12345', role: 'admin' },
  { name: 'User One', email: 'user1@gmail.com', password: '12345', role: 'user' },
  { name: 'User Two', email: 'user2@gmail.com', password: '12345', role: 'user' }
];

const products = [
  { name: 'Apple', price: 150, category: 'Fruits', image: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400', description: 'Fresh sweet apples.', stock: 100 },
  { name: 'Banana', price: 60, category: 'Fruits', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', description: 'Organic yellow bananas.', stock: 200 },
  { name: 'Orange', price: 80, category: 'Fruits', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', description: 'Juicy oranges.', stock: 150 },
  { name: 'Mango', price: 120, category: 'Fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', description: 'Alphonso Mangoes.', stock: 80 },
  { name: 'Grapes', price: 90, category: 'Fruits', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400', description: 'Seedless green grapes.', stock: 120 },
  { name: 'Pineapple', price: 70, category: 'Fruits', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400', description: 'Fresh whole pineapple.', stock: 50 },

  { name: 'Tomato', price: 40, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', description: 'Red ripe tomatoes.', stock: 300 },
  { name: 'Potato', price: 30, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', description: 'Farm fresh potatoes.', stock: 400 },
  { name: 'Onion', price: 35, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400', description: 'Fresh red onions.', stock: 350 },
  { name: 'Carrot', price: 50, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', description: 'Crunchy carrots.', stock: 150 },
  { name: 'Cabbage', price: 40, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=400', description: 'Fresh green cabbage.', stock: 80 },
  { name: 'Cauliflower', price: 45, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400', description: 'Fresh cauliflower.', stock: 90 },

  { name: 'Milk', price: 60, category: 'Dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', description: '1 Liter full cream milk.', stock: 100 },
  { name: 'Butter', price: 55, category: 'Dairy', image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400', description: '100g Salted butter.', stock: 200 },
  { name: 'Cheese', price: 120, category: 'Dairy', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', description: '200g Cheddar cheese block.', stock: 60 },
  { name: 'Eggs', price: 80, category: 'Dairy', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400', description: 'Brown eggs (12 pieces).', stock: 150 },
  { name: 'Yogurt', price: 40, category: 'Dairy', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', description: 'Fresh plain curd / yogurt.', stock: 120 },

  { name: 'Bread', price: 40, category: 'Bakery', image: 'https://placehold.co/400x400/f8fafc/0f172a?text=Bread', description: 'Whole wheat sliced bread.', stock: 80 },
  { name: 'Cake Rusk', price: 90, category: 'Bakery', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', description: 'Crispy cake rusk block.', stock: 100 },

  { name: 'Rice', price: 70, category: 'Pantry', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: '1kg Basmati Rice.', stock: 300 },
  { name: 'Wheat Flour', price: 200, category: 'Pantry', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', description: '5kg Whole wheat flour (Atta).', stock: 200 },
  { name: 'Sugar', price: 45, category: 'Pantry', image: 'https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?w=400', description: '1kg Refined White Sugar.', stock: 400 },
  { name: 'Salt', price: 25, category: 'Pantry', image: 'https://placehold.co/400x400/f8fafc/0f172a?text=Salt', description: '1kg Iodized Salt.', stock: 500 },
  { name: 'Cooking Oil', price: 150, category: 'Pantry', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', description: '1 Liter Sunflower Oil.', stock: 250 },

  { name: 'Tea Powder', price: 140, category: 'Pantry', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', description: '250g Premium Tea Powder.', stock: 180 },
  { name: 'Coffee Powder', price: 250, category: 'Pantry', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400', description: '100g Instant Coffee.', stock: 150 },
  { name: 'Green Tea', price: 130, category: 'Pantry', image: 'https://placehold.co/400x400/f8fafc/0f172a?text=Green+Tea', description: 'Green tea bags (25 count).', stock: 100 },

  { name: 'Biscuits', price: 30, category: 'Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', description: 'Digestive biscuits.', stock: 300 },
  { name: 'Potato Chips', price: 20, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', description: 'Salted potato chips.', stock: 400 },
  { name: 'Chocolate', price: 50, category: 'Snacks', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400', description: 'Milk chocolate bar.', stock: 250 },
  { name: 'Jam', price: 90, category: 'Pantry', image: 'https://placehold.co/400x400/f8fafc/0f172a?text=Jam', description: 'Mixed fruit jam.', stock: 150 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connection SUCCESS');

    await User.deleteMany({ email: { $in: ['admin@gmail.com', 'user1@gmail.com', 'user2@gmail.com'] } });
    await Product.deleteMany({});

    for (const u of users) {
      await User.create(u);
    }
    console.log('Users seeded successfully');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedDB();
