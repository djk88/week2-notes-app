const express = require("express");
const mysqlDatabase = require('./mysqlDatabase')

const app = express();

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.render("notes.ejs")
})

app.get("/notes", async (req, res) => {
    const notes = await mysqlDatabase.getNotes();
    res.render("notes.ejs", {
        notes,
    });
})

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id
    try {
        const note = await mysqlDatabase.getNote(id)
        res.render("singleNote.ejs", {
            note
        })
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

app.get("/createNote", (req, res) => {
    res.render("createNote.ejs")
})

app.post("/notes", (req, res) => {
    const data = req.body
    mysqlDatabase.addNote(data)

    res.redirect("/notes");
})

app.post("/notes/:id/delete", (req, res) => {
    const id = +req.params.id
    mysqlDatabase.deleteNote(id)
    res.redirect("/notes")
})

app.use(express.static("public"))

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});