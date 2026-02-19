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

useEffect(() => {
 axios.get("http://localhost:3000/api/notes").then((res) => {
   setNotes(res.data.notes);
 });

 
}, [])

 
   
 

  return (
    <>
     <div className="notes">
      {notes.map((note, index) => (
       <div className="note" key={index}>
          <h1>{note.title}</h1>
          <p>{note.content}</p>
        </div>
      ))}
    
     </div>
    </>
  )
}

export default App
