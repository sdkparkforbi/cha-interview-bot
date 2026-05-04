# 규성 작업 검증 및 병합 보고서

작성일: 2026-05-04

## 목적

박대근 교수님 요청에 따라 규성 학생의 GitHub 작업물을 확인하고, 현재 `cha-interview-bot` 사이트에 필요한 기능을 검증 후 반영했다.

참조 저장소:

- `https://github.com/STARG-LEE/cha-interview-test`

현재 사이트 저장소:

- `https://github.com/sungbongju/cha-interview-bot`

## 백업

병합 전 현재 상태를 아래 브랜치로 보존했다.

- `backup-before-kyusung-merge-20260504`

적용 커밋:

- `a1cd634 feat: add multimodal interview modes`

## 규성 저장소 히스토리 확인

전체 히스토리를 확인했으며, 주요 커밋 흐름은 아래와 같다.

- `2fbc373` - 기존 소스 import
- `dc5ed56` - 아바타 발화 이후 마이크 재시작 수정
- `a371e2e` - 모바일 음성 인식 중복 감소
- `a0bd285` - Kakao JS key를 Vercel 환경변수 기반으로 변경
- `56bba6c` - 학교 API를 Vercel 프록시로 경유
- `c2f9d36` - 카카오 환영 문구 및 교수님 문구 변경
- `4271136` - 방문 환영 문구를 첫 인사말 내부로 이동
- `e3a3366` - 방문 횟수를 한글 서수로 표시
- `72a49eb` - 썸네일 및 인사말 문구 변경
- `26b03aa` - Kakao JS key 하드코딩
- `a126852` - FTF / STS / TTT 대화 모드 추가
- `4728261` - 변경 정리 문서 추가

## 반영한 내용

현재 사이트에 아래 기능을 반영했다.

- FTF / STS / TTT 모드 선택 UI 추가
- TTT 텍스트 전용 모드 추가
- STS 음성 중심 모드 추가
- FTF 사용자 캠 프리뷰 추가
- 교수님 요청에 맞춰 FTF에서 아바타와 사용자 캠이 겹치지 않고 나란히 보이도록 레이아웃 조정
- 모바일 음성 인식 중복 제출 방지 로직 반영
- 아바타 발화 중 마이크 echo loop 방지 로직 강화
- 방문 횟수 기반 한글 서수 인사말 반영
- 학교 API 호출을 `/api/school-api` Vercel 프록시로 경유하도록 변경
- 규성 작업 변경 요약 문서 추가

수정/추가 파일:

- `src/App.jsx`
- `src/components/AvatarPanel.jsx`
- `src/components/AvatarPanel.module.css`
- `src/components/ChatPanel.jsx`
- `src/components/ChatPanel.module.css`
- `src/lib/api.js`
- `api/school-api.js`
- `docs/change-summary-2026-05-04.md`

## 의도적으로 제외한 내용

아래 항목은 현재 사이트 정책과 충돌하거나 요청 범위 밖이라 반영하지 않았다.

- Kakao JavaScript key 하드코딩
  - 현재 사이트에는 기존 `index.html`의 Kakao 초기화가 이미 동작 중이다.
  - 보안/운영 관점에서 별도 재하드코딩은 하지 않았다.
- Open Graph 썸네일 교체
  - 규성 테스트 배지가 들어간 썸네일은 테스트 사이트용 성격이 강해 현재 운영 사이트에는 반영하지 않았다.
- `index.html`의 테스트 사이트 도메인 변경
  - 현재 운영 도메인 `https://cha-interview-bot.vercel.app/` 기준 메타 정보는 유지했다.

## 현재 모드별 동작

### TTT

텍스트 전용 모드다.

- HeyGen 세션을 시작하지 않는다.
- 마이크 버튼을 숨긴다.
- 사용자의 텍스트 질문을 `/api/chat`으로 보낸다.
- `/api/chat`은 Middleton RAG+Gemma4 프록시인 `https://middleton.p-e.kr/finbot/api/interview-chat`으로 요청을 전달한다.

정확히 말하면, TTT는 HeyGen 없이 Middleton RAG+Gemma4 채팅만 사용하는 모드다.

### STS

음성 중심 모드다.

- HeyGen 세션은 생성한다.
- 화면에서는 교수님 아바타 영상을 숨기고 음성 대화용 화면을 보여준다.
- 사용자의 음성 입력은 브라우저 Web Speech API로 텍스트화한다.
- 답변 생성은 TTT와 동일하게 `/api/chat`을 사용한다.
- 생성된 답변은 HeyGen `streaming.task`로 보내 교수님 목소리로 발화한다.

즉, STS는 교수님 아바타 영상은 가리고 교수님 목소리만 들리게 하는 UI 모드다. 다만 기술적으로는 순수 TTS 전용 엔진이 아니라 HeyGen 세션을 사용한다.

### FTF

화상 면담 모드다.

- HeyGen 교수님 아바타 영상을 표시한다.
- 사용자 카메라를 켜서 사용자 캠을 표시한다.
- 현재 레이아웃은 아바타와 사용자 캠을 나란히 보여준다.
- 음성 입력은 브라우저 Web Speech API를 사용한다.
- 답변 생성은 `/api/chat`을 사용한다.
- 답변 발화는 HeyGen `streaming.task`를 사용한다.

현재 사용자 카메라는 프리뷰 표시용이다. 사용자의 얼굴 위치, 표정, 시선, 감정 분석은 아직 구현하지 않았다.

## 검증

로컬 검증:

- `npm run build` 성공
- 개발 서버 `http://127.0.0.1:5173/` 응답 `200` 확인

배포 검증:

- `git push origin master` 완료
- 운영 URL `https://cha-interview-bot.vercel.app/` 응답 `200` 확인
- 배포 번들에서 아래 문구 반영 확인
  - `FTF`
  - `STS`
  - `TTT`
  - `화상 시작`
  - `음성 시작`
  - `텍스트 시작`

## 표정/시선 인식 관련 메모

교수님이 언급하신 “아바타가 사용자의 얼굴을 보고 반응”하는 기능은 현재 반영 범위에는 포함하지 않았다.

가능한 구현 방향:

- 브라우저에서 사용자 카메라 프레임을 분석하는 방식
- 온프레미스 비전 모델/API로 프레임 또는 특징값을 보내 분석하는 방식
- 분석 결과를 대화 컨텍스트에 넣어 Gemma4 답변 생성에 반영하는 방식

주의할 점:

- 사용자의 얼굴/표정/시선 데이터는 민감도가 높다.
- 카메라 권한 안내, 데이터 처리 범위, 저장 여부를 명확히 해야 한다.
- 현재 FTF의 사용자 캠은 분석 없이 화면 표시만 수행한다.

## 결론

규성 학생 작업은 히스토리를 기준으로 검증했고, 현재 운영 사이트에 필요한 핵심 기능을 선별 반영했다.

현재 사이트는 세 모드를 제공한다.

- TTT: 텍스트 전용 Gemma4 상담
- STS: 아바타 영상 없이 교수님 목소리 중심 상담
- FTF: 교수님 아바타와 사용자 캠을 나란히 보여주는 화상 상담
