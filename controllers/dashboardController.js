const Note = require('../model/notes')
const axios = require('axios');
const add = async(req,res)=>{
    try {
        res.render('dashboard/add',{layout:'../views/layouts/dashboard'})
    } catch (error) {
       res.send(error) 
    }
}

const addNote = async(req,res)=>{
    try {
        console.log(req.body)
        const receivedTitle = req.body.title;
        const receivedBody = req.body.body;
        const receivedUserIdd = req.userId; // Assuming req.userId is correctly set elsewhere
        const receivedIsCode = req.body.isCode === 'true'; // Convert to boolean
        const receivedIsShareable = req.body.isShareable === 'true'; // Convert to boolean
        const receivedCode = req.body.codeInput;
        const receivedQuestionUrl = req.body.questionUrl;
    
    const note = new Note({
       userId:receivedUserIdd,
       title:receivedTitle,
       body:receivedBody,
       questionUrl:receivedQuestionUrl,
       solution:receivedCode,
       isShareable:receivedIsShareable,
       isQuestion:receivedIsCode
    })
    console.log(note)
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
        const updated_solution = req.body.codeInput;
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


const getQuestion = async(req,res)=>{
   
    const leetcodeUrl = req.body.questionUrl;
    let data
    if (!leetcodeUrl) {
        data='Please provide a LeetCode URL.'
        return res.status(400).json(data);
    }
    

    const regex = /https:\/\/leetcode\.com\/problems\/([\w-]+)\//;
    const match = leetcodeUrl.match(regex);

    if (!match) {
        return res.status(400).send('Invalid LeetCode URL.');
    }


    const questionSlug = match[1];

    const query = `
    query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            title
            content
        }
    }
    `;

    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { titleSlug: questionSlug }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const questionData = response.data.data.question;
        if (questionData) {
            res.json({
                title: questionData.title,
                description: questionData.content
            });
        } else {
            res.status(404).send('Question not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the question description.');
    }
}

module.exports = {dashboard,addNote,add,viewNote,updateNote,deleteNote,getQuestion}