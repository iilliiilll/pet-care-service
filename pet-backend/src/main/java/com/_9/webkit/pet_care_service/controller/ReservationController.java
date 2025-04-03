package com._9.webkit.pet_care_service.controller;

import com._9.webkit.pet_care_service.dto.ReservationDTO;
import com._9.webkit.pet_care_service.entity.Member;
import com._9.webkit.pet_care_service.entity.Reservation;
import com._9.webkit.pet_care_service.repository.ReservationRepository;
import com._9.webkit.pet_care_service.service.ReservationService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;

    // 예약 등록 ------------------------------------------------------
    @PostMapping("/add")
    public ResponseEntity<?> addReservation(@RequestBody ReservationDTO reservationDTO, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        reservationDTO.setOwnerPhone(loginUser.getPhone());

        try {
            reservationService.addReservation(reservationDTO);
            return ResponseEntity.ok("예약이 성공적으로 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 전체 예약 조회 ------------------------------------------------------
    @GetMapping("/all")
    public ResponseEntity<?> getAllReservation() {
        try {
            List<Reservation> reservations = reservationService.getAllReservation();
            return ResponseEntity.ok(reservations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 펫주인 예약 조회 ------------------------------------------------------
    @GetMapping("/owner/{onwerPhone}")
    public ResponseEntity<?> getOnwerReservation(@PathVariable("onwerPhone") String ownerPhone, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            List<Reservation> reservations = reservationService.getOwnerReservation(ownerPhone);
            return ResponseEntity.ok(reservations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 펫시터 예약 조회 ------------------------------------------------------
    @GetMapping("/sitter/{sitterPhone}")
    public ResponseEntity<?> getSitterReservation(@PathVariable("sitterPhone") String sitterPhone, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            List<Reservation> reservations = reservationService.getSitterReservation(sitterPhone);
            return ResponseEntity.ok(reservations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 예약 수락 ------------------------------------------------------
    @PutMapping("/accept/{resvId}")
    public ResponseEntity<?> acceptReservation(@PathVariable("resvId") int resvId, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            reservationService.acceptReservation(resvId);
            return ResponseEntity.ok("예약을 수락했습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 예약 취소 ------------------------------------------------------
    @PutMapping("/cancel/{resvId}")
    public ResponseEntity<?> cancelReservation(@PathVariable("resvId") int resvId, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            reservationService.cancelReservation(resvId);
            return ResponseEntity.ok("예약이 취소되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 케어 종료 ------------------------------------------------------
    @PutMapping("/complete/{resvId}")
    public ResponseEntity<?> completeReservation(@PathVariable("resvId") int resvId, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            reservationService.completeReservation(resvId);
            return ResponseEntity.ok("예약이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
