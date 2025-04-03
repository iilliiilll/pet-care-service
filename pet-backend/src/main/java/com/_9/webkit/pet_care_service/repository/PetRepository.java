package com._9.webkit.pet_care_service.repository;

import com._9.webkit.pet_care_service.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Integer> {
    boolean existsByName(String name);
    List<Pet> findByPhone(String phone);
}
