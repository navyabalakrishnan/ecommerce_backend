import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';
export const createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
try {
        const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, 'jklres');
    const userId = new mongoose.Types.ObjectId(decoded.username);

    if (!userId) {
      return res.status(404).send({ message: 'User ID not found in token' });
    }
        const existingReview = await Review.findOne({ product: productId, user: userId });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({
            product: productId,
            user: userId,
            rating,
            comment,
        });

        const savedReview = await review.save();

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.reviews.push(savedReview._id);
        product.numReviews = product.reviews.length;
        product.rating =
            (product.rating * (product.numReviews - 1) + rating) / product.numReviews;

        await product.save();

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReviewsByProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ product: productId }).populate('user', 'name');

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id; 

    try {
        const review = await Review.findById(reviewId);
 if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
if (review.user.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await review.remove();
const product = await Product.findById(review.product);
        product.reviews.pull(reviewId);
        product.numReviews = product.reviews.length;
  if (product.numReviews > 0) {
            const allReviews = await Review.find({ product: product._id });
            const newRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / product.numReviews;
            product.rating = newRating;
        } else {
            product.rating = 0;
        }
await product.save();
res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
