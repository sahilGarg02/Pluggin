const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // Set the view engine to ejs


const PORT = process.env.PORT || 3000;

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));




// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ind.html'));
});

app.post('/submit', (req, res) => {
  const url = req.body.url;

  console.log(url);
  
  axios.get(url)
  .then(response => {
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);

    // Example: Extract all the text content of <p> elements
    const paragraphs = $('p').map((index, element) => $(element).text()).get();
    console.log('Paragraphs:', paragraphs);

    // Example: Extract all the URLs of <a> elements
    const links = $('a').map((index, element) => $(element).attr('href')).get();
    console.log('Links:', links);

    
    const data = { paragraphs: paragraphs,links: links };
    res.render(path.join(__dirname,'views','index.ejs'), { data });
  })
  .catch(error => {
    console.error('Failed to fetch or process website data', error);
  });



  
  //res.send('Value received');
});


 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
