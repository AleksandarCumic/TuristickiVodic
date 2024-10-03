package org.example.turistickivodic.controllers;

import static spark.Spark.*;
import com.google.gson.Gson;
import org.example.turistickivodic.models.Activity;
import org.example.turistickivodic.services.ActivityService;
import org.example.turistickivodic.websocket.NotificationWebSocketServer;

public class ActivityController {
    private static ActivityService activityService = new ActivityService();
    private static Gson gson = new Gson();

    public static void init(NotificationWebSocketServer socketServer) {
        path("/activities", () -> {
            get("", (req, res) -> {
                res.type("application/json");
                return gson.toJson(activityService.getAllActivities());
            });

            post("", (req, res) -> {
                res.type("application/json");
                Activity activity = gson.fromJson(req.body(), Activity.class);
                activityService.createActivity(activity);
                return gson.toJson(activity);
            });

            put("/:id", (req, res) -> {
                res.type("application/json");
                Activity activity = gson.fromJson(req.body(), Activity.class);
                activityService.updateActivity(req.params(":id"), activity);
                return gson.toJson(activity);
            });

            delete("/:id", (req, res) -> {
                res.type("application/json");
                activityService.deleteActivity(req.params(":id"));
                return gson.toJson("Activity deleted");
            });
        });
    }
}
