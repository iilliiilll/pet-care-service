package com._9.webkit.pet_care_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PetDTO {
    private Integer petId;
    private String phone;
    private String spec;
    private String name;
    private int age;
    private double weight;
    private String note;
}
