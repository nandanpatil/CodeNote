const Note = require('../model/notes')

const add = async(req,res)=>{
    try {
        res.render('dashboard/add',{layout:'../views/layouts/dashboard'})
    } catch (error) {
       res.send(error) 
    }
}

const addNote = async(req,res)=>{
    try {
        const title = req.body.title
    const body = req.body.body
    const userId = req.userId
    
    const note = new Note({userId,title,body})
   // console.log(note)
    await note.save()
        res.redirect('/dashboard')
    } catch (error) {
        res.send(error)
    }
}

const dashboard =async (req,res)=>{
    try {
        const userName = req.username;
        const userIdd = req.userId;
        const notes = await Note.find({userId:userIdd})
        const ITEMS_PER_PAGE = 8;

        const page = parseInt(req.query.page) || 1;
        const totalItems = notes.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedItems = notes.slice(start, end);

       res.render('dashboard/index', {
        userName,
        notes: paginatedItems,
        currentPage: page,
        totalPages: totalPages,
        layout:'../views/layouts/dashboard'
    });
        
    } catch (error) {
        res.status(500).render('404')
    }
   
}

const viewNote = async(req,res)=>{
    try {
        const NoteId = req.params.id;
    const note = await Note.findById(NoteId);
   return res.render('dashboard/view-note',{
        note,
        layout:'../views/layouts/dashboard'
    })
        
    } catch (error) {
    return res.render('404');
    }
    
}

const updateNote = async(req,res)=>{
    try {
        const updated_title = req.body.title;
        const updated_body  = req.body.body;
        const updated_questionUrl = req.body.questionUrl;
        const updated_solution = req.body.solution;
        await Note.findOneAndUpdate(
            {_id:req.params.id},
            {title:updated_title,body:updated_body,questionUrl:updated_questionUrl,solution:updated_solution})
       return res.redirect('/dashboard');    
        
    } catch (error) {
        res.render('404')
    }
}

const deleteNote = async(req,res)=>{
    try {
        await Note.deleteOne({_id:req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        res.render('404')
    }
}

module.exports = {dashboard,addNote,add,viewNote,updateNote,deleteNote}