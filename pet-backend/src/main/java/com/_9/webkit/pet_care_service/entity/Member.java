package com._9.webkit.pet_care_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_member")
public class Member {
    @Id
    @Column(name="phone")
    private String phone;

    @Column(name="name")
    private String name;

    @Column(name="age")
    private int age;

    @Column(name="birth")
    private String birth;

    @Column(name="pw")
    private String pw;

    @Column(name="addr")
    private String addr;

    @Column(name="intro")
    private String intro;

    @Column(name="cert")
    private String cert;

}
