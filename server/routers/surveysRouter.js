import { json, Router } from "express";
const router = Router();
import db from "../database/createConnection.js";

//Get
router.get("/api/surveys", async (req, res) => {
    const surveys = await db.all("SELECT * FROM surveys;");
 
    res.send({ data: surveys });
});

//Post
router.post("/api/surveys", async (req, res) => {
        const { title, userid } = req.body;
        const { changes } = await db.run(`INSERT INTO surveys (title, userid) VALUES (?, ?);`, [title, userid]);
        return res.send({ rowsAffected: changes });
});


//Patch here


//Delete
router.delete("/api/surveys/:id", async (req, res) => {
        const surveyid = Number(req.params.id);
        const { changes } = await db.run(`DELETE FROM surveys WHERE id = ?`, surveyid);
        if (changes !== 0) {
            return res.send({ rowsDeleted: changes })
        }
        return res.send({error: `No product by id: ${surveyid}`})
});


export default router;