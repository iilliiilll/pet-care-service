import { useEffect, useState } from 'react';
import axios from 'axios';

function MyPage() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: '', age: '', birth: '', addr: '', pw: '', intro: '', cert: '' });
    const [pet, setPet] = useState([]);

    useEffect(() => {
        axios.get('/members/check-login').then((res) => {
            setUser(res.data);
            setForm({
                name: res.data.name,
                age: res.data.age,
                birth: res.data.birth,
                addr: res.data.addr,
                pw: '',
                intro: res.data.intro || '',
                cert: res.data.cert || '',
            });
        });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newForm = { ...form };
        if (!form.pw) {
            delete form.pw;
        }

        try {
            await axios.put(`/members/update/${user.phone}`, newForm);
            alert('회원정보가 수정되었습니다.');
        } catch (err) {
            alert('수정 실패');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">회원정보 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>이름</label>
                    <input name="name" value={form.name} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>나이</label>
                    <input name="age" value={form.age} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>생년월일</label>
                    <input
                        type="date"
                        name="birth"
                        value={form.birth}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>주소</label>
                    <input name="addr" value={form.addr} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>비밀번호</label>
                    <input type="password" name="pw" value={form.pw} onChange={handleChange} className="form-control" />
                </div>

                <div>
                    {user && (user.intro || user.cert) ? (
                        <>
                            <div className="mb-3">
                                <label>자기소개글</label>
                                <textarea
                                    name="intro"
                                    value={form.intro}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label>자격증</label>
                                <input name="cert" value={form.cert} onChange={handleChange} className="form-control" />
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>

                <button className="btn btn-primary">수정</button>
            </form>
        </div>
    );
}

export default MyPage;
