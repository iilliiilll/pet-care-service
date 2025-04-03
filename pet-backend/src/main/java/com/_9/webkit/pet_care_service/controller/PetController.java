package com._9.webkit.pet_care_service.controller;

import com._9.webkit.pet_care_service.dto.PetDTO;
import com._9.webkit.pet_care_service.entity.Member;
import com._9.webkit.pet_care_service.entity.Pet;
import com._9.webkit.pet_care_service.service.PetService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pet")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;

    // 펫 등록 -----------------------------------------------
    @PostMapping("/register")
    public ResponseEntity<?> registerPet(@RequestBody PetDTO petDTO, HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 세션에서 주인의 전화번호를 DTO에 세팅
        petDTO.setPhone(loginUser.getPhone());

        try {
            petService.registerPet(petDTO);
            return ResponseEntity.ok("펫 등록 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 나의 모든 펫 조회 -----------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<?> getAllMyPets(HttpSession session) {
        Member loginUser = (Member) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            List<Pet> pets = petService.getMyPets(loginUser.getPhone());
            return ResponseEntity.ok(pets);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



}
