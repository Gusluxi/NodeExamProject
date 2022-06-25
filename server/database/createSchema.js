import db from "./createConnection.js"

const isInDeleteMode = true;

if (isInDeleteMode) {
    await db.exec("DROP TABLE IF EXISTS users;");
    await db.exec("DROP TABLE IF EXISTS surveys;");
    await db.exec("DROP TABLE IF EXISTS questions;");
    await db.exec("DROP TABLE IF EXISTS answers;");
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
    questiontype INTEGER NOT NULL,
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
    await db.run("INSERT INTO users (username, email, password) VALUES ('Ludvig', 'testmail@gmail.com', '$2b$12$zqex32UV1pHm4W8BMEqgX.rpSe7l55TbpTAVlo6zhNCaOoaYzVVsu')"); //Kodeord er hej1
    await db.run("INSERT INTO surveys (title, userid) VALUES ('Zodiac Signs', '1')");
    await db.run("INSERT INTO questions (question, questiontype,  surveyid) VALUES ('What is your zodiac sign?', '4','1')");
    await db.run("INSERT INTO questions (question, questiontype,  surveyid) VALUES ('How old are you?', '6','1')");
    await db.run("INSERT INTO answers (answer, preset, questionid) VALUES ('Leo (lion)', '1', '1')");
    await db.run("INSERT INTO answers (answer, preset, questionid) VALUES ('Virgo (Maiden)', '1', '1')");
    await db.run("INSERT INTO answers (answer, preset, questionid) VALUES ('Cancer (Crab)', '1', '1')");
    await db.run("INSERT INTO answers (answer, preset, questionid) VALUES ('Taurus (Bull)', '1', '1')");
    await db.run("INSERT INTO answers (answer, preset, questionid) VALUES ('Cancer (Crab)', '0', '1')");
    await db.run("INSERT INTO answers (answer, preset, questionid) VALUES ('23', '0', '2')");
}
db.close();