const express = require("express");
const router = express.Router();
const Job = require("../models/Job")
const { addJob, deleteJob } = require("../controllers/jobsController");

router.get("/", async (req, res) => {
    console.log(req.user)
    try {
        const jobs = await Job.find();
        res.render('jobs', { jobs });
    } catch (err) {
        res.status(500).send('server error');
    }
    res.render("jobs", );
});

router.get("/add", (req, res) => {
    res.render("job", { job: null });
});
router.delete("/delete/:id", deleteJob);


router.post("/addJob", addJob);


// router.post("/", (req, res) => {
//   if (req.body.secretWord.toUpperCase()[0] == "P") {
//     req.flash("error", "That word won't work!");
//     req.flash("error", "You can't use words that start with p.");
//   } else {
//     req.session.secretWord = req.body.secretWord;
//     req.flash("info", "The secret word was changed.");
//   }

//   res.redirect("/secretWord");
// });

module.exports = router;