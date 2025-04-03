package com._9.webkit.pet_care_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MemberDTO {
    private String phone;
    private String name;
    private int age;
    private String birth;
    private String pw;
    private String addr;
    private String intro;
    private String cert;
}
