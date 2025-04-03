package com._9.webkit.pet_care_service.controller;

import com._9.webkit.pet_care_service.dto.MemberDTO;
import com._9.webkit.pet_care_service.entity.Member;
import com._9.webkit.pet_care_service.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    // 회원가입 ------------------------------------------------
    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody MemberDTO memberDTO) {
        try {
            memberService.signUp(memberDTO);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 모든회원조회 ------------------------------------------------
    @GetMapping("/all")
    public ResponseEntity<?> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    // 회원조회 ------------------------------------------------
    @GetMapping("/{phone}")
    public ResponseEntity<?> getMember(@PathVariable("phone") String phone) {
        try {
            Member member = memberService.getMember(phone);
            return ResponseEntity.ok(member);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // 로그인 ------------------------------------------------
    @PostMapping("/signIn")
    public ResponseEntity<?> signIn(@RequestBody MemberDTO memberDTO, HttpSession session) {
        try {
            Member member = memberService.signIn(memberDTO.getPhone(), memberDTO.getPw());
            session.setAttribute("loginUser", member);
            return ResponseEntity.ok("로그인 성공 : " + member.getName());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // 로그아웃 ------------------------------------------------
    @PostMapping("/signOut")
    public ResponseEntity<?> signOut(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공 ");
    }

    // 회원탈퇴 ------------------------------------------------
    @GetMapping("/delete/{phone}")
    public ResponseEntity<?> deleteMember(@PathVariable("phone") String phone, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        if (!loginUser.getPhone().equals(phone)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("본인만 탈퇴할 수 있습니다.");
        }

        try {
            memberService.deleteMember(phone);
            session.invalidate();
            return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // 회원정보 수정 ------------------------------------------------
    @PutMapping("/update/{phone}")
    public ResponseEntity<?> updateMember(@PathVariable("phone") String phone, @RequestBody MemberDTO memberDTO, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        if (!loginUser.getPhone().equals(phone)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("본인만 수정할 수 있습니다.");
        }

        try {
            Member member = memberService.updateMember(phone, memberDTO);
            return ResponseEntity.ok("회원정보를 수정하였습니다");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 로그인 여부 ------------------------------------------------
    @GetMapping("/check-login")
    public ResponseEntity<?> checkLogin(HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser != null) {
            return ResponseEntity.ok(loginUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 하세요");
        }
    }

}
