import { useEffect, useState } from 'react'
import axios from 'axios'


function App() {
 
 const [notes, setNotes] = useState([
   {
     title: "First Note",
     content: "This is the content of the first note.",
   },
   {
     title: "Second Note",
     content: "This is the content of the second note.",
   },
   {
     title: "Third Note",
     content: "This is the content of the third note.",
   },
   {
     title: "Fourth Note",
     content: "This is the content of the fourth note.",
   },
 ]);

 function fetchNotes() {
axios.get("http://localhost:3000/api/notes").then((res) => {
   setNotes(res.data.notes);
 });
 }

useEffect(() => {
 fetchNotes();
},[])

function handleSubmit(e) {
  e.preventDefault();
  const title = e.target.title.value;
  const content = e.target.content.value;
  console.log(title,content);

  axios.post("http://localhost:3000/api/notes", {
    title:title,
    content:content ,
  }).then((res) => {
    console.log(res.data);
    
  })
  
};
 function handleDeleteNote(noteId) {
  axios.delete(`http://localhost:3000/api/notes/${noteId}`)
  .then((res) => {
    console.log(res.data);
    fetchNotes();
  })
 }
 

  return (
    <>
<form action="" className="add-note-form" onSubmit={handleSubmit}>
  <input name='title' type="text" placeholder="Title" />
  <textarea name='content' type="text" placeholder="Content"></textarea>
  <button type="submit">Add Note</button>
</form>

     <div className="notes">
      {notes.map((note, index) => (
       <div className="note" key={index}>
          <h1>{note.title}</h1>
          <p>{note.content}</p>
          <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
        </div>
      ))}
    
     </div>
    </>
  )
}

export default App
