package org.example.turistickivodic.services;

import org.example.turistickivodic.models.*;
import org.example.turistickivodic.utils.DatabaseUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ArticleService {

    public synchronized List<Article> getAllArticles() {
        List<Article> articles = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM Article")) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String text = rs.getString("text");
                Date createdAt = rs.getDate("createdAt");
                int visits = rs.getInt("visits");

                // Fetch destination
                int destinationId = rs.getInt("destination_id");
                Destination destination = getDestinationById(destinationId, conn);

                // Fetch author
                int authorId = rs.getInt("author_id");
                User author = getUserById(authorId, conn);

                // Fetch activities
                List<Activity> activities = getActivitiesByArticleId(id, conn);

                // Fetch comments
                List<Comment> comments = getCommentsByArticleId(id, conn);

                Article article = new Article(id, title, text, createdAt, visits, author, destination, activities, comments);
                articles.add(article);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return articles;
    }

    private Destination getDestinationById(int id, Connection conn) throws SQLException {
        String sql = "SELECT * FROM Destination WHERE id = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Destination(rs.getInt("id"), rs.getString("name"), rs.getString("description"));
            }
        }
        return null;
    }

    private User getUserById(int id, Connection conn) throws SQLException {
        String sql = "SELECT * FROM User WHERE id = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new User(rs.getInt("id"), rs.getString("email"), rs.getString("firstName"), rs.getString("lastName"),
                        rs.getString("password"), rs.getString("userType"), rs.getBoolean("isActive"));
            }
        }
        return null;
    }

    private List<Activity> getActivitiesByArticleId(int articleId, Connection conn) throws SQLException {
        List<Activity> activities = new ArrayList<>();
        String sql = "SELECT a.id, a.name FROM Activity a " +
                "JOIN Article_Activity aa ON a.id = aa.activity_id " +
                "WHERE aa.article_id = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, articleId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                activities.add(new Activity(rs.getInt("id"), rs.getString("name")));
            }
        }
        return activities;
    }

    private List<Comment> getCommentsByArticleId(int articleId, Connection conn) throws SQLException {
        List<Comment> comments = new ArrayList<>();
        String sql = "SELECT * FROM Comment WHERE article_id = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, articleId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {

                comments.add(new Comment(rs.getInt("id"), articleId, rs.getString("author"), rs.getString("text"), rs.getDate("createdAt")));
            }
        }
        return comments;
    }

    // UREDITI SVE METODE

    public synchronized List<Article> getMostReadArticles() {
        List<Article> articles = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT * FROM Article WHERE createdAt >= CURDATE() - INTERVAL 30 DAY ORDER BY visits DESC LIMIT 10;"
             );
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String text = rs.getString("text");
                Date createdAt = rs.getDate("createdAt");
                int visits = rs.getInt("visits");

                Article article = new Article(id, title, text, createdAt, visits);
                articles.add(article);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return articles;
    }


    public synchronized List<Article> getArticlesByActivity(String activity) {
        List<Article> articles = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT * FROM Article WHERE FIND_IN_SET(?, activities)")) {
            stmt.setString(1, activity);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String text = rs.getString("text");
                Date createdAt = rs.getDate("createdAt");
                int visits = rs.getInt("visits");

                // Fetch destination
                int destinationId = rs.getInt("destination_id");
                Destination destination = getDestinationById(destinationId, conn);

                // Fetch author
                int authorId = rs.getInt("author_id");
                User author = getUserById(authorId, conn);

                // Fetch activities
                List<Activity> activities = getActivitiesByArticleId(id, conn);

                // Fetch comments
                List<Comment> comments = getCommentsByArticleId(id, conn);

                Article article = new Article(id, title, text, createdAt, visits, author, destination, activities, comments);
                articles.add(article);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return articles;
    }


    public synchronized void createArticle(Article article) {
        if (article == null) {
            throw new IllegalArgumentException("Article cannot be null");
        }

        System.out.println("Creating article: " + article);

        String insertArticleSQL = "INSERT INTO Article (title, text, createdAt, visits, destination_id, author_id) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement articleStmt = conn.prepareStatement(insertArticleSQL, PreparedStatement.RETURN_GENERATED_KEYS)) {

            articleStmt.setString(1, article.getTitle());
            articleStmt.setString(2, article.getText());
            articleStmt.setDate(3, article.getCreatedAt()); // Postavljanje trenutnog datuma
            articleStmt.setInt(4, article.getVisits());
            articleStmt.setInt(5, article.getDestination_id());
            articleStmt.setInt(6, article.getAuthor().getId());

            int rowsInserted = articleStmt.executeUpdate();
            System.out.println("Rows inserted in Article: " + rowsInserted);

            if (rowsInserted > 0) {
                ResultSet generatedKeys = articleStmt.getGeneratedKeys();
                if (generatedKeys.next()) {
                    int articleId = generatedKeys.getInt(1);

                    String insertActivitySQL = "INSERT INTO Article_Activity (article_id, activity_id) VALUES (?, ?)";
                    try (PreparedStatement activityStmt = conn.prepareStatement(insertActivitySQL)) {
                        for (Activity activity : article.getActivities()) {
                            if (activity == null) {
                                throw new IllegalArgumentException("Activity cannot be null");
                            }
                            activityStmt.setInt(1, articleId);
                            activityStmt.setInt(2, activity.getId());
                            activityStmt.executeUpdate();
                        }
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    public synchronized void updateArticle(int id, Article article) {
        System.out.println("Updating article: " + article);
        String updateArticleSQL = "UPDATE Article SET title = ?, text = ?, createdAt = ?, visits = ?, destination_id = ?, author_id = ? WHERE id = ?";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement articleStmt = conn.prepareStatement(updateArticleSQL)) {

            articleStmt.setString(1, article.getTitle());
            articleStmt.setString(2, article.getText());
            articleStmt.setDate(3, article.getCreatedAt());
            articleStmt.setInt(4, article.getVisits());
            articleStmt.setInt(5, article.getDestination_id());
            articleStmt.setInt(6, article.getAuthor_id());
            articleStmt.setInt(7, id);
            int rowsUpdated = articleStmt.executeUpdate();
//            System.out.println("Rows updated in Article: " + rowsUpdated);

            // Update activities in Article_Activity table
            if (rowsUpdated > 0) {
                String deleteActivitySQL = "DELETE FROM Article_Activity WHERE article_id = ?";
                try (PreparedStatement deleteStmt = conn.prepareStatement(deleteActivitySQL)) {
                    deleteStmt.setInt(1, id);
                    deleteStmt.executeUpdate();
                }

                String insertActivitySQL = "INSERT INTO Article_Activity (article_id, activity_id) VALUES (?, ?)";
                try (PreparedStatement activityStmt = conn.prepareStatement(insertActivitySQL)) {
                    for (Activity activity : article.getActivities()) {
                        activityStmt.setInt(1, id);
                        activityStmt.setInt(2, activity.getId());
                        activityStmt.executeUpdate();
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public synchronized void deleteArticle(int id) {
        System.out.println("Deleting article with id: " + id);
        String deleteArticleSQL = "DELETE FROM Article WHERE id = ?";
        String deleteArticleActivitySQL = "DELETE FROM Article_Activity WHERE article_id = ?";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement articleStmt = conn.prepareStatement(deleteArticleSQL);
             PreparedStatement articleActivityStmt = conn.prepareStatement(deleteArticleActivitySQL)) {

            articleActivityStmt.setInt(1, id);
            articleActivityStmt.executeUpdate();

            articleStmt.setInt(1, id);
            int rowsDeleted = articleStmt.executeUpdate();
            System.out.println("Rows deleted in Article: " + rowsDeleted);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public synchronized Article getArticleById(int id) {
        Article article = null;
        String getArticleSQL = "SELECT * FROM Article WHERE id = ?";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(getArticleSQL)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    article = new Article(
                            rs.getInt("id"),
                            rs.getString("title"),
                            rs.getString("text"),
                            rs.getDate("createdAt"),
                            rs.getInt("visits")
                    );

                    // Fetch destination
                    int destinationId = rs.getInt("destination_id");
                    Destination destination = getDestinationById(destinationId, conn);
                    article.setDestination(destination);

                    // Fetch author
                    int authorId = rs.getInt("author_id");
                    User author = getUserById(authorId, conn);
                    article.setAuthor(author);

                    // Fetch activities
                    List<Activity> activities = getActivitiesByArticleId(id, conn);
                    article.setActivities(activities);

                    // Fetch comments
                    List<Comment> comments = getCommentsByArticleId(id, conn);
                    article.setComments(comments);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return article;
    }

    public synchronized void incrementArticleViews(int id) {
        String incrementViewsSQL = "UPDATE Article SET visits = visits + 1 WHERE id = ?";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(incrementViewsSQL)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public synchronized List<Article> getArticlesByDestinationId(String destinationId) {
        List<Article> articles = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT * FROM Article WHERE destination_id = ?")) {
            stmt.setString(1, destinationId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String text = rs.getString("text");
                Date createdAt = rs.getDate("createdAt");
                int visits = rs.getInt("visits");

                // Fetch destination
                Destination destination = getDestinationById(Integer.parseInt(destinationId), conn);

                // Fetch author
                int authorId = rs.getInt("author_id");
                User author = getUserById(authorId, conn);

                // Fetch activities
                List<Activity> activities = getActivitiesByArticleId(id, conn);

                // Fetch comments
                List<Comment> comments = getCommentsByArticleId(id, conn);

                Article article = new Article(id, title, text, createdAt, visits, author, destination, activities, comments);
                articles.add(article);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return articles;
    }


}
