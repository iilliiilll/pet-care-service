import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [isSignIn, setIsSignIn] = useState(false);
    const [isSitter, setIsSitter] = useState(false);

    useEffect(() => {
        axios
            .get('members/check-login')
            .then(() => setIsSignIn(true))
            .catch(() => setIsSignIn(false));

        axios
            .get('members/all')
            .then((res) => setMembers(res.data))
            .catch((err) => console.error('모든 회원 불러오기 실패: ', err));

        axios
            .get('/members/check-login')
            .then((res) => {
                setUser(res.data);

                setIsSitter(res.data.intro && res.data.cert);
            })
            .catch((err) => {
                console.error('유저 불러오기 실패');
            });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">펫시터 목록</h2>
            <div className="row">
                {members
                    .filter((member) => member.intro && member.cert)
                    .map((member) => (
                        <div className="col-md-4 mb-4" key={member.phone}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{member.name}</h5>
                                    <p className="card-text">나이: {member.age}</p>
                                    <p className="card-text">주소: {member.addr}</p>
                                    <p className="card-text">자기소개: {member.intro}</p>
                                    <p className="card-text">자격증: {member.cert}</p>
                                </div>

                                {isSignIn && !isSitter && (
                                    <div className="card-footer text-end">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                navigate('/reservation', { state: { sitterPhone: member.phone } })
                                            }
                                        >
                                            예약하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Home;
