import { useState } from 'react';
import axios from 'axios';

function SignUp() {
    const [role, setRole] = useState('');
    const [form, setForm] = useState({
        phone: '',
        pw: '',
        name: '',
        age: '',
        birth: '',
        addr: '',
        intro: null,
        cert: null,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.birth.trim().length !== 8) {
            alert('생년월일은 8자리 숫자로 입력해주세요');
            return;
        }

        const birth = `${form.birth.slice(0, 4)}-${form.birth.slice(4, 6)}-${form.birth.slice(6, 8)}`;

        const requestData = {
            ...form,
            birth,
            intro: role === 'sitter' ? form.intro : '',
            cert: role === 'sitter' ? form.cert : '',
        };

        try {
            const response = await axios.post('/members/signUp', requestData);
            alert(response.data);
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                alert(`에러: ${error.response.data}`);
                console.log(`에러: ${error.response.data}`);
            } else {
                alert('네트워크 오류');
                console.log('네트워크 오류');
            }
        }
    };

    // 역할 선택 전
    if (!role) {
        return (
            <div className="container mt-5 text-center">
                <h2 className="mb-4">회원 유형 선택</h2>
                <button className="btn btn-primary m-2" onClick={() => setRole('owner')}>
                    🐶 펫주인
                </button>
                <button className="btn btn-success m-2" onClick={() => setRole('sitter')}>
                    🧑‍⚕️ 펫시터
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">{role === 'owner' ? '펫주인 회원가입' : '펫시터 회원가입'}</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: '전화번호', name: 'phone', type: 'text' },
                    { label: '비밀번호', name: 'pw', type: 'password' },
                    { label: '이름', name: 'name', type: 'text' },
                    { label: '나이', name: 'age', type: 'number' },
                    { label: '생년월일(8자리)', name: 'birth', type: 'text' },
                    { label: '주소', name: 'addr', type: 'text' },
                ].map(({ label, name, type }) => (
                    <div className="mb-3" key={name}>
                        <label className="form-label">{label}</label>
                        <input
                            type={type}
                            className="form-control"
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            maxLength={name === 'birth' ? 8 : undefined}
                            required
                        />
                    </div>
                ))}

                {/* 펫시터 전용 필드 */}
                {role === 'sitter' && (
                    <>
                        <div className="mb-3">
                            <label className="form-label">자기소개</label>
                            <input
                                type="text"
                                className="form-control"
                                name="intro"
                                value={form.intro}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">자격증</label>
                            <input
                                type="text"
                                className="form-control"
                                name="cert"
                                value={form.cert}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary w-50 me-2">
                        가입하기
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary w-50"
                        onClick={() => {
                            setRole('');
                            setForm({
                                phone: '',
                                pw: '',
                                name: '',
                                age: '',
                                birth: '',
                                addr: '',
                                intro: '',
                                cert: '',
                            });
                        }}
                    >
                        뒤로가기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
