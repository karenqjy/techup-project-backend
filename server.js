// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// Main landing page
app.get('/', async function(req, res) {

    // Try-Catch for any errors
    try {
        // Get all blog posts
        const blogs = await prisma.competency_questions.findMany({
                orderBy: [
                  {
                    id: 'desc'
                  }
                ]
        });

        // Render the homepage with all the blog posts
        await res.render('pages/home', { blogs: blogs });
      } catch (error) {
        res.render('pages/home');
        console.log(error);
      } 
});

// About page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// New post page
app.get('/new', function(req, res) {
    res.render('pages/new');
});

// Create a new post
app.post('/new', async function(req, res) {
    
    // Try-Catch for any errors
    try {
        // Get the title and content from submitted form
        const { title, content } = req.body;

        // Reload page if empty title or content
        if (!title || !content) {
            console.log("Unable to create new post, no title or content");
            res.render('pages/new');
        } else {
            // Create post and store in database
            const blog = await prisma.post.create({
                data: { title, content },
            });

            // Redirect back to the homepage
            res.redirect('/');
        }
      } catch (error) {
        console.log(error);
        res.render('pages/new');
      }

});

// Delete a post by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the homepage
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  });

app.post('/api/get-questions', async (req, res) => {
  //const { competency, proficiency, questionType, questionCount } = req.body;
  const dvalues = req.body;
  //const dataArray = JSON.parse(dvalues);

  let idx = 0;
  let result = [];

  while (idx < dvalues.length){
    //console.log(dvalues[idx].compentency);
    try {
      const questions = await prisma.competency_questions.findMany({
        where: {
          competency: dvalues[idx].compentency,
          proficiency: dvalues[idx].proficiency,
        },
      });

      let numMcq = parseInt(dvalues[idx].mcq);
      let numOe = parseInt(dvalues[idx].oe);
      let numEf = parseInt(dvalues[idx].ef);

      let mcqArray, mcqArray_final = [];
      let oeArray, oeArray_final = [];
      let efArray, efArray_final = [];

      mcqArray = questions.filter(item => item.question_type === 'MCQ');
      mcqArray_final = getRandomItems(mcqArray, numMcq);

      oeArray = questions.filter(item => item.question_type === 'OE');
      oeArray_final = getRandomItems(oeArray, numOe);

      efArray = questions.filter(item => item.question_type === 'E');
      efArray_final = getRandomItems(efArray, numEf);

      result.push(mcqArray_final);
      result.push(oeArray_final);
      result.push(efArray_final);

    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Error fetching questions');
    }

    idx ++;
  }

  res.json(result);

  // try {
  //   const questions = await prisma.competency_questions.findMany({
  //     where: {
  //      competency: dvalues[0].competency,
  //      proficiency: dvalues[0].proficiency,
  //     },
  //     take: 100
  //   });

  //   res.json(questions);
  // } catch (error) {
  //   console.error('Error fetching questions:', error);
  //   res.status(500).send('Error fetching questions');
  // }

});

// Tells the app which port to run on
app.listen(8080);
app.get('/demo', function(req, res) {
  res.render('pages/demo');
});

function getRandomItems(arr, numItems) {
  // Shuffle the array
  const shuffledArray = arr.sort(() => 0.5 - Math.random());
  // Return the first `numItems` items from the shuffled array
  return shuffledArray.slice(0, numItems);
}