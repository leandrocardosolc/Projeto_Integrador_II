package com.aboa.api.testcontroller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TesteController {

    @GetMapping("/teste")
    public String testEndpoint() {
        return "Olá, o teste funcionou!";
    }
}