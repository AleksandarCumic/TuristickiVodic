package org.example.turistickivodic.utils;

import static spark.Spark.*;

public class CorsFilter {
    private static final String origin = "*";
    private static final String methods = "GET,PUT,POST,DELETE,OPTIONS";
    private static final String headers = "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin";

    public static void apply() {
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Allow-Methods", methods);
            response.header("Access-Control-Allow-Headers", headers);
        });
    }
}
