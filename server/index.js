// imports here for express and pg
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_notes_db');

// static routes here (you only need these for deployment)
// app.use(express.static(path.join(__dirname, '../client/dist')));

// app routes here
// need to tell express how to send our note data from our database on to our application when it's requested
// Use the async keyword and create an arrow function with three arguments, req, res, and next
// Declare a variable SQL and make it an empty template literal for the moment (two backticks)
// Declare another variable named response and assign it to an awaited client.query(SQL)
// Declare another variable named response and assign it to an awaited client.query(SQL)
// SQL variable, we want to get all of our notes from the notes table, using a "raw" SQL query, as if we were in psql
// app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.get('/api/notes', async (req, res, next) => {
    try {
      const SQL = `SELECT * from notes;`;
      const response = await client.query(SQL);
      res.send(response.rows);
    } catch (error) {
      next(error);
    }
  })

// create your init function
// Declare a new async arrow function named init, and don't forget the async before the parameter list
// init has no parameters
const init = async () => {
    // await a method of connect on the client variable with no arguments
    await client.connect();
    // create our SQL query for seeding our note database
    // make sure if tables exist, that we delete them first
    // create our tables, and the columns on each table, as well as the datatypes they will contain
    // In the parenthesis, give each column it's own line
    // insert into the created table our new rows, each on their own line
    // Our init function now listens at our port or 3000, and seeds our data.
    const SQL = `
      DROP TABLE IF EXISTS notes;
      CREATE TABLE notes(
        id SERIAL PRIMARY KEY,
        txt VARCHAR(255),
       starred BOOLEAN DEFAULT FALSE
      );
      INSERT INTO notes(txt, starred) VALUES('learn express', false);
      INSERT INTO notes(txt, starred) VALUES('write SQL queries', true);
    INSERT INTO notes(txt) VALUES('create routes');
     INSERT INTO notes(txt) VALUES('create middleware');
    INSERT INTO notes(txt) VALUES('create db connections');
    `
    await client.query(SQL)
  console.log('data seeded')
//   Declare a port variable assigned to process.env.PORT || 3000
    const port = process.env.PORT || 3000
    // to use the listen method on the app variable
    // first is a number - port variable
    //  second is a callback function that logs
    app.listen(port, () => console.log(`listening on port ${port}`))
  }

// init function invocation
init();