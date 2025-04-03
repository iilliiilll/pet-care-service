package com._9.webkit.pet_care_service.service;

import com._9.webkit.pet_care_service.dto.ReservationDTO;
import com._9.webkit.pet_care_service.entity.Pet;
import com._9.webkit.pet_care_service.entity.Reservation;
import com._9.webkit.pet_care_service.repository.MemberRepository;
import com._9.webkit.pet_care_service.repository.PetRepository;
import com._9.webkit.pet_care_service.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final MemberRepository memberRepository;
    private final PetRepository petRepository;

    // 예약 등록 ------------------------------------------------------
    public Reservation addReservation(ReservationDTO reservationDTO) {
        log.info("예약 등록 완료. 펫주인: {}, 펫시터: {}", reservationDTO.getOwnerPhone(), reservationDTO.getSitterPhone());

        if (!memberRepository.existsById(reservationDTO.getOwnerPhone())) {
            throw new IllegalArgumentException("펫주인 정보가 존재하지 않습니다.");
        }

        if (!memberRepository.existsById(reservationDTO.getSitterPhone())) {
            throw new IllegalArgumentException("펫시터 정보가 존재하지 않습니다.");
        }

        if (reservationDTO.getPetId() == null) {
            throw new IllegalArgumentException("펫 ID가 필요합니다.");
        }

        Pet pet = petRepository.findById(reservationDTO.getPetId()).orElse(null);

        if (pet == null) {
            throw new IllegalArgumentException("해당 펫이 존재하지 않습니다.");
        }

        if (!pet.getPhone().equals(reservationDTO.getOwnerPhone())) {
            throw new IllegalArgumentException("선택한 펫은 현재 로그인한 사용자의 반려동물이 아닙니다.");
        }

        if (reservationDTO.getStart().isAfter(reservationDTO.getEnd())) {
            throw new IllegalArgumentException("시작 시간은 종료 시간보다 이전이어야 합니다.");
        } else {
            Reservation reservation = new Reservation(null, LocalDateTime.now(), reservationDTO.getStatus() != null ? reservationDTO.getStatus() : "대기", reservationDTO.getStart(), reservationDTO.getEnd(), reservationDTO.getLocation(), reservationDTO.getOwnerPhone(), reservationDTO.getSitterPhone(), reservationDTO.getPetId());
            return reservationRepository.save(reservation);
        }
    }

    // 전체 예약 조회 ------------------------------------------------------
    public List<Reservation> getAllReservation() {
        log.info("전체 예약 조회");

        List<Reservation> reservations = reservationRepository.findAll();

        if (reservations.isEmpty()) {
            throw new IllegalArgumentException("등록된 예약이 없습니다.");
        } else {
            return reservations;
        }
    }

    // 펫주인 예약 조회 ------------------------------------------------------
    public List<Reservation> getOwnerReservation(String ownerPhone) {
        log.info("펫주인 예약 조회");

        List<Reservation> reservations = reservationRepository.findByOwnerPhone(ownerPhone);

        if (reservations.isEmpty()) {
            throw new IllegalArgumentException("해당 펫주인은 예약이 없습니다.");
        } else {
            return reservations;
        }
    }

    // 펫시터 예약 조회 ------------------------------------------------------
    public List<Reservation> getSitterReservation(String sitterPhone) {
        log.info("펫시터 예약 조회");

        List<Reservation> reservations = reservationRepository.findBySitterPhone(sitterPhone);

        if (reservations.isEmpty()) {
            throw new IllegalArgumentException("해당 펫시터는 예약이 없습니다.");
        } else {
            return reservations;
        }
    }

    // 예약 수락
    public void acceptReservation(int resvId) {
        log.info("예약 수락 - 예약 ID: {}", resvId);

        Optional<Reservation> optional = reservationRepository.findById(resvId);

        if (optional.isPresent()) {
            Reservation reservation = optional.get();

            if (!reservation.getStatus().equals("대기")) {
                throw new IllegalArgumentException("이미 처리된 예약입니다.");
            }

            reservation.setStatus("수락");
            reservationRepository.save(reservation);
        } else {
            throw new IllegalArgumentException("해당 예약을 찾을 수 없습니다.");
        }
    }

    // 예약 취소 ------------------------------------------------------
    public void cancelReservation(int resvId) {
        log.info("예약 취소 - 예약 ID: {}", resvId);

        Optional<Reservation> reservation = reservationRepository.findById(resvId);

        if (reservation.isPresent()) {
            Reservation currentReservation = reservation.get();
            currentReservation.setStatus("취소");
            reservationRepository.save(currentReservation);
        } else {
            throw new IllegalArgumentException("해당 예약을 찾을 수 없습니다.");
        }
    }

    // 케어 종료 ------------------------------------------------------
    public void completeReservation(int resvId) {
        log.info("예약 종료 - 예약 ID: {}", resvId);

        Optional<Reservation> optional = reservationRepository.findById(resvId);

        if(optional.isPresent()) {
            Reservation reservation = optional.get();

            if (!reservation.getStatus().equals("수락")) {
                throw new IllegalArgumentException("수락된 예약만 완료할 수 있습니다.");
            }

            reservation.setStatus("완료");
            reservationRepository.save(reservation);
        } else {
            throw new IllegalArgumentException("해당 예약을 찾을 수 없습니다.");
        }
    }
}
