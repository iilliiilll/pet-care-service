package com._9.webkit.pet_care_service.service;

import com._9.webkit.pet_care_service.dto.MemberDTO;
import com._9.webkit.pet_care_service.entity.Member;
import com._9.webkit.pet_care_service.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j // Logger 자동 생성
public class MemberService {
    private final MemberRepository memberRepository;

    // 회원가입 -----------------------------------------------
    public Member signUp(MemberDTO memberDTO) {
        log.info("회원가입 - 입력 정보 : {}", memberDTO);

        // 회원가입 - 전화번호 중복
        if (memberRepository.existsById(memberDTO.getPhone())) {
            throw new IllegalArgumentException("이미 등록된 전화번호입니다.");
        }

        Member member = new Member(memberDTO.getPhone(), memberDTO.getName(), memberDTO.getAge(), memberDTO.getBirth(), memberDTO.getPw(), memberDTO.getAddr(), memberDTO.getIntro(), memberDTO.getCert());

        return memberRepository.save(member);
    }

    // 모든회원조회 -----------------------------------------------
    public List<Member> getAllMembers() {
        log.info("모든회원조회");
        return memberRepository.findAll();
    }

    // 회원조회 -----------------------------------------------
    public Member getMember(String phone) {
        log.info("회원조회 - 전화번호 : {}", phone);

        Optional<Member> member = memberRepository.findById(phone);

        if (member.isPresent()) {
            return member.get();
        } else {
            throw new IllegalArgumentException("해당 전화번호로 등록된 회원이 없습니다.");
        }

    }

    // 로그인 -----------------------------------------------
    public Member signIn(String phone, String pw) {
        log.info("로그인 - phone:{}, pw:{}", phone, pw);

        Optional<Member> member = memberRepository.findById(phone);

        if (member.isPresent()) {
            if (member.get().getPw().equals(pw)) {
                return member.get();
            } else {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }
        } else {
            throw new IllegalArgumentException("등록되지 않은 전화번호입니다.");
        }
    }

    // 회원탈퇴 -----------------------------------------------
    public void deleteMember(String phone) {
        log.info("회원탈퇴 - phone:{}", phone);

        Optional<Member> member = memberRepository.findById(phone);

        if (member.isPresent()) {
            memberRepository.deleteById(phone);
        } else {
            throw new IllegalArgumentException("해당 전화번호로 등록된 회원이 없습니다.");
        }
    }

    // 회원정보 수정 -----------------------------------------------
    public Member updateMember(String phone, MemberDTO memberDTO) {
        log.info("회원정보 수정 - phone:{}", phone);

        Optional<Member> member = memberRepository.findById(phone);

        if (member.isPresent()) {
            Member newMember = member.get();

            newMember.setName(memberDTO.getName());
            newMember.setAge(memberDTO.getAge());
            newMember.setBirth(memberDTO.getBirth());

            if (memberDTO.getPw() != null && !memberDTO.getPw().isBlank()) {
                newMember.setPw(memberDTO.getPw());
            }

            newMember.setAddr(memberDTO.getAddr());
            newMember.setIntro(memberDTO.getIntro());
            newMember.setCert(memberDTO.getCert());

            return memberRepository.save(newMember);
        } else {
            throw new IllegalArgumentException("해당 전화번호로 등록된 회원이 없습니다.");
        }
    }
}
