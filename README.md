# CSV Manager Server
This API serves requests to create and get csv files from the backend datastore (mongodb).
It is built using NodeJS with express and mongodb.  

### Routes
The following routes are available to interact with the datastore:  
  
  `GET /api/v1/files` - Retrieves all saved files  
  `POST /api/v1/files` - Creates a file (form data upload)  
  `GET /api/v1/files/:id/rows` - Retrieves all rows of an uploaded file  
  
### Future Routes
The following routes will be built to extend the platform  

  `GET /api/v1/files/:id` - Retrieves information about a specific file  
  `DELETE /api/v1/files/:id` - Deletes a previously saved file  
  `PUT /api/v1/files/:id` - Update a previously saved file's metadata  

### Running this project
1. Install dependencies with `yarn install`
2. Ensure a mongodb instance is running at `localhost:27017` or provide a `MONGODB_URI` environment variable
3. Start the server with `yarn dev` when running locally or `yarn start` in a production environment
4. Server will be running on port `1337` locally or will obey `process.env.PORT`

Note: This service is currently running on the Google App Engine in Google Cloud (see `app.yaml` file for config)  
Production hostname: https://csv-manager.uc.r.appspot.com

### Notes
This is a simple prototype for retrieving files and could be implemented several ways.  

Right now, when the server receives a request for a file, it will write all the rows in that CSV to the database.

Alternatively, the server could place the file in Amazon S3 which has several pros/cons:
 * It allows you to quickly download the original file (pro)
 * File is shareable via a link (pro)
 * Data must be parsed in order to edit row-by-row (con)
 * Storing metadata about each row becomes non-trivial whereas in a db you can simply add a field (con)  
 
Generally, when at scale, I'll write backend infrastructure in Java to gain some enterprise feature richness, strong type safety, and potential performance improvements.  NodeJS is a great alternative for quick prototyping at expense of some of those features.
 
There are currently no automated tests run as part of this project and it does not have an automated deployment process (CI/CD).  These future enhancements would be critical for long term success.