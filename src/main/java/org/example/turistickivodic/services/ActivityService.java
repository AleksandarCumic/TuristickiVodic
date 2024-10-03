package org.example.turistickivodic.services;

import org.example.turistickivodic.models.Activity;
import org.example.turistickivodic.utils.DatabaseUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ActivityService {

    public synchronized List<Activity> getAllActivities() {
        List<Activity> activities = new ArrayList<>();
        try (Connection conn = DatabaseUtil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM Activity")) {

            while (rs.next()) {
                activities.add(new Activity(
                        rs.getInt("id"),
                        rs.getString("name")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return activities;
    }

    public synchronized void createActivity(Activity activity) {
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("INSERT INTO Activity (name) VALUES (?)")) {

            stmt.setString(1, activity.getName());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public synchronized void updateActivity(String id, Activity activity) {
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("UPDATE Activity SET name = ? WHERE id = ?")) {

            stmt.setString(1, activity.getName());
            stmt.setString(2, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public synchronized void deleteActivity(String id) {
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM Activity WHERE id = ?")) {

            stmt.setString(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
