package org.example.turistickivodic.controllers;

import static spark.Spark.*;
import com.google.gson.Gson;
import org.example.turistickivodic.models.Article;
import org.example.turistickivodic.models.Comment;
import org.example.turistickivodic.models.User;
import org.example.turistickivodic.services.ArticleService;
import org.example.turistickivodic.services.CommentService;
import org.example.turistickivodic.services.UserService;
import org.example.turistickivodic.websocket.NotificationWebSocketServer;

import java.util.List;

public class ArticleController {
    private static ArticleService articleService = new ArticleService();
    private static UserService userService = new UserService();
    private static CommentService commentService = new CommentService();

    public static void init(Gson gson, NotificationWebSocketServer socketServer) {
        path("/articles", () -> {
            get("", (req, res) -> {
                res.type("application/json");
                List<Article> articles = articleService.getAllArticles();
                for (Article article : articles) {
                    User author = userService.getUserById(article.getAuthor().getId());
                    article.setAuthor(author);
                }
                return gson.toJson(articles);
            });

            post("", (req, res) -> {
                res.type("application/json");
                String token = req.headers("Authorization").substring("Bearer ".length());
                User user = userService.getUserByToken(token);

                Article article = gson.fromJson(req.body(), Article.class);
                article.setAuthor(user);
                articleService.createArticle(article);
                return gson.toJson(article);
            });

            put("/:id", (req, res) -> {
                res.type("application/json");
                Article article = gson.fromJson(req.body(), Article.class);
                int articleId = Integer.parseInt(req.params(":id"));
                articleService.updateArticle(articleId, article);
                return gson.toJson(article);
            });

            delete("/:id", (req, res) -> {
                res.type("application/json");
                int articleId = Integer.parseInt(req.params(":id"));
                articleService.deleteArticle(articleId);
                return gson.toJson("Article deleted");
            });

            get("/most-read", (req, res) -> {
                res.type("application/json");
                List<Article> articles = articleService.getMostReadArticles();
                return gson.toJson(articles);
            });

            get("/:id", (req, res) -> {
                res.type("application/json");
                int articleId = Integer.parseInt(req.params(":id"));
                Article article = articleService.getArticleById(articleId);
                List<Comment> comments = commentService.getCommentsByArticleId(articleId);
                article.setComments(comments);
                articleService.incrementArticleViews(articleId);
                return gson.toJson(article);
            });

//            post("/:id/comments", (req, res) -> {
//                res.type("application/json");
//                int articleId = Integer.parseInt(req.params(":id"));
//                Comment comment = gson.fromJson(req.body(), Comment.class);
//                comment.setArticleId(articleId);
//                commentService.createComment(comment);
//                return gson.toJson(comment);
//            });

            get("/activity/:activity", (req, res) -> {
                res.type("application/json");
                String activity = req.params(":activity");
                List<Article> articles = articleService.getArticlesByActivity(activity);
                return gson.toJson(articles);
            });

        });
    }
}
