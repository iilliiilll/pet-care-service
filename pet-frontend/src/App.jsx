import Header from './components/Header';
import Footer from './components/Footer';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Pet from './components/Pet';
import Reservation from './components/Reservation';
import { useEffect } from 'react';
import axios from 'axios';
import ReservationList from './components/ReservationList';
import MyPage from './components/MyPage';
import ReservationAll from './components/ReservationAll';

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get('/members/check-login')
            .then((res) => {
                console.log('로그인 상태: ', res.data);
            })
            .catch((err) => {
                console.log('로그인 안됨: ', err.response?.data);
                navigate('/signin');
            });
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            <div className="container" style={{ flex: 1, paddingTop: '100px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/pet" element={<Pet />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route path="/reservationlist" element={<ReservationList />} />
                    <Route path="/reservationall" element={<ReservationAll />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
