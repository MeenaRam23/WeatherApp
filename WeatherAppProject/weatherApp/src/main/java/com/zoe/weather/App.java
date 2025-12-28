package com.zoe.weather;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONObject;

public class App {

    private static final String API_KEY = "2c73831f9d55bad976af740f81425f0f";

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        String city = readNonEmptyCity(input);
        String url = buildWeatherUrl(city);

        fetchAndPrintWeather(url);

        input.close();
    }

    private static String readNonEmptyCity(Scanner input) {
        String city;
        do {
            System.out.print("Enter a city name: ");
            city = input.nextLine().trim();
            if (city.isEmpty()) {
                System.out.println("City cannot be empty. Try again.");
            }
        } while (city.isEmpty());
        return city;
    }

    private static String buildWeatherUrl(String city) {
        String encodedCity = URLEncoder.encode(city, StandardCharsets.UTF_8);
        return "https://api.openweathermap.org/data/2.5/weather?q="
                + encodedCity + "&units=metric&appid=" + API_KEY;
    }

    private static void fetchAndPrintWeather(String url) {
        try {
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            int status = response.statusCode();
            String body = response.body();

            if (status != 200) {
                System.out.println("Request failed. HTTP status: " + status);
                System.out.println("Response: " + body);
            }

            JSONObject root = new JSONObject(body);

            JSONObject main = root.getJSONObject("main");
            int temp = (int) main.getDouble("temp");
            int tempF = (5/9) * (temp) + 32;
            int humidity = main.getInt("humidity");

            JSONArray weatherArray = root.getJSONArray("weather");
            String description = weatherArray.getJSONObject(0).getString("description");

            String cityName = root.getString("name");
            String country = root.getJSONObject("sys").getString("country");

            System.out.println("\n--- Weather Result ---");
            System.out.println("Location: " + cityName + ", " + country);
            System.out.println("Temperature in Celsius: " + temp + " °C");
            System.out.println("Temperature in Fahrenheit: " + tempF + " °F");
            System.out.println("Condition: " + description);
            System.out.println("Humidity: " + humidity + "%");

        } catch (Exception e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }
    }
}