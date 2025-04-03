package com._9.webkit.pet_care_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReservationDTO {
    private Integer resvId;
    private LocalDateTime createdAt;
    private String status;
    private LocalDateTime start;
    private LocalDateTime end;
    private String location;
    private String ownerPhone;
    private String sitterPhone;
    private Integer petId;
}
