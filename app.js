//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin_shreyash:Shrey@sh123@cluster0.jucfd.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});


const itemsSchema = {
  name : String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name : "welcome to your todo List."
});

const item2 = new Item({
  name : "Press + for adding item to list"
});

const item3 = new Item({
  name :"click checkboc for deleting item from list"
});
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
const defaultItems = [item1,item2,item3];


// const listSchema = {
//   name : String,
//   items : [listSchema]
// };
//
// const List = mongoose.model("List", listSchema);
//
// const list = mongoose.item


app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        console.log("Sucessfully saved default items to DB");
      });
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });
});

// app.get("/:customListName", function(req,res){
//   const customListName = req.params.customListName;
//   const list = new List({
//     name : customListName,
//     items : defaultItems
//   });
//   list.save();
// });

app.post("/", function(req, res){
  const itemname = req.body.newItem;
  const newitem = new Item({
    name : itemname
  });
  newitem.save();
  res.redirect("/");
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function(req,res){
  const deleteitem = req.body.checkbox;
  Item.findByIdAndRemove(deleteitem, function(err){
    if(!err){
      console.log("Successfully deleted Checked item");
      res.redirect("/");
    }
  });

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
