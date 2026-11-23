export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { serviceKey, endpoint = 'searchFestival1', ...params } = req.query;
  const API_KEY = process.env.TOUR_API_KEY || serviceKey;

  if (!API_KEY) {
    return res.status(400).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  // 기본 파라미터 셋업 (sigunguCode 오타 수정)
  const baseParams = {
    numOfRows: '20',
    pageNo: '1',
    MobileOS: 'ETC',
    MobileApp: 'MoaWonju',
    _type: 'json',
    areaCode: '32',   // 강원특별자치도
    sigunguCode: '9', // 원주시
    ...params
  };

  // URLSearchParams 이중 인코딩 문제 방지를 위해 Raw String 결합 처리
  const extraQueryString = new URLSearchParams(baseParams).toString();
  const targetUrl = `https://apis.data.go.kr/B551011/KorService1/${endpoint}?serviceKey=${API_KEY}&${extraQueryString}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'API 호출 실패', details: error.message });
  }
}
