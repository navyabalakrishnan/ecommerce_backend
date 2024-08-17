import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
   image: [{ type: String }],
   rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
   
   
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
