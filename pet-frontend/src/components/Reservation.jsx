import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function Reservation() {
    const navigate = useNavigate();
    const location = useLocation();
    const sitterPhone = location.state?.sitterPhone || '';
    const toISOString = (datetimeLocalValue) => new Date(datetimeLocalValue).toISOString();

    const [form, setForm] = useState({
        start: '',
        end: '',
        location: '',
        petId: '',
        ownerPhone: '',
        sitterPhone: sitterPhone,
        date: '',
    });
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setForm((prev) => ({ ...prev, date: today }));

        axios.get('/members/check-login').then((res) => {
            setForm((prev) => ({ ...prev, ownerPhone: res.data.phone }));
        });

        axios.get('/pet/my').then((res) => {
            setPets(res.data);
        });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    console.log('현재 form 상태:', form);
    console.log('pets:', pets);
    console.log('선택된 petId:', form.petId, typeof form.petId);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formToSend = {
            ...form,
            start: toISOString(form.start),
            end: toISOString(form.end),
        };

        try {
            const response = await axios.post('/reservation/add', formToSend);
            alert('예약이 완료되었습니다!');
            navigate('/');
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                alert(`에약 에러: ${JSON.stringify(error.response.data)}`);
                console.log('에러: ', error.response);
            } else if (error.request) {
                console.error('응답 에러: ', error.request);
            } else {
                alert('네트워크 오류');
                console.log('네트워크 오류');
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">예약하기</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">예약일자</label>
                    <input type="date" name="date" className="form-control" value={form.date} readOnly />
                </div>
                <div className="mb-3">
                    <label className="form-label">시작 시간</label>
                    <input
                        type="datetime-local"
                        name="start"
                        className="form-control"
                        value={form.start}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">종료 시간</label>
                    <input
                        type="datetime-local"
                        name="end"
                        className="form-control"
                        value={form.end}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">케어 장소</label>
                    <input
                        type="text"
                        name="location"
                        className="form-control"
                        value={form.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">반려동물 선택</label>
                    <select name="petId" className="form-control" value={form.petId} onChange={handleChange} required>
                        <option value="">-- 선택하세요 --</option>
                        {pets.map((pet) => (
                            <option key={pet.petId} value={pet.petId}>
                                {pet.name} ({pet.spec})
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    예약 요청
                </button>
            </form>
        </div>
    );
}

export default Reservation;
