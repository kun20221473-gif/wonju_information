export default async function handler(req, res) {
  // CORS 헤더 설정 (클라이언트 접근 허용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { serviceKey, endpoint = 'areaBasedList1', ...params } = req.query;
  const API_KEY = process.env.TOUR_API_KEY || serviceKey;

  if (!API_KEY) {
    return res.status(400).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  // TourAPI 4.0 URL 구성
  const queryParams = new URLSearchParams({
    numOfRows: '20',
    pageNo: '1',
    MobileOS: 'ETC',
    MobileApp: 'MoaWonju',
    _type: 'json',
    areaCode: '32', // 강원도
    siegunguCode: '9', // 원주시
    serviceKey: decodeURIComponent(API_KEY),
    ...params
  });

  const targetUrl = `https://apis.data.go.kr/B551011/KorService1/${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'API 호출 실패', details: error.message });
  }
}
