import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignIn() {
    const [phone, setPhone] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/members/signIn', {
                phone,
                pw,
            });

            console.log(response.data);
            alert(response.data);

            navigate('/');
        } catch (error) {
            if (error.response) {
                alert(`로그인 에러: ${error.response.data}`);
                console.log(`로그인에러: ${error.response.data}`);
            } else {
                alert('네트워크 오류 발생');
                console.log(`네트워크 오류 발생`);
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">로그인</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        전화번호
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="pw" className="form-label">
                        비밀번호
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="pw"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    로그인
                </button>
            </form>
        </div>
    );
}

export default SignIn;
