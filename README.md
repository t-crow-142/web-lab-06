# Web Lab 11 &ndash; Putting it all together
In this lab, we'll gain practice with using an SQLite database from within a node.js webapp, by extending an already-existing webapp which you've seen before. The lab as given serves as a good example of how the code for a complex webapp might fit together - and you'll be adding your own functionality to this.

## Obtaining the code
Now that you've obtained a copy of this repository through GitHub Classroom's invite, you have your own private version of this repository (i.e. the one you're looking at now)! To clone this repository onto your machine, click the green `Code` button, make sure `HTTPS` is selected, then click the `copy` button to the right of the web URL to copy its value. Then, clone onto your local machine from a terminal, using the `git clone` command.

If this is the first time you've ever cloned a repository on the current machine, you may be asked to enter your GitHub credentials. The "sign in with your browser" option should work just fine. You may need to enter your GitHub username and password, and / or authorize "git credential manager" to access your account. Perform these steps if asked.

Now, you should have a clone of your repository on your local machine, ready to develop!

Remember to commit and push your work regularly for backup purposes. It's also really good practice to create new branches for each exercise, and merge these into `main` using a Pull Request (PR) when they're complete (as opposed to simply pushing directly to `main` each time). This will get you used to a collaborative workflow style that will come in really handy when working on the final team project this semester!

**Note:** Whenever this lab mentions opening a "terminal window", any terminal *should* work. However, the work has only been tested using `git bash`.

**Note 2:** Remember to run `npm install` for each webapp, to make sure all necessary packages (including Express and Handlebars) are installed.

**Note 3:** You should work in groups for this lab!

**Note 4:** When testing your `node.js` code, **make sure to close your database within the DB Browser tool**. If you don't, you may get *"database locked"* errors.


## Exercise Zero &ndash; Creating the database
To begin, use the SQLite Database Browser tool to create a database file called `lab-database.db`. Create this file in the [`exercises`](./exercises) directory. Initialize the database using the `lab-database.sql` file located in the [`exercises/sql`](./exercises/sql) folder.

Similarly, you may also wish to create the database for the *example*, by creating a database called `examples-database.db` in the [`examples`](./examples) directory, and running the [`examples/sql/examples-database.sql`](./examples/sql/examples-database.sql) script against it.

**Note:** It is usually bad practice to commit your `*.db` files to your `git` repository, particularly when collaborating on a project with multiple people. This is because, while testing your code, the contents of the database might often change. Since those changes will be different on each collaborator's machine depending on what they're testing, everytime you try and commit the database file, there will be annoying *merge conflicts*. Because of this, the `.gitignore` file for this project has been set up to ignore all files with the `*.db` extension.

You may change this behaviour if you wish by removing the corresponding line from `.gitignore` - but please do understand the implications of doing so!


## Exercise One &ndash; Understanding
In this and following exercises, we'll gain familiarity with the `sqlite` and `sql-template-strings` packages, which can be used to easily access and interact with SQLite databases from within node.js. We'll also practice proper *separation of concerns* by organizing our code into appropriate modules.

To begin, we'll examine the existing project, which provides identical functionality to the login page from Supplementary Lab 02. However, this project uses a database, rather than an array, to store user information.

Examine the project and gain an understanding of how it functions - particularly focusing on those parts of the code which access the database. More information about the project can be found in [project-info.md](./exercises/project-info.md).

Once you've gotten a sense of what the program does, and have successfully run and tested it, move on to Exercise Two.


## Exercise Two &ndash; Account creation
In this exercise, we'll add account creation functionality to the webapp. Perform the following steps:

1. Add a new button or hyperlink to the login page, which displays text such as *"create new account"*, and links to `/newAccount`.

2. Add a new route handler to the `auth-routes` module, which handles `GET` requests to `/newAccount`. The handler should simply render the `new-account` view.

3. Add a new route handler to the `auth-routes` module, which handles `POST` requests to `/newAccount`. The handler should read the submitted name, username, and password from the form, and create a new user in the system. This can be done with the `createUser()` function in the `users-dao` module. Investigate this function to see the parameters it expects and how they are used. Once the new user has been created, the route handler should redirect to `/login`, supplying a toast message such as *"Account created successfully!"*.

4. **Investigation:** The database is setup to only allow `unique` usernames. If someone tries to create an account with an already-existing username, this will fail. As it stands though, the user experience isn't great - the webpage will simply "hang" until they press the "stop" button - then an error message such as `SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username` will be visible on the server console. You may try and remedy this by adding a `try / catch` around your call to `createUser()`. Upon catching an error, redirect the user back to the account creation page with an appropriate error toast message (and modify the view so this toast message is visible). Investigate `try / catch` here: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch>.


## Exercise Three &ndash; Messages table
Design a new database table intended to store messages which one user sends to another. The messages table should include the following information:

- A unique id
- The date &amp; time the mesage was sent (timestamp)
- The content of the message (256 characters max)
- The `id` of the user who sent the message
- The `id` of the user who received the message

Remember when designing the table, to consider any primary key, foreign key and other constraints which might be necessary.

Create the table in your `lab-database.sql` file, along with some `INSERT`s to add some dummy data to it. Then rerun the SQL file against your `lab-database.db` to include this new table and dummy data. Remember to "write changes" when done.

**Hints:**

- The *data type* of the the date and time column can be `timestamp`.

- To add data to a column of that type, you can use the `datetime()` *SQL function*. For example:
  - `datetime('2019-10-15 15:00:00')` refers to the specific time of 3pm on the 15th of October, 2019
  - `datetime('now')` refers to whatever the current date and time is.
  
  For more examples, see the following link: <https://www.sqlite.org/lang_datefunc.html>


## Exercise Four &ndash; Messages DAO
For this exercise, create a *DAO module* similar to `users-dao.js`, but for dealing with *messages* instead of users (i.e. from the table you just created in Exercise Three).

Create a new module, called `messages-dao.js`, and add (and export) functions which perform the following tasks:

1. Create a new message, given a `senderId`, `receiverId`, and `content` as parameters. The timestamp should be set to the current time (see the hints for Exercise Three above), and the id should be auto-generated by the database.

2. Retrieve all messages which were *received by* a given user (given that user's `id` as a parameter). Messages should be sorted by timestamp, in *descending order* (i.e. most recent message first). In addition to the information contained within your messages table, each row in the result should also contain the `username` of the `sender` (so this can be displayed in Exercise Five). You should be able to achieve this with *one `SELECT` statement* (with a join).

3. Deletes a message, given its `id` as a parameter.


## Exercise Five &ndash; Messages view on homepage
For this exercise, add code to the `home` view and `/` route handler which will display all messages received by a user on their homepage. The exact design of the HTML / CSS is up to you, but for each message, its timestamp, sender username, and content should be displayed.


## Exercise Six &ndash; Sending messages
Finally, add all frontend and backend code which will allow users to send messages. The frontend should comprise of a form on a user's homepage, which should at minimum contain a text area to enter the content, and a text input to enter the receiver id. A much better solution would be to allow the sender to enter the *username* of the receiver, rather than their id - so aim for this if possible.

If trying to send a message to a nonexistent user, an appropriate error message should be displayed.