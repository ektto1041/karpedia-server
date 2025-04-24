# Karpedia BE · 2023.03 ~ 2024.03

**Karpedia**는 학습 내용을 정리하는 개인 블로그이자 포트폴리오입니다.

(※ 현재는 배포되지 않은 개인 프로젝트입니다.)

## 😀 개발 인원

| 이름 | 역할 | 연락처 |
| --- | --- | --- |
| 박상연 | * | [dhkdwk1041@gmail.com](mailto:dhkdwk1041@gmail.com) |

## 🛠 프로젝트 기술 스택

- **프론트엔드**: Next.js (v12), typescript, css module, TipTap Editor, axios, dayjs, redux, SWR
- **백엔드**: Nest.js, typescript, MySQL
- **배포**: Vercel, AWS (EC2, S3, Route 53), Docker

## 📞 API

| API 명 | 설명 |
| --- | --- |
| `google login API` | 구글 계정을 활용하여 로그인 지원 |

## 🌐 Deploy

- **프론트엔드**: Vercel에 FE 레퍼지토리를 등록하여 자동 배포되도록 관리했습니다.
- **백엔드**: Nest.js 서버를 하나의 컨테이너로, MySQL DB 서버를 하나의 컨테이너로 하나의 EC2 인스턴스에 실행시켜서 배포했습니다.

## ✏️ Issue

### Next.js를 활용한 이유

블로그는 데이터의 생성, 수정, 삭제가 비교적 예측 가능하고, 그 빈도 또한 낮은 편입니다. 이러한 특성상 사용자 요청 시마다 데이터를 가져오는 CSR 방식보다는, 정적 페이지를 미리 생성해두는 SSG 방식이 더 적합하다고 판단했습니다. Next.js는 이러한 SSG를 효율적으로 지원하므로, 성능과 사용자 경험 측면에서 유리하다고 생각하여 선택하게 되었습니다.
