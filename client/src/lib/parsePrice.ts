const parsePrice = (price) =>
  typeof price === 'number' ? price.toLocaleString('ko-KR') + '원' : '가격미정';

export { parsePrice };
