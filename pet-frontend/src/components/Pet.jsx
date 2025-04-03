import { useState } from 'react';
import axios from 'axios';

function Pet() {
    const [pet, setPet] = useState({
        spec: '',
        name: '',
        age: '',
        weight: '',
        note: '',
    });

    const handleChange = (e) => {
        setPet({ ...pet, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/pet/register', pet);
            alert('펫 등록이 완료되었습니다.');
        } catch (error) {
            if (error.response) {
                alert(`error: ${error.response.data}`);
                console.log(`error: ${error.response.data}`);
            } else {
                alert('네트워크 오류');
                console.log('네트워크 오류');
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">펫 등록</h2>
            <form onSubmit={handleSubmit}>
                {[
                    { label: '이름', name: 'name', type: 'text' },
                    { label: '종(species)', name: 'spec', type: 'text' },
                    { label: '나이', name: 'age', type: 'number' },
                    { label: '몸무게', name: 'weight', type: 'number' },
                    { label: '특이사항', name: 'note', type: 'text' },
                ].map(({ label, name, type }) => (
                    <div className="mb-3" key={name}>
                        <label className="form-label">{label}</label>
                        <input
                            type={type}
                            className="form-control"
                            name={name}
                            value={pet[name]}
                            onChange={handleChange}
                            required={name !== 'note'}
                        />
                    </div>
                ))}

                <button type="submit" className="btn btn-primary w-100">
                    등록하기
                </button>
            </form>
        </div>
    );
}

export default Pet;
