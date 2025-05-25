package com.aboa.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories; // Adicionar este import

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.aboa.api.repository") // Escaneia explicitamente os repositórios
@ComponentScan(basePackages = {"com.aboa.api.controller", "com.aboa.api.service", "com.aboa.api.config", "com.aboa.api.exception","com.aboa.api.testcontroller"}) // Escaneia explicitamente controllers, services, config, exception
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

}