const express = require("express");
const app = express();
const NoteModel = require("./models/note.modle.js");
const cors = require("cors");

app.use(cors());


app.use(express.json()); // Middleware to parse JSON bodies

//Post-Create a note
app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    const note = await NoteModel.create({ title, content });

    res.status(201).json(note);
});
``
app.get("/api/notes", async (req, res) => {
    const notes = await NoteModel.find();
    res.status(200).json({
        message: "Notes retrieved successfully",
        notes
    }
    );
});

app.delete("/api/notes/:id", async (req, res) =>{
    const id = req.params.id;

    await NoteModel.findByIdAndDelete(id);
res.status(200).json({  
      message: `Note with id ${id} deleted successfully`
      })

})

app.patch("/api/notes/:id", async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;

    const updatedNote = await NoteModel.findByIdAndUpdate(id, { content });

    res.status(200).json({
        message: "Note updated successfully",
        note: updatedNote
    });
});

module.exports = app;