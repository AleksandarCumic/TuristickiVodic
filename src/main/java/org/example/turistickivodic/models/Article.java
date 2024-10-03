package org.example.turistickivodic.models;

import java.sql.Date;
import java.util.List;

public class Article {
    private int id;
    private String title;
    private String text;
    private Date createdAt;
    private int visits;
    private User author;
    private Destination destination;
    private List<Activity> activities;
    private List<Comment> comments;
    private int author_id;
    private int destination_id;

    // Constructors
    public Article() {}

    public Article(int id, String title, String text, Date createdAt, int visits) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.createdAt = createdAt;
        this.visits = visits;
    }

    public Article(int id, String title, String text, Date createdAt, int visits, User author, Destination destination, List<Activity> activities, List<Comment> comments) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.createdAt = createdAt;
        this.visits = visits;
        this.author = author;
        this.destination = destination;
        this.activities = activities;
        this.comments = comments;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public int getVisits() {
        return visits;
    }

    public void setVisits(int visits) {
        this.visits = visits;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Destination getDestination() {
        return destination;
    }

    public int getDestination_id(){
        return destination_id;
    }

    public int getAuthor_id() {
        return author_id;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    @Override
    public String toString() {
        return "Article{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", text='" + text + '\'' +
                ", createdAt=" + createdAt +
                ", visits=" + visits +
                ", author=" + author +
                ", destination=" + destination +
                ", activities=" + activities +
                ", comments=" + comments +
                '}';
    }
}
