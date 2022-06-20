import { json, Router } from "express";
const router = Router();
import db from "../database/createConnection.js";

//################# GET questions ####################
router.get("/api/questions", async (req, res) => {
    const questions = await db.all("SELECT * FROM questions;");
 
    res.send({ data: questions });
});


//################# POST question ####################
router.post("/api/questions", async (req, res) => {
    const { question, surveyid } = req.body;
    const { changes } = await db.run(`INSERT INTO questions (question, surveyid) VALUES (?, ?);`, [question, surveyid]);
    return res.send({ rowsAffected: changes });
});



//################# PATCH question ####################



//################# DELETE question ####################
router.delete("/api/questions/:id", async (req, res) => {
    const questionid = Number(req.params.id);
    const { changes } = await db.run(`DELETE FROM questions WHERE id = ?`, questionid);
    if (changes !== 0) {
        return res.send({ rowsDeleted: changes })
    }
    return res.send({error: `No product by id: ${questionid}`})
});

export default router;