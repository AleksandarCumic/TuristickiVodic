package org.example.turistickivodic.controllers;

import static spark.Spark.*;
import com.google.gson.Gson;
import org.example.turistickivodic.models.Article;
import org.example.turistickivodic.models.Comment;
import org.example.turistickivodic.services.CommentService;
import org.example.turistickivodic.utils.DatabaseUtil;
import org.example.turistickivodic.websocket.NotificationWebSocketServer;

import java.sql.Connection;
import java.sql.Date;

public class CommentController {
    private static CommentService commentService = new CommentService();

    public static void init(Gson gson, NotificationWebSocketServer socketServer) {
        path("/articles/:articleId/comments", () -> {
            post("", (req, res) -> {
                res.type("application/json");
                int articleId = Integer.parseInt(req.params(":articleId"));
                Comment comment = gson.fromJson(req.body(), Comment.class);
                comment.setArticleId(articleId);
                commentService.createComment(comment);
                socketServer.broadcast("New comment added: " + comment.getText());
                return gson.toJson(comment);
            });

            put("/:id", (req, res) -> {
                res.type("application/json");
                Comment comment = gson.fromJson(req.body(), Comment.class);
                commentService.updateComment(Integer.parseInt(req.params(":id")), comment);
                socketServer.broadcast("Comment updated: " + comment.getText());
                return gson.toJson(comment);
            });

            delete("/:id", (req, res) -> {
                res.type("application/json");
                commentService.deleteComment(Integer.parseInt(req.params(":id")));
                socketServer.broadcast("Comment deleted with id: " + req.params(":id"));
                return gson.toJson("Comment deleted");
            });
        });
    }
}
