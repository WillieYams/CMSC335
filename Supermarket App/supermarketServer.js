"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const portNumber = 5000;
const fs = require("fs");
const path = require("path");

// One ES6 class (like in Java) defined and used. - Order
class Order {

    // The class has least one private instance variable - items
    #items;

    // a constructor
    constructor() {

        this.#items = [];
    }

    // adder and getter
    addItem(item) {

        this.#items.push(item);
    }

    getItems() {

        return this.#items;
    }

    // at least one method (besides the constructor). - getTotal
    getTotal(itemsList) {

        // uhh no loops so reduce and arrow 
        return this.#items.reduce((sum, itemName) => {

            const item = itemsList.find(i => i.name === itemName);
            return sum + item.cost;
        }, 0);
    }
}





// Displays the message "Usage supermarketServer.js jsonFile" 
// when an incorrect number of command line arguments are provided.
function cmdLnArgs() {
    
    if (process.argv.length !== 3) {

        console.log("Usage supermarketServer.js jsonFile");
        process.exit(0);
    }
}



// Command Line Interpreter
function cmdLnInterpreter(itemsList) {

    // The command line interpreter will use the prompt 
    // "Type itemsList or stop to shutdown the server: ".
    process.stdout.write("Type itemsList or stop to shutdown the server: ");

    process.stdin.on("readable", function() {

        const input = process.stdin.read();

        if (input !== null) {

            const cmd = input.toString().trim();

            // The server will stop when "stop" is entered. 
            // The message "Shutting down the server" should be displayed when the server is stopped. 
            // Use process.exit(0) to stop the server.
            if (cmd === "stop") {

                console.log("Shutting down the server");
                process.exit(0);
            }

            // The items in the JSON file loaded are displayed when "itemsList" is entered.
            else if (cmd === "itemsList") {
                
                console.log(itemsList);
            }

            // "Invalid command: " followed by the command entered, 
            // is displayed for a command other than "stop" or "itemsList".
            else {

                console.log(`Invalid command: ${cmd}`);
            }

            process.stdout.write("Type itemsList or stop to shutdown the server: ");
            process.stdin.resume();
        }
    });
}





// main
function main() {

    cmdLnArgs();
    
    // Use the fs module readFileSync() method to read the items list file 
    // and then JSON.parse() to generate the required object.
    const fileName = process.argv[2];
    const JSONdata   = fs.readFileSync(fileName, "utf8");
    const parsedData = JSON.parse(JSONdata);
    const itemsList = parsedData.itemsList;

    // set up Express to use ESJ
    app.set("view engine", "ejs");
    app.set("views", path.resolve(__dirname, "templates"));

    // auto parse inputted form data
    app.use(bodyParser.urlencoded({extended: false}));





    // This endpoint renders the main page of the application and 
    // it will display the contents of the index.ejs template file.
    app.get("/", (request, response) => {

        response.render("index");
    });



    // This endpoint displays the displayItems.ejs template with the table of items available.
    app.get("/catalog", (request, response) => {

        let itemsTable = "<table border='1'><tr><th>Item</th><th>Cost</th></tr>";
        
        itemsList.forEach(item => {
            
            itemsTable += `<tr><td>${item.name}</td><td>${item.cost.toFixed(2)}</td></tr>`;
        });
        itemsTable += "</table>";
        response.render("displayItems", {itemsTable});
    });



    // This endpoint displays the placeOrder.ejs template with the table of items available.
    app.get("/order", (request, response) => {

        let items = "";
        
        itemsList.forEach(item => {
        
            items += `<option value="${item.name}">${item.name}</option>`;
        });
        response.render("placeOrder", {items});
    });



    // This endpoint will process the submission of the placeOrder form, 
    // retrieving the order values and processing the order. 
    // Processing an order requires displaying the orderConfirmation.ejs template 
    // with a table that includes the items to be purchased, along with their cost. 
    // The last table row has the sum of all the items in the order.
    app.post("/order", (request, response) => {

        const name = request.body.name;
        const email = request.body.email;
        const delivery = request.body.delivery;
        
        // if only one item is selected turn it into an array
        const itemsSelected = request.body.itemsSelected;
        let selected = itemsSelected;
        
        if (typeof itemsSelected === "string") {

            selected = [itemsSelected];
        }

        // add the items to currOrder
        const currOrder = new Order();
        selected.forEach(item => currOrder.addItem(item));
        let orderTable = "<table border='1'><tr><th>Item</th><th>Cost</th></tr>";
        
        selected.forEach(itemName => {
                
            const item = itemsList.find(i => i.name === itemName);
            orderTable += `<tr><td>${itemName}</td><td>${item.cost.toFixed(2)}</td></tr>`;
        });

        // Truncate the sum using toFixed() after you have added the costs.
        const total = currOrder.getTotal(itemsList);
        orderTable += `<tr><td>Total Cost</td><td>${total.toFixed(2)}</td></tr>`;
        orderTable += "</table>";

        response.render("orderConfirmation", {name, email, delivery, orderTable});
    });





    // Also, make sure the message "Web server started and running at http://localhost:..." 
    // has the correct port number. 
    app.listen(portNumber);
    console.log(`Web server started and running at http://localhost:${portNumber}`);
            
    cmdLnInterpreter(itemsList);
} 

// silly me use main() not window.onload = main;
main();