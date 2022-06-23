import { Router } from "express";
const router = Router();
import db from "../database/createConnection.js";

//################# GET questions ####################
router.get("/api/questions/surveys/:id", async (req, res) => {
    const surveyid = Number(req.params.id);
    const questions = await db.all(`SELECT * FROM questions WHERE surveyid = ?;`, surveyid);
    res.send({ data: questions });
});


//################# POST question ####################
router.post("/api/questions", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const { question, questiontype, selectedSurveyId } = req.body;
        const correctSurveyId = await db.get(`SELECT id FROM surveys WHERE id = ? and userid = ?`, [selectedSurveyId, userid]);
        if (correctSurveyId) {
            const feedback = await db.run(`INSERT INTO questions (question, questiontype, surveyid) VALUES (?, ?, ?);`, [question, questiontype, correctSurveyId.id]);
            return res.send({ rowsAffected: feedback.changes, postedId: feedback.lastID });  
        }
        return res.send({ error: "wrong surveyid"});
    }
    res.send({error: "not logged in"});
});



//################# PATCH question ####################
router.patch("/api/questions/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const questionid = Number(req.params.id);
        const { selectedSurveyId, questiontype, question } = req.body;
        const correctSurveyId = await db.get(`SELECT id FROM surveys WHERE id = ? and userid = ?`, [selectedSurveyId, userid]);
        if (correctSurveyId) {
            const foundQuestion = await db.get(`SELECT * FROM questions where id = ?;`, questionid);
            if (foundQuestion) {
                const { changes } = await db.run(`UPDATE questions SET question = ?, questiontype = ? WHERE id = ?;`, [question, questiontype, questionid]);
            return res.send({ rowsAffected: changes });
            };
        }
        return res.send({error: `No question with id: ${questionid} under the survey with id ${selectedSurveyId}`})
    }
    res.send({error: "not logged in"})
});


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
            return res.send({error: `No question by id: ${questionid}`})
        }
        return res.send({ error: "wrong surveyid"});
    }
    res.send({error: "not logged in"});
});

export default router;