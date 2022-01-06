# Spacebook API

[![Build Status](https://travis-ci.com/ash-williams/coffida_with_CI.svg?branch=main)](https://travis-ci.com/ash-williams/coffida_with_CI)

This is the Spacebook API for use in the 21/22 MAD assignment.

To get started, read the assignment brief and attend the assignment lecture.

For queries, contact Ashley Williams (ashley.williams@mmu.ac.uk).

## Config
1. Clone the repository into a directory on your local machine. If you have Git installed on your machine then you can run 'git clone https://github.com/ash-williams/Spacebook'
2. In the root of the cloned repository, create a .env file with your DB config details. The file should look like the following:
```
DB_HOST=<<URL for mudfoot>
DB_PORT=<port number for mudfoot>
DB_USER=<<your mudfoot username>
DB_PASS=<your mudfoot password>
```
3. Edit the first line in '/app/scripts/tables.sql' and '/app/scripts/dummy_data.sql'. Replace of 'ashley_student' with your own Mudfoot username.
4. Run 'npm install' to install the dependencies
5. Copy the contents of the yaml file in the resources directory into editor.swagger.io
6. Run the server with 'npm run dev'
7. In Postman, send a POST request to 'http://localhost:3333/api/1.0.0/reset' - this will create your database tables
8. In Postman, send a POST request to 'http://localhost:3333/api/1.0.0/resample' - this will add the dummy data
9. Continue to test everything is working using Postman
