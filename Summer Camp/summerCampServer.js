"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config({ 
    path: path.resolve(__dirname, ".env") 
});
const { MongoClient, ServerApiVersion } = require("mongodb");

const databaseName   = "CMSC335DB";
const collectionName = "campApplicants";
const uri = process.env.MONGO_CONNECTION_STRING;





// Command Line Interpreter
function cmdLnInterpreter() {

    process.stdout.write("Stop to shutdown the server: ");

    process.stdin.on("readable", function() {

        const input = process.stdin.read();

        if (input !== null) {

            const cmd = input.toString().trim();

            if (cmd === "stop") {

                console.log("Shutting down the server");
                process.exit(0);
            } 
            
            else {

                console.log(`Invalid command: ${cmd}`);
            }

            process.stdout.write("Type stop to shutdown the server: ");
            process.stdin.resume();
        }
    });
}





// main
function main() {

    const portNumber = process.argv[2];

    app.set("view engine", "ejs");
    app.set("views", path.resolve(__dirname, "templates"));
    app.use(bodyParser.urlencoded({ extended: false }));





    // home page (index)
    app.get("/", (request, response) => {

        response.render("index");
    });



    // application page (application)
    app.get("/apply", (request, response) => {

        response.render("application");
    });



    // submit application and confirmation page
    app.post("/apply", async (request, response) => {

        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

        try {
            await client.connect();
            const database = client.db(databaseName);
            const collection = database.collection(collectionName);

            const applicant = {

                name: request.body.name,
                email: request.body.email,
                gpa: parseFloat(request.body.gpa),
                info: request.body.info
            };

            await collection.insertOne(applicant);
        
            response.render("confirmation", { applicant: applicant });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });



    // review page (review)
    app.get("/review", (request, response) => {

        response.render("review");
    });

    // look up application and confirmation page
    app.post("/review", async (request, response) => {

        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

        try {
            await client.connect();
            const database = client.db(databaseName);
            const collection = database.collection(collectionName);

            const email = request.body.email;
            let applicant = await collection.findOne({ email: email });

            // if an application is not found
            if (!applicant) {
                
                applicant = { name: "NONE", email: "NONE", gpa: "NONE", info: "NONE" };
            }

            response.render("confirmation", { applicant: applicant });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });



    // select by GPA page (selectGPA)
    app.get("/gpa", (request, response) => {

        response.render("selectGPA");
    });

    // GPA results page (resultGPA)
    app.post("/gpa", async (request, response) => {

        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

        try {
            await client.connect();
            const database = client.db(databaseName);
            const collection = database.collection(collectionName);

            const minGpa = parseFloat(request.body.gpa);
            const result = await collection.find({gpa: {$gte: minGpa}}).toArray();

            response.render("resultGPA", { result: result, minGpa: minGpa });

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });



    // remove page (remove)
    app.get("/remove", (request, response) => {

        response.render("remove");
    });

    // removed page (removed)
    app.post("/remove", async (request, response) => {

        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

        try {
            await client.connect();
            const database = client.db(databaseName);
            const collection = database.collection(collectionName);

            const result = await collection.deleteMany({});
            response.render("removed", {count: result.deletedCount});

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });





    app.listen(portNumber);
    console.log(`Web server started and running at http://localhost:${portNumber}`);
    cmdLnInterpreter();
}



main();