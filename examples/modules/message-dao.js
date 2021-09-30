const dbPromise = require("./database");
const SQL = require("sql-template-strings");

async function createMessage(message) {
    const db = await dbPromise;

    const result = await db.run(SQL`insert into messages(content) values(${message.content})`);
    message.id = result.lastID;
    return result;
}

async function retrieveAllMessages() {
    const db = await dbPromise;

    return await db.all("select * from messages");
}

async function retrieveMessageById(id) {
    const db = await dbPromise;

    return await db.get(SQL`select * from messages where id = ${id}`);
}

async function updateMessage(message) {
    const db = await dbPromise;

    return await db.run(SQL`update messages set content = ${message.content} where id = ${message.id}`);
}

async function deleteMessage(id) {
    const db = await dbPromise;

    return await db.run(SQL`delete from messages where id = ${id}`);
}

async function deleteAllMessages() {
    const db = await dbPromise;

    return await db.run("delete from messages");
}

module.exports = {
    createMessage,
    retrieveAllMessages,
    retrieveMessageById,
    updateMessage,
    deleteMessage,
    deleteAllMessages
};