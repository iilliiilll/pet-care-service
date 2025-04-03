package com._9.webkit.pet_care_service.repository;

import com._9.webkit.pet_care_service.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findByOwnerPhone(String ownerPhone);
    List<Reservation> findBySitterPhone(String sitterPhone);
}
