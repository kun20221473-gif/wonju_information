// api/tour.js
export default async function handler(req, res) {
  // 브라우저 CORS 허용 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 서버 환경변수(process.env.TOUR_API_KEY) 또는 쿼리 스트링 키 사용
  const apiKey = process.env.TOUR_API_KEY || req.query.serviceKey;
  const { eventStartDate } = req.query;

  if (!apiKey) {
    return res.status(400).json({ error: 'ServiceKey가 설정되지 않았습니다.' });
  }

  const baseUrl = 'https://apis.data.go.kr/B551011/KorService1/searchFestival1';
  // ServiceKey는 decodeURIComponent 처리 후 안전하게 붙여서 호출
  const decodedKey = decodeURIComponent(apiKey);
  const targetUrl = `${baseUrl}?serviceKey=${encodeURIComponent(decodedKey)}&numOfRows=50&pageNo=1&MobileOS=ETC&MobileApp=MoaWonju&_type=json&listYN=Y&arrange=A&areaCode=32&sigunguCode=9&eventStartDate=${eventStartDate || ''}`;

  try {
    const apiRes = await fetch(targetUrl);
    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: '공공데이터 API 호출 중 오류가 발생했습니다.' });
  }
}
