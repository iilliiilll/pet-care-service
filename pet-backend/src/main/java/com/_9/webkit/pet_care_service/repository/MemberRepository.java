package com._9.webkit.pet_care_service.repository;

import com._9.webkit.pet_care_service.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, String> {
    List<Member> findByIntroIsNotNullOrCertIsNotNull();
}
