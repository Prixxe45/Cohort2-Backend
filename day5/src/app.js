const express = require("express")

const app = express()

const notes = []

app.use(express.json())

//Post request to create a note
app.post("/notes", (req,res)=>{
 notes.push(req.body)
  res.status(201).json({
    message:"note created successfully"
  })
})

//Get request to fetch all notes
app.get("/notes/",(req,res)=>{
res.status(200).json({
  notes : notes
})
})

//Delete request to delete a note
app.delete("/notes/:id",(req,res)=>{
delete notes[req.params.id]
res.status(204).json({
  message:"note deleted successfully"
})
})

//patch request to update a note
app.patch("/notes/:id",(req,res)=>{
  notes[req.params.id].description = req.body.description
  res.status(200).json({
    message:"note updated successfully"
  })
  })
  

module.exports = app