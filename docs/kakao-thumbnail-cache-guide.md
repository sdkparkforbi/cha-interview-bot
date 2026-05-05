# 카카오톡 썸네일 캐시 문제 해결 가이드

카카오톡은 한 번 본 URL의 OG 썸네일을 **공격적으로 캐싱**하기 때문에, 썸네일을 새로 만들거나 변경해도 카톡에서는 옛날 이미지가 계속 보일 수 있다. 이 문서는 그 문제를 해결하는 두 가지 방법을 정리한다.

## 방법 1 — 카카오 OpenGraph 캐시 초기화 (가장 확실)

카카오에서 공식적으로 제공하는 도구로 캐시를 즉시 초기화한다.

1. 브라우저에서 다음 주소 열기:
   ```
   https://developers.kakao.com/tool/clear/og
   ```
2. **카카오 계정으로 로그인** (개인 카카오 계정이면 됨, 별도 개발자 등록 불필요)
3. **공유한 URL을 입력** — 예:
   ```
   https://sdkparkforbi.github.io/cha-interview-bot/trust-components-map.html
   ```
4. **"초기화" 버튼 클릭**
5. 잠시 후 카카오톡에서 해당 링크를 다시 공유하면 새 썸네일이 보인다.

> 캐시 초기화는 즉시 반영되지만, 카카오톡 앱 자체의 캐시도 있어서 본인 카톡에서 안 바뀐다면 카톡 앱을 재시작하거나 다른 사람과 공유해서 확인하는 것이 빠르다.

## 방법 2 — 썸네일 URL에 버전 쿼리 붙이기 (예방책)

`trust-components-map.html`의 OG 메타태그에서 이미지 URL에 `?v=...` 같은 버전 쿼리를 붙이면, 썸네일을 업데이트할 때마다 버전 번호만 바꾸면 카카오가 새로운 URL로 인식해서 새로 가져온다.

현재 적용된 형태:

```html
<meta property="og:image" content="https://sdkparkforbi.github.io/cha-interview-bot/og-trust-components.png?v=20260505">
```

썸네일 이미지를 수정·교체할 때마다 위 `v=20260505` 부분을 새 날짜(예: `v=20260612`)로 바꿔서 commit & push 하면 카카오가 새 URL로 인식한다.

## 방법 3 — 썸네일 파일명 자체를 버전화 (가장 확실하지만 번거로움)

극단적으로 캐시를 피하고 싶으면 파일명 자체를 바꾼다.

- `og-trust-components.png` → `og-trust-components-v2.png`

OG 메타태그도 함께 수정해야 한다.

## 우선 사용 권장 순서

1. **방법 1 (Kakao 공식 도구)** — 한 번에 끝남. 가장 확실.
2. **방법 2 (버전 쿼리)** — 평소 운영 시 자동 대응책으로 미리 박아둠.
3. **방법 3 (파일명 변경)** — 1, 2가 안 통할 때만.

## 주의: GitHub Pages 활성화 전제

위 모든 방법은 **GitHub Pages가 활성화되어 OG 이미지 URL이 실제로 도달 가능한 상태**여야 작동한다.

GitHub Pages 활성화:

1. https://github.com/sdkparkforbi/cha-interview-bot/settings/pages 열기
2. Source: **`master`** branch + **`/docs`** folder 선택
3. Save 클릭
4. 1-2분 후 다음 주소가 살아있는지 확인:
   ```
   https://sdkparkforbi.github.io/cha-interview-bot/trust-components-map.html
   ```
5. 그 다음에 위 방법 1 (Kakao 캐시 초기화)을 실행한다.

## 트러블슈팅

**Q. 카카오 캐시 초기화 도구에서 "OG 정보를 가져올 수 없음" 에러가 나옴**
A. GitHub Pages가 아직 배포 중이거나 OG 메타태그가 잘못된 경우. 브라우저로 URL을 직접 열어서 페이지가 보이는지, 페이지 소스에 `og:image` 메타태그가 있는지 확인.

**Q. 새 썸네일을 commit & push 했는데 카카오에서 옛날 썸네일이 계속 보임**
A. (1) GitHub Pages가 새 파일을 배포할 때까지 1-2분 대기 → (2) 방법 1로 카카오 캐시 초기화 → (3) 그래도 안 되면 방법 2로 버전 쿼리 변경.

**Q. 본인은 새 썸네일이 보이는데 다른 사람은 옛날 거 봄**
A. 카카오톡 앱에 캐시가 남아있는 것. 상대방이 카톡 앱을 종료 후 재시작하거나, 새 채팅방에서 링크를 다시 공유하면 갱신된다.
