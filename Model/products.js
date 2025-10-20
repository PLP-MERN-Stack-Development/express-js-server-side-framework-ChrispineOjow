import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const productSchema = new mongoose.Schema({
    id: {type: String, default: uuidv4, unique: true, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, min: 0 },
    category: {type: String, required: true},
    inStock: {type: Boolean, default: true },
}, { timestamps: true});

export const Product = mongoose.model('Product', productSchema);