// api/distance.js
export default async function handler(req, res) {
    // 1. 프론트엔드에서 보낸 좌표 받기
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: '출발지와 도착지 좌표가 필요합니다.' });
    }

    // 2. 환경변수에서 내 비밀 키 꺼내기 (Vercel 설정에서 가져옴)
    const REST_API_KEY = process.env.KAKAO_REST_API_KEY;

    if (!REST_API_KEY) {
        return res.status(500).json({ error: '서버 API 키 설정 오류' });
    }

    // 3. 카카오 모빌리티 API 호출 (서버끼리 통신)
    const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${start}&destination=${end}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `KakaoAK ${REST_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Kakao API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // 4. 결과를 프론트엔드에게 전달
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '경로 계산 중 오류가 발생했습니다.' });
    }
}
