/* General Stuff */

//Require Modules
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

//Parse the body
app.use(
    express.urlencoded({
        extended: true,
    })
);

//Static files
app.use(express.static("public"));

//EJS Files
app.set("view engine", "ejs");

/* End General Stuff */

/* DataBase Stuff */

//Connect Mongo DB
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

//DB Schema
const articleSchema = {
    title: String,
    content: String,
};

//Model

const Article = mongoose.model("Article", articleSchema);

/* End DataBase Stuff */

/* App Stuff */

//All the articles

app.route("/articles")
    .get(function(req, res) {
        //Get all the Articles

        Article.find({}, function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function(req, res) {
        //Post a new Article

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });

        newArticle.save(function(err) {
            if (!err) {
                res.send("Successfully added a new article");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function(req, res) {
        //Delete all

        Article.deleteMany({}, function(err) {
            if (!err) {
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

//Specific Articles
//%20 == space on route

app.route("/articles/:articleTitle")
    .get(function(req, res) {

        //Find one article
        Article.findOne({ title: req.params.articleTitle },
            function(err, foundArticle) {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No articles matching that title was found.");
                }
            }
        );
    })
    .put(function(req, res) {

        //Update one article
        Article.replaceOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true },
            function(err) {
                if (!err) {
                    res.send("Successfully updated Article");
                }
            }
        );
    })
    .patch(function(req, res) {
        //Update specific field on a specific objects
        Article.updateOne({ title: req.params.articleTitle }, { $set: req.body },
            function(err) {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            }
        );
    }).delete(function(req, res) {

        //Delete specific article
        Article.deleteOne({ title: req.params.articleTitle },
            function(err) {
                if (!err) {
                    res.send("Successfully deleted the corresponding article.");
                } else {
                    res.send(err);
                }
            }
        );
    });


/* End App Stuff */

//Server up
app.listen(3000, function() {
    console.log("Server up on port 3000");
});