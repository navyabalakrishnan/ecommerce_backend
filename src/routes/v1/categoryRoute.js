import express from "express";

import { createCategory,getCategory} from "../../controllers/categoryController.js";


const  categoryRouter = express.Router();

categoryRouter.post("/create",  createCategory);
categoryRouter.get("/get-category",  getCategory);

export default categoryRouter;