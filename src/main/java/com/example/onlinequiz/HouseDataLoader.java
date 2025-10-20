package com.example.onlinequiz; import com.example.onlinequiz.model.House; import com.example.onlinequiz.repository.HouseRepository;
import org.springframework.beans.factory.annotation.Autowired; import org.springframework.boot.CommandLineRunner; import org.springframework.stereotype.Component;
@Component public class HouseDataLoader implements CommandLineRunner {
    @Autowired private HouseRepository houseRepo; @Override
    public void run(String... args) {
        if (houseRepo.count() == 0) { houseRepo.save(new House("RED")); houseRepo.save
    }
}