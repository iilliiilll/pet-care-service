import { useEffect, useState } from 'react';
import axios from 'axios';

function ReservationList() {
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios
            .get('/members/check-login')
            .then((res) => {
                setUser(res.data);

                const isSitter = res.data.intro && res.data.cert;
                const url = isSitter ? `/reservation/sitter/${res.data.phone}` : `/reservation/owner/${res.data.phone}`;

                return axios.get(url);
            })
            .then((res) => {
                const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setReservations(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error('예약 조회 실패', err);
                setError('예약 정보를 불러오지 못했습니다.');
            });
    }, []);

    const handleCancel = (resvId) => {
        axios
            .put(`/reservation/cancel/${resvId}`)
            .then(() => {
                alert('예약을 취소했습니다.');
                setReservations((prev) => prev.map((r) => (r.resvId === resvId ? { ...r, status: '취소' } : r)));
            })
            .catch(() => alert('예약 취소에 실패했습니다.'));
    };

    const handleAccept = (resvId) => {
        axios
            .put(`/reservation/accept/${resvId}`)
            .then(() => {
                alert('예약을 수락했습니다.');
                setReservations((prev) => prev.map((r) => (r.resvId === resvId ? { ...r, status: '수락' } : r)));
            })
            .catch(() => alert('예약 수락에 실패했습니다.'));
    };

    const handleComplete = (resvId) => {
        axios
            .put(`reservation/complete/${resvId}`)
            .then(() => {
                alert('케어가 종료되었습니다.');
                setReservations((prev) => prev.map((r) => (r.resvId === resvId ? { ...r, status: '완료' } : r)));
            })
            .catch(() => alert('예약 종료를 실패했습니다.'));
    };

    return (
        <div className="container mt-5" style={{ marginBottom: '10%' }}>
            <h2 className="mb-4">내 예약 목록</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {reservations.length === 0 ? (
                <p>등록된 예약이 없습니다.</p>
            ) : (
                <ul className="list-group">
                    {reservations.map((resv) => (
                        <li
                            className="list-group-item rounded"
                            key={resv.resvId}
                            style={{ position: 'relative', marginTop: '1rem' }}
                        >
                            <strong>예약 ID:</strong> {resv.resvId} <br />
                            <strong>예약 일시:</strong> {new Date(resv.createdAt).toLocaleString()} <br />
                            <strong>시작:</strong> {new Date(resv.start).toLocaleString()} <br />
                            <strong>종료:</strong> {new Date(resv.end).toLocaleString()} <br />
                            <strong>장소:</strong> {resv.location} <br />
                            <strong>펫주인:</strong> {resv.ownerPhone} <br />
                            <strong>펫시터:</strong> {resv.sitterPhone} <br />
                            <strong>펫 ID:</strong> {resv.petId} <br />
                            <strong>상태:</strong> {resv.status} <br />
                            {user &&
                                resv.status === '대기' &&
                                (user.intro && user.cert ? (
                                    <button
                                        className="btn btn-success btn-sm"
                                        style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                                        onClick={() => handleAccept(resv.resvId)}
                                    >
                                        예약 수락
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                                        onClick={() => handleCancel(resv.resvId)}
                                    >
                                        예약 취소
                                    </button>
                                ))}
                            {user && resv.status === '수락' && !user.intro && !user.cert && (
                                <button
                                    className="btn btn-success btn-sm"
                                    style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                                    onClick={() => handleComplete(resv.resvId)}
                                >
                                    예약 완료
                                </button>
                            )}
                            {user && resv.status === '완료' && (
                                <button
                                    className="btn btn-warning btn-sm"
                                    style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                                >
                                    후기 남기기
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ReservationList;
