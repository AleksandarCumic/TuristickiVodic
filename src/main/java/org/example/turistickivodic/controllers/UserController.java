package org.example.turistickivodic.controllers;

import static spark.Spark.*;
import com.google.gson.Gson;
import org.example.turistickivodic.models.User;
import org.example.turistickivodic.services.UserService;
import org.example.turistickivodic.utils.JwtUtil;
import org.example.turistickivodic.websocket.NotificationWebSocketServer;
import org.mindrot.jbcrypt.BCrypt;

import java.util.HashMap;
import java.util.Map;

public class UserController {
    private static UserService userService = new UserService();
    private static Gson gson = new Gson();

    public static void init(NotificationWebSocketServer socketServer) {
        post("/login", (req, res) -> {
            res.type("application/json");
            User user = gson.fromJson(req.body(), User.class);
            User foundUser = userService.getUserByEmail(user.getEmail());
            if (foundUser != null && BCrypt.checkpw(user.getPassword(), foundUser.getPassword())) {
                String token = JwtUtil.generateToken(foundUser.getEmail(), foundUser.getUserType());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", foundUser.getUserType());
                response.put("active", foundUser.isActive()); // Postavljanje vrednosti 'active'
                response.put("user", foundUser.getFirstName());
                return gson.toJson(response);
            } else {
                res.status(401);
                return gson.toJson("Invalid credentials");
            }
        });

        post("/users", (req, res) -> {
            res.type("application/json");
            User user = gson.fromJson(req.body(), User.class);
            userService.createUser(user);
            return gson.toJson(user);
        });

        put("/users/:id", (req, res) -> {
            res.type("application/json");
            User user = gson.fromJson(req.body(), User.class);
            userService.updateUser(req.params(":id"), user);
            return gson.toJson(user);
        });

        delete("/users/:id", (req, res) -> {
            res.type("application/json");
            int id = Integer.parseInt(req.params(":id"));
            userService.deleteUser(id);
            return gson.toJson("User deleted successfully");
        });

        // New endpoint to get all users
        get("/users", (req, res) -> {
            res.type("application/json");
            return gson.toJson(userService.getAllUsers());
        });

        // Add this route in UserController.java

        get("/users/email/:email", (req, res) -> {
            res.type("application/json");
            String email = req.params(":email");
            User user = userService.getUserByEmail(email);
            if (user != null) {
                return gson.toJson(user);
            } else {
                res.status(404);
                return gson.toJson("User not found");
            }
        });

    }
}
