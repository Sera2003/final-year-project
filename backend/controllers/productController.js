import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import productModel from '../models/productModel.js';
import dotenv from 'dotenv';
import crypto from 'crypto'; 
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: build absolute product image URL using request context
const buildImageUrl = (imgUrl, req) => {
  if (!imgUrl) return imgUrl;

  const baseUrl = (process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');

  // If already an absolute URL
  if (/^https?:\/\//i.test(imgUrl)) {
    try {
      const url = new URL(imgUrl);
      if (url.pathname.includes('/products/')) {
        const fileName = url.pathname.split('/products/')[1];
        return `${baseUrl}/products/${fileName}`;
      }
      return imgUrl; // keep other absolute URLs as-is
    } catch (err) {
      return imgUrl; // fallback
    }
  }

  // Relative like "/products/abc.jpg" or just filename
  const fileName = imgUrl.includes('/products/') ? imgUrl.split('/products/')[1] : imgUrl.replace(/^\/+/, '');
  return `${baseUrl}/products/${fileName}`;
};

// Helper function to save file locally; returns filename only (host-agnostic)
const saveFileLocally = async (fileBuffer, fileName) => {
  try {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex'); 
    const localFileName = `${uniqueSuffix}-${fileName}`;
    const productsDir = path.join(__dirname, '../bin/products');
    
    // Ensure directory exists
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }
    
    const localPath = path.join(productsDir, localFileName);
    fs.writeFileSync(localPath, fileBuffer);
    
    // Return filename only; final URL built at read time
    return localFileName;
  } catch (error) {
    console.error('Error saving file locally:', error.message);
    throw error;
  }
};

const addProduct = async (req, res) => {
  try {
    console.log('Files in request:', req.files);

    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);
    // Save files locally and store only filenames
    const imageFileNames = await Promise.all(
      images.map(async (image) => await saveFileLocally(image.buffer, image.originalname))
    );

    const imagesUrl = imageFileNames.map((fileName) => buildImageUrl(fileName, req));

    console.log('Local Image URLs:', imagesUrl);

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imageFileNames, // store filenames in DB (host-agnostic)
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: 'Product Added',
      product: { ...productData, image: imagesUrl },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});

    const transformedProducts = products.map(product => {
      const updatedImages = (product.image || []).map((imgUrl) => buildImageUrl(imgUrl, req));
      return { ...product.toObject(), image: updatedImages };
    });

    res.json({ success: true, products: transformedProducts });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (product && product.image) {
      product.image.forEach(imgUrl => {
        const fileName = imgUrl && imgUrl.includes('/products/')
          ? imgUrl.split('/products/')[1]
          : imgUrl;
        if (!fileName) return;
        const filePath = path.join(__dirname, '../bin/products', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    if (product) {
      const updatedImages = (product.image || []).map((imgUrl) => buildImageUrl(imgUrl, req));

      const transformedProduct = { ...product.toObject(), image: updatedImages };
      return res.json({ success: true, product: transformedProduct });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
