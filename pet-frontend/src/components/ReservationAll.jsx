import { useEffect, useState } from 'react';
import axios from 'axios';

function ReservationAll() {
    const [filterUnit, setFilterUnit] = useState('month');
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    const completedReservations = reservations.filter((resv) => resv.status === '완료');

    const groupBy = (resList, unit) => {
        const formatter = {
            day: (date) => date.toISOString().split('T')[0],
            month: (date) => `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`,
            quarter: (date) => {
                const q = Math.floor(date.getMonth() / 3) + 1;
                return `${date.getFullYear()}년 ${q}분기`;
            },
            half: (date) => {
                const h = date.getMonth() < 6 ? '상반기' : '하반기';
                return `${date.getFullYear()}년 ${h}`;
            },
            year: (date) => `${date.getFullYear()}년`,
        };

        const map = new Map();
        for (let res of resList) {
            const key = formatter[unit](new Date(res.createdAt));
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(res);
        }

        return map;
    };
    const grouped = groupBy(completedReservations, filterUnit);

    useEffect(() => {
        axios
            .get('/reservation/all')
            .then((res) => {
                setReservations(res.data);
            })
            .catch((err) => {
                console.error('예약 현황 조회 실패:', err);
                setError('예약 정보를 불러오지 못했습니다.');
            });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">전체 예약 현황</h2>
            <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className="form-select mb-3">
                <option value="day">일별</option>
                <option value="month">월별</option>
                <option value="quarter">분기별</option>
                <option value="half">반기별</option>
                <option value="year">연도별</option>
            </select>

            {error && <div className="alert alert-danger">{error}</div>}
            {completedReservations.length === 0 ? (
                <p>완료된 예약이 없습니다.</p>
            ) : (
                <ul className="list-group">
                    {[...grouped.entries()].map(([group, list]) => (
                        <div key={group} className="mb-4">
                            <h4 className="text-primary">{group}</h4>
                            <ul className="list-group">
                                {list.map((resv) => (
                                    <li key={resv.resvId} className="list-group-item">
                                        <strong>시작:</strong> {new Date(resv.start).toLocaleString()} <br />
                                        <strong>종료:</strong> {new Date(resv.end).toLocaleString()} <br />
                                        <strong>장소:</strong> {resv.location} <br />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ReservationAll;
