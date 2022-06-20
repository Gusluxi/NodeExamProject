import { json, Router } from "express";
const router = Router();
import db from "../database/createConnection.js";

//################# GET questions ####################
router.get("/api/questions/surveys/:id", async (req, res) => {
    const surveyid = Number(req.params.id);
    const questions = await db.all(`SELECT * FROM questions WHERE surveyid = ?;` [surveyid]);
    res.send({ data: questions });
});


//################# POST question ####################
router.post("/api/questions", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const { question, selectedSurveyId } = req.body;
        console.log(question, selectedSurveyId);
        const surveyid = await db.get(`SELECT id FROM surveys WHERE id = ? and userid = ?`, [selectedSurveyId, userid]);
        console.log(surveyid);
        if (surveyid) {
            const { changes } = await db.run(`INSERT INTO questions (question, surveyid) VALUES (?, ?);`, [question, surveyid.id]);
            return res.send({ rowsAffected: changes });  
        }
        return res.send({ error: "wrong surveyid"});
    }
    res.send({error: "not logged in"});
});



//################# PATCH question ####################



//################# DELETE question ####################
router.delete("/api/questions/:questionid/surveys/:surveyid", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const selectedSurveyId = Number(req.params.surveyid);
        const questionid = Number(req.params.questionid);
        const surveyid = await db.get(`SELECT id FROM surveys WHERE id = ? and userid = ?`, [selectedSurveyId, userid]);
        if (surveyid) {
            const { changes } = await db.run(`DELETE FROM questions WHERE id = ?`, questionid);
            if (changes !== 0) {
                return res.send({ rowsDeleted: changes })
            }
            return res.send({error: `No product by id: ${questionid}`})
        }
        return res.send({ error: "wrong surveyid"});
    }
    res.send({error: "not logged in"});
});

export default router;