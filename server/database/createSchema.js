import db from "./createConnection.js"

const isInDeleteMode = true;

if (isInDeleteMode) {
    db.exec("DROP TABLE IF EXISTS users;");
    db.exec("DROP TABLE IF EXISTS surveys;");
    db.exec("DROP TABLE IF EXISTS questions;");
    db.exec("DROP TABLE IF EXISTS answers;");
}



await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username VARCHAR(70) NOT NULL,
    email VARCHAR(70) NOT NULL,
    password VARCHAR(70) NOT NULL
);`);

await db.exec(`CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    title VARCHAR(70) NOT NULL,
    userid INTEGER NOT NULL,
    CONSTRAINT fk_users
    FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE
);`);

await db.exec(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    question VARCHAR(70) NOT NULL,
    questiontype BIT NOT NULL,
    surveyid INTEGER NOT NULL,
    CONSTRAINT fk_surveys
    FOREIGN KEY(surveyid) REFERENCES surveys(id) ON DELETE CASCADE
);`);

await db.exec(`CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    answer VARCHAR(70) NOT NULL,
    preset BIT NOT NULL,
    questionid INTEGER NOT NULL,
    CONSTRAINT fk_questions
    FOREIGN KEY(questionid) REFERENCES questions(id) ON DELETE CASCADE
);`);

// Seed
if (isInDeleteMode) {
    db.run("INSERT INTO users (username, email, password) VALUES ('Ludvig', 'testmail@gmail.com', '$2b$12$zqex32UV1pHm4W8BMEqgX.rpSe7l55TbpTAVlo6zhNCaOoaYzVVsu')"); //Kodeord er hej1
    db.run("INSERT INTO surveys (title, userid) VALUES ('TestSurvey', '1')");
    db.run("INSERT INTO questions (question, questiontype,  surveyid) VALUES ('Hvem er sej?', '1','1')");
    db.run("INSERT INTO answers (answer, preset, questionid) VALUES ('dig bro', '0', '1')");
}
db.close();