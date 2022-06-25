import { Router } from "express";
import { ieNoOpen } from "helmet";
const router = Router();
import db from "../database/createConnection.js";
import { getIO } from "../socketIO.js"



//################# GET answers ####################
router.get("/api/answers/questions/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const questionid = Number(req.params.id);
        const surveyUser = await db.get(
            `SELECT * FROM surveys
            INNER JOIN questions ON questions.surveyid = surveys.id
            INNER JOIN answers ON answers.questionid = questions.id WHERE questionid = ?`, questionid);
        if (surveyUser && surveyUser.userid === userid) {
            const answers = await db.all(`SELECT * FROM answers WHERE questionid = ?;`, questionid);
            return res.send({ data: answers });
        }
        return res.send({error: "wrong user"});
    }
    res.send({error: "not logged in"});
});

//################# GET preset answers ####################
router.get("/api/answers/preset/questions/:id", async (req, res) => {
    const questionid = Number(req.params.id);
    const answers = await db.all(`SELECT * FROM answers WHERE questionid = ? AND preset = 1;`, questionid);
    if(answers.length !== 0) {
        return res.send({ data: answers });
    }
    res.send({error: "No Preset Answers For questionID: " + questionid});
});

//################# POST answer ####################
router.post("/api/answers", async (req, res) => {
    const { answers } = req.body;
    if(answers) {
        if(answers.length !== 0) {
            answers.map(async answer => {
                await db.run(`INSERT INTO answers (answer, preset, questionid) VALUES (?, ?, ?);`, [answer.newAnswer, false, answer.questions.id]);
            });
            const io = getIO();
            io.emit("postAnswers", { answers });

            return res.send({ data: "Successfully saved answers" })
        } else {
            await db.run(`INSERT INTO answers (answer, preset, questionid) VALUES (?, ?, ?);`, [answers.newAnswer, false, answers.questions.id]);
            return res.send({ data: "Successfully saved answer" })
        }
    }
    res.send({ error: "No answers submitted" });
});

//################# POST preset answer ####################
router.post("/api/answers/questions/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const questionid = Number(req.params.id);
        const { answers, preset } = req.body;
        const surveyUser = await db.get(
            `SELECT * FROM surveys
            INNER JOIN questions ON questions.surveyid = surveys.id WHERE questions.id = ?`, questionid);
        if (surveyUser && surveyUser.userid === userid) {
            
            if(Array.isArray(answers)) {
                answers.map(async answer => {
                    await db.run(`INSERT INTO answers (answer, preset, questionid) VALUES (?, ?, ?);`, [answer.answer, preset, questionid]);
                });
                return res.send({success: "answers saved"})
            } else {
                const { changes } = await db.run(`INSERT INTO answers (answer, preset, questionid) VALUES (?, ?, ?);`, [answer, preset, questionid]);
                return res.send({ rowsAffected: changes });
            }
        }
        return res.send({error: "wrong user"});
    }
    res.send({error: "not logged in"});
});

//################# PATCH answer ####################
/*
router.patch("/api/answers/:id", async (req, res) => {
    if (req.session.loggedIn) {
        const userid = req.session.userID;
        const answerid = Number(req.params.id);
        const { selectedSurveyId, answer } = req.body;
        const correctSurveyId = await db.get(`SELECT id FROM surveys WHERE id = ? and userid = ?`, [selectedSurveyId, userid]);
        if (correctSurveyId) {
            const foundAnswer = await db.get(`SELECT * FROM answers where id = ?;`, answerid);
            if (foundAnswer) {
                const { changes } = await db.run(`UPDATE answers SET answer = ? WHERE id = ?;`, [answer, answerid]);
            return res.send({ rowsAffected: changes });
            };
        }
        return res.send({error: `No question with id: ${questionid} under the survey with id ${selectedSurveyId}`})
    }
    res.send({error: "not logged in"})
});
*/


export default router;