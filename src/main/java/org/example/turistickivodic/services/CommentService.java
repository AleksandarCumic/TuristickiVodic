package org.example.turistickivodic.services;

import org.example.turistickivodic.models.Article;
import org.example.turistickivodic.models.Comment;
import org.example.turistickivodic.utils.DatabaseUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CommentService {
    public synchronized List<Comment> getCommentsByArticleId(int articleId) {
        List<Comment> comments = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM Comment WHERE article_id = ?")) {
            stmt.setInt(1, articleId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String author = rs.getString("author");
                    String text = rs.getString("text");
                    Date createdAt = rs.getDate("createdAt");
                    Article article = getArticleById(articleId, conn);

                    comments.add(new Comment(id, article, author, text, createdAt));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return comments;
    }

    public Article getArticleById(int articleId, Connection conn) throws SQLException {
        String sql = "SELECT * FROM Article WHERE id = ?";
        Article article = null;
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, articleId);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String text = rs.getString("text");
                java.sql.Date createdAt = rs.getDate("createdAt");
                int visits = rs.getInt("visits");

                article = new Article(id, title, text, createdAt, visits);
            }
        }
        return article;
    }

    public synchronized void createComment(Comment comment) {
        System.out.println("Creating comment: " + comment);
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("INSERT INTO Comment (article_id, author, text, createdAt) VALUES (?, ?, ?, ?)")) {

            if (comment == null) {
                throw new NullPointerException("Comment object is null");
            }

            if (comment.getArticleId() == 0) {
                throw new NullPointerException("Article ID is not set");
            }

            if (comment.getAuthor() == null) {
                throw new NullPointerException("Author is not set");
            }

            if (comment.getText() == null) {
                throw new NullPointerException("Text is not set");
            }

            stmt.setInt(1, comment.getArticleId());
            stmt.setString(2, comment.getAuthor());
            stmt.setString(3, comment.getText());
            stmt.setDate(4, comment.getCreatedAt());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public synchronized void updateComment(int id, Comment comment) {
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("UPDATE Comment SET article_id = ?, author = ?, text = ?, created_at = ? WHERE id = ?")) {

            stmt.setInt(1, comment.getArticleId());
            stmt.setString(2, comment.getAuthor());
            stmt.setString(3, comment.getText());
            stmt.setTimestamp(4, new java.sql.Timestamp(comment.getCreatedAt().getTime()));
            stmt.setInt(5, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public synchronized void deleteComment(int id) {
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM Comment WHERE id = ?")) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
