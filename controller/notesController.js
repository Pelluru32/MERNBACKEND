
const Note = require("../models/Note")
const User = require("../models/User")

const populateEvent = (query) => {
    return query
      .populate({ path: 'user', model: User, select: '_id username' })
      
  }


const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find()
        
        if (!notes)  return res.status(400).json({ message: "No Notes found" })

        const addUserNameTONotes = await Promise.all(notes.map(async (note) => {
            const user = await User.findById({ _id: note.user }) 
            return { ...note.toObject(), username: user.username }
        }))
        res.status(201).send(addUserNameTONotes)

    } catch (error) {
        res.status(400).json({ message: "No Notes found" })
    }

}

// const getAllNotes = async (req, res) => {
//     try {
//         const notes =  Note.find()

//         if (!notes) {
//             return res.status(400).json({ message: "No Notes found " }) 
            

//         } 
//        // alternative
//        /*  const addUserNameTONotes = await Promise.all(notes.map(async (note) => {
//            const user= await populateEvent(note)
//             return {...note.toObject(),username:user.username}
//         }))
//         res.status(201).send(addUserNameTONotes) */
// // alternative
//         const addUserNameTONotes =await populateEvent(notes)
//         res.status(201).send(addUserNameTONotes)

//     } catch (error) {
//         res.status(400).json({ message: "No Notes found" })
//     }

// }

const createNewNote = async (req, res) => {
    const { user, title, text } = req.body;

    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const note = await Note.create({ user, title, text })
        return res.status(201).json({ message: `New note created , ${note.title}` });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate title' });
        } else {
            return res.status(400).json({ message: 'Invalid note data', error });
        }
    }
};

const updateNote = async (req, res) => {
    const { user, title, text, completed, id, } = req.body
    if (!user || !title || !text || !id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {

        const note = await Note.findById({ _id: id })
        note.user = user
        note.title = title
        note.text = text
        note.completed = completed
        const result = await note.save()

        res.status(201).json({ message: `Updated Note, ${result.title}` })


    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate title' });
        } else {
            return res.status(400).json({ message: 'Invalid note data', error });
        }
    }
}


const deleteNote = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Id field is required' });
    }
    try {
        const note = await Note.findByIdAndDelete({ _id: id })
        res.status(201).json({ message: `Note deleted, ${note.title}` })
    } catch (error) {
        res.status(401).json({ message: `can't find the Id` })
    }
}

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote }


