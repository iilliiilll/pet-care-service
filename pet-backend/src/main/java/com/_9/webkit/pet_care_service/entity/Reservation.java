package com._9.webkit.pet_care_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_resv")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resv_id")
    private Integer resvId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "status")
    private String status; // 대기, 수락, 취소, 완료

    @Column(name = "start")
    private LocalDateTime start;

    @Column(name = "end")
    private LocalDateTime end;

    @Column(name = "location")
    private String location;

    @Column(name = "owner_phone")
    private String ownerPhone;

    @Column(name = "sitter_phone")
    private String sitterPhone;

    @Column(name = "pet_id")
    private Integer petId;
}
