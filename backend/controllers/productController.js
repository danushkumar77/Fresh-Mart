const Product = require('../models/Product');
const axios = require('axios');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find({ ...keyword, ...category, ...priceFilter });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock, discount } = req.body;
    const product = new Product({
      name, price, description, image, category, stock, discount: discount || 0
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock, discount } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.discount = discount !== undefined ? discount : product.discount;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search external products (DummyJSON & OpenFoodFacts)
// @route   GET /api/products/external-search?query=...
// @access  Private/Admin
const searchExternalProducts = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let results = [];

    // 1. Fetch from DummyJSON
    try {
      const dummyRes = await axios.get(`https://dummyjson.com/products/search?q=${query}&limit=5`);
      if (dummyRes.data && dummyRes.data.products) {
        const dummyProducts = dummyRes.data.products.map(p => ({
          id: `dummy_${p.id}`,
          name: p.title,
          category: p.category,
          description: p.description,
          image: p.thumbnail,
          source: 'DummyJSON'
        }));
        results = [...results, ...dummyProducts];
      }
    } catch (err) {
      console.error('Error fetching from DummyJSON:', err.message);
    }

    // 2. Fetch from OpenFoodFacts
    try {
      const offRes = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=5`);
      if (offRes.data && offRes.data.products) {
        const offProducts = offRes.data.products
          .filter(p => p.product_name && p.image_front_url) // Only include items with names and images
          .map(p => ({
            id: `off_${p.id || p.code}`,
            name: p.product_name,
            category: p.categories ? p.categories.split(',')[0].trim() : 'Pantry',
            description: p.ingredients_text || p.generic_name || 'No description available',
            image: p.image_front_url,
            source: 'OpenFoodFacts'
          }));
        results = [...results, ...offProducts];
      }
    } catch (err) {
      console.error('Error fetching from OpenFoodFacts:', err.message);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, searchExternalProducts };
