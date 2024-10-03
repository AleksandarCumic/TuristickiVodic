package org.example.turistickivodic.models;

import org.example.turistickivodic.services.ArticleService;

import java.sql.Date;

public class Comment {
    private int id;
    private Article article;
    private String author;
    private String text;
    private Date createdAt;

    private int article_id;

    // Constructors
    public Comment() {}

    public Comment(int id, Article article, String author, String text, Date createdAt) {
        this.id = id;
        this.article = article;
        this.author = author;
        this.text = text;
        this.createdAt = createdAt;
    }

    public Comment(int id, int article_id, String author, String text, Date createdAt) {
        this.id = id;
        this.article_id = article_id;
        this.author = author;
        this.text = text;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Article getArticle() {
        return article;
    }

    public int getArticleId(){
        return article_id;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public void setArticleId(int id){
        this.article_id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", article=" + article +
                ", articleid=" + article_id +
                ", author='" + author + '\'' +
                ", text='" + text + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
