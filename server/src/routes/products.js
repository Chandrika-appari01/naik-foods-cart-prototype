import { Router } from "express";
import { listProducts, suggestProducts } from "../controllers/productController.js";

const router = Router();

// Express 4 does not forward rejected promises to the error handler on its
// own, so this small wrapper catches them and calls next(err) for us.
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.get("/", asyncHandler(listProducts));
router.get("/suggestions", asyncHandler(suggestProducts));

export default router;
