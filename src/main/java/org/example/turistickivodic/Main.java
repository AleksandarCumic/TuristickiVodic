package org.example.turistickivodic;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.example.turistickivodic.controllers.*;
import org.example.turistickivodic.utils.CorsFilter;
import org.example.turistickivodic.websocket.NotificationWebSocketServer;
import spark.Spark;

import java.net.InetSocketAddress;

import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        Spark.port(4567);

        CorsFilter.apply();
        NotificationWebSocketServer socketServer = new NotificationWebSocketServer(new InetSocketAddress("localhost", 4568));
        socketServer.start();
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();

        UserController.init(socketServer);
        DestinationController.init(socketServer);
        ArticleController.init(gson, socketServer);
        CommentController.init(gson, socketServer);
        ActivityController.init(socketServer);

        // Start the server
        init();
    }
}
