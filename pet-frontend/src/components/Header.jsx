import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Header() {
    const [isSignIn, setIsSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isSitter, setIsSitter] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('/members/check-login')
            .then((res) => {
                setIsSignIn(true);
                setUser(res.data);
                setIsSitter(res.data.intro && res.data.cert);
            })
            .catch(() => {
                setIsSignIn(false);
                setUser(null);
                setIsSitter(false);
            });
    }, [location.pathname]);

    const handleSignOut = async () => {
        try {
            await axios.post('/members/signOut');
            setIsSignIn(false);
            alert('로그아웃 성공');
            navigate('/');
            window.location.reload();
        } catch (error) {
            alert('로그아웃 실패');
            console.log(`error: ${error.response.data}`);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('정말 회원탈퇴 하시겠습니까?');

        if (!confirmed) return;

        try {
            await axios.get(`/members/delete/${user.phone}`);
            await axios.post('/members/signOut');
            setIsSignIn(false);
            alert('회원탈퇴 하였습니다.');
            window.location.reload();
            navigate('/');
        } catch (error) {
            alert('회원탈퇴에 실패했습니다.');
            console.error(error);
        }
    };

    const getUserRole = () => {
        if (!user) return '';
        return user.intro && user.cert ? '펫시터' : '펫주인';
    };

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-light px-4 fixed-top shadow py-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <span
                        style={{ fontSize: '1.5rem', fontFamily: 'monospace', paddingLeft: '5rem', color: 'lightblue' }}
                    >
                        🐾 Pet Care
                    </span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!isSignIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signin">
                                        로그인
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">
                                        회원가입
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                {!isSitter && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/pet">
                                            펫 등록
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/reservationlist">
                                        예약 조회
                                    </Link>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <Link className="nav-link" to="/mypage">
                                        {user.name} ({getUserRole()})
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-danger" onClick={handleSignOut}>
                                        로그아웃{' '}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-danger" onClick={handleDeleteAccount}>
                                        회원탈퇴{' '}
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link text-primary" to="/reservationall">
                                예약현황{' '}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
