package com._9.webkit.pet_care_service.service;

import com._9.webkit.pet_care_service.dto.PetDTO;
import com._9.webkit.pet_care_service.entity.Member;
import com._9.webkit.pet_care_service.entity.Pet;
import com._9.webkit.pet_care_service.repository.MemberRepository;
import com._9.webkit.pet_care_service.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetService {
    private final PetRepository petRepository;
    private final MemberRepository memberRepository;

    // 펫 등록 -----------------------------------------------
    public Pet registerPet(PetDTO petDTO) {
        log.info("펫 등록 : {}", petDTO);

        Optional<Member> member = memberRepository.findById(petDTO.getPhone());

        if (member.isPresent()) {
            if (petRepository.existsByName(petDTO.getName())) {
                throw new IllegalArgumentException("이미 동일한 이름의 반려동물이 등록되어 있습니다.");
            }
            Pet pet = new Pet(null, petDTO.getPhone(), petDTO.getSpec(), petDTO.getName(), petDTO.getAge(), petDTO.getWeight(), petDTO.getNote());
            return petRepository.save(pet);
        } else {
            throw new IllegalArgumentException("해당 전화번호로 등록된 회원이 없습니다.");
        }
    }



    // 나의 모든 펫 조회 -----------------------------------------------
    public List<Pet> getMyPets(String phone) {
        log.info("펫 조회 - 사용자: {}", phone);

        if (!memberRepository.existsById(phone)) {
            throw new IllegalArgumentException("해당 회원이 존재하지 않습니다.");
        }

        return petRepository.findByPhone(phone);
    }

}
