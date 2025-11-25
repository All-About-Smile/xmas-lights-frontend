## 1. 도메인 모델 설계 (DDD 기반)

### 1) User (회원)

**역할**
- 고유 user_id 부여
- 개인 롤링페이퍼 트리의 오너

**필드**
`User - id (PK) - email - password_hash - nickname (optional) - created_at - updated_at`

---

### 2) RollingPaper (사용자 1명당 1개)

**역할**
- 특정 사용자의 개인 롤링페이퍼
- 공유 링크 생성
- 편지 공개일(open_date) 관리
    
**필드**
`RollingPaper - id (PK) - owner_id (FK → User) - theme - open_date (default: 2025-12-25) - created_at - share_url`

- 공유 링크를 id로 구분하게 된다면, share_url는 없어도 될 것 같다.
    

---

### 3) Letter (편지)

**역할**
- 오너에게 전달되는 개별 메시지
- 작성자는 회원/비회원 모두 가능
    

**필드**
`Letter - id (PK) - rolling_paper_id (FK) - letter_number - writer_nickname - content - ornament_type - created_at - is_deleted - password_for_edit`

---

## 2. 도메인 관계 (ERD)
`User ─── 1:1 ─── RollingPaper ─── 1:N ─── Letter`