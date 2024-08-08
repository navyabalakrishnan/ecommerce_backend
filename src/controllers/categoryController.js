import Category from "../models/categoryModel.js";
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).send({ message: "Category name is required" });
        }

        const newCategory = new Category({ name, description });
        const savedCategory = await newCategory.save();

        return res.status(201).send({ message: "Category created successfully", category: savedCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).send({ message: "Failed to create category", error: error.message });
    }
};


export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();

        if (categories.length === 0) {
            return res.status(404).send({ message: "No categories found" });
        }

        return res.status(200).send(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).send({
            message: "Failed to fetch categories",
            error: error.message 
        });
    }
};
