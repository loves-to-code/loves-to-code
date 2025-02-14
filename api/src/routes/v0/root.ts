import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("https://github.com/loves-to-code/loves-to-code");
});

export default router;