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
    FOREIGN KEY(userid) REFERENCES users(id)
);`);

await db.exec(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    question VARCHAR(70) NOT NULL,
    surveyid INTEGER NOT NULL,
    FOREIGN KEY(surveyid) REFERENCES surveys(id)
);`);

await db.exec(`CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    answer VARCHAR(70) NOT NULL,
    questionid INTEGER NOT NULL,
    FOREIGN KEY(questionid) REFERENCES questions(id)
);`);

// Seed
if (isInDeleteMode) {
    db.run("INSERT INTO users (username, email, password) VALUES ('Ludvig', 'testmail@gmail.com', 'hej123')");
    db.run("INSERT INTO surveys (title, userid) VALUES ('TestSurvey', '1')");
    db.run("INSERT INTO questions (question, surveyid) VALUES ('Hvem er sej?', '1')");
    db.run("INSERT INTO answers (answer, questionid) VALUES ('dig bro', '1')");
}
db.close();