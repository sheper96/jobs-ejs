const Job = require('../models/Job')

const addJob = async (req, res, next) => {
    console.log("trigger")
    console.log(req.user._id)
    try {
        const { company, position, status } = req.body
        const createdBy = req.user._id
        console.log(createdBy)
        const job = new Job({company, position, status, createdBy})
        await job.save()
        res.redirect("/jobs");
    } catch (err) {
        res.status(500).json({ message: 'error creating a job', err: err.message })
    }
};

const deleteJob = async (req, res, next) => {
    try {
        console.log("Deleting job...");
        const jobId = req.params.id;
        await Job.deleteOne({ _id: jobId });
        console.log(`Job ${jobId} deleted successfully`);
        res.redirect("/jobs"); 
    } catch (err) {
        res.status(500).json({ message: "Error deleting job", error: err.message });
    }
};
module.exports = {
    addJob,deleteJob
}
