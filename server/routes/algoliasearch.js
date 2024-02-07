const express = require("express");
const { AlgoliaSearch } = require("../controller/SearchController");
const router = express.Router();

router.get("/:query",AlgoliaSearch);


module.exports = router;
