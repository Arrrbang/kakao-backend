export default async function handler(req, res) {
    // CORS 처리
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ error: '좌표가 필요합니다.' });
    }

    const REST_API_KEY = process.env.KAKAO_REST_API_KEY;

    if (!REST_API_KEY) {
        return res.status(500).json({ error: 'Server Key Error' });
    }

    try {
        const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${start}&destination=${end}`;
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
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Backend Error' });
    }
}
