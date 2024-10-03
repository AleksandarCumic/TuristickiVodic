package org.example.turistickivodic.websocket;

import org.java_websocket.server.WebSocketServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;

import java.net.InetSocketAddress;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class NotificationWebSocketServer extends WebSocketServer {

    private final Set<WebSocket> connections = Collections.synchronizedSet(new HashSet<>());

    public NotificationWebSocketServer(InetSocketAddress address) {
        super(address);
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        connections.add(conn);
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        connections.remove(conn);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        // Handle incoming messages if necessary
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        System.out.println("NotificationWebSocketServer started successfully");
    }

    public synchronized void broadcast(String message) {
        for (WebSocket conn : connections) {
            conn.send(message);
        }
    }
}
