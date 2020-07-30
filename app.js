const express           = require("express");
const methodOverride    = require("method-override")
const port              = 3000
const bodyParser        = require("body-parser");
const mongoose          = require("mongoose")

const app = express();

//Setting Template Engine
app.set('view engine', 'ejs');


//Setting up Static File and Bodyparser
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"))

//Connecting MongoDB
mongoose.connect("mongodb://localhost:27017/restfullDB", {useNewUrlParser:true, useUnifiedTopology: true})

const blogSchema= new mongoose.Schema({
  title     : String,
  image     : String,
  body      :String,
  created   :{type:Date, default:Date.now}
})

const Blog= mongoose.model("Blog", blogSchema)

//Routes

app.get("/", function(req, res){
    res.redirect("/blogs")
})

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err)
        }
        else{
            res.render("index", {blogs:blogs})
        }
    })
    
})

app.get("/blogs/new", function(req, res){
    res.render("new")
})


app.post("/blogs", function(req, res){

    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("/new")
        }
        else{
            res.redirect("/blogs")
        }
    })

})

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs")
       }
       else{
           res.render("show", {blog: foundBlog})
       }
   })
})

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("edit", {blog: foundBlog})
        }
    })
})

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs")
        }
    })
})

//Launching Server
app.listen(port, function() {
    console.log("Server started on port 3000" );
  });
