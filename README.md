# Backend Base 
To start with the application: 
 - `npm install` to install all the dependencies
 - Copy `.env.example` to create `.env` and fill in the configuration details
 - `npx dbmate migrate` to migrate schema and `npx dbmate rollback` to rollback the migrations
 - `npm run generate:token` and copy the code from the console log to paste in `.env` file as `JWT_SECRET_KEY=`