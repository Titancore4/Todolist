//jshint esversion:6

var Parse = require('parse/node');

Parse.initialize("b4dljmUQXWU3XkKEn2jShWvcKvX6tK8nIPwMvqEj","485d0YMr2bUyKshc9yphv28kmXsVhKbGF9DKWHQM"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'https://parseapi.back4app.com/'



// _______________________________Database Code_________________________________
const mongoose = require("mongoose")

none = []

// main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery', false);
  await mongoose.connect('mongodb+srv://Titan7987:TZPh-CDy982WpNA@cluster0.udqrglp.mongodb.net/?retryWrites=true&w=majority/todolistDB');
}

const { Schema } = mongoose

// For the main list
const itemSchema = {
  itemName: {
    type: String,
    required: true
  }
}

const Item = mongoose.model("Item", itemSchema)

const buyFood = new Item({
  itemName: "Buy Food"
})

const cookFood = new Item({
  itemName: "Cook Food"
})

const eatFood = new Item({
  itemName: "Eat Food"
})

const defaultItems = [buyFood, cookFood, eatFood]


// New list schema
const listSchema = {
  listName: {
    required: true,
    type: String
  },
  listItems: [itemSchema]
}

const List = mongoose.model("list", listSchema)

// Function that creates new lists
function makeNewList(name) {
  const list = new List({
    listName: name,
    listItems: defaultItems
  })
  list.save()
}

// Function that creates new list items
function createNewItem(newItem) {
  const item = new Item ({
    itemName: newItem
  })
  item.save()
}

// Function to find a list
function findList(listName) {
  List.findOne({listName: listName}, function(err, list) {
    if (!err) {
      return list
    }
  })
}
// _______________________________Server Code___________________________________
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash")
const popup = require("node-popup")


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const workItems = [];

// Default Home List
app.get("/", function(req, res) {

  Item.find(function(err, item) {

    if (item.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
        } else {
        }
      })
    }

    else if (err) {
    }

    else {
      List.find({}, function(err, list) {
        if (err) {
        }
        else {
          list.forEach(function(listName) {
          })
          res.render("list", {array: list, newListItems: item, listTitle: "Today"})
        }
      })
    }
  })
});

// Creating new list items
app.post("/", function(req, res) {

  const item = req.body.newItem.toString();
  const listName = req.body.list.toString().toLowerCase();

  newItem = new Item({
      itemName: item
  })

  if (listName === "today") {
    newItem.save()
    res.redirect("/")
  }
  else {
  List.findOne({listName: listName}, function(err, result) {
      if (!err) {
        result.listItems.push(newItem)
        result.save()
      }
    })
    res.redirect("/" + listName)
  }
  });

// Deleting list items
app.post("/delete", function(req, res) {
  itemToDelete = req.body.box
  list_name = req.body.list_name.toString().toLowerCase()

  if (list_name === "today") {
    Item.deleteOne({_id: itemToDelete}, function(err) {
      if (err) {
      } else {
      }
    })

    res.redirect("/")
  }
  else {
    List.findOneAndUpdate({listName: list_name}, {$pull: {listItems: {_id: itemToDelete}}}, function(err, result) {
      if (!err) {
        res.redirect("/" + list_name)
      }
    })
  }

})

// Making new lists
app.post("/list", function(req, res) {
  newList = req.body.newListName.toLowerCase()

  List.findOne({listName: newList}, function(err, listInSearch) {
    if (!listInSearch) {
      makeNewList(newList)
      res.redirect("/" + newList)
    }
    else {
    }
  })
})

// Loading existing list
app.get("/:extension", function(req, res) {
  extension = String(req.params.extension.toLowerCase())

  if (extension !== "list") {
    List.find({}, function(err, list) {
      if (err) {
      }
      else {
        List.findOne({listName: extension}, function(err, foundList) {
          if (!err) {
            res.render("list", {array: list, newListItems: foundList.listItems, listTitle: _.startCase(extension)})
          }
        })
        // List.findOne({listName: extension}).select({"items"}, function())
      }
    })
  }
})

// About page
app.get("/about", function(req, res){
  res.render("about");
});

// // Server port
// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });































// .
