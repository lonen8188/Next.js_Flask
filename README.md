# next-app 폴더에서 
# 1. 패키지 리스트 업데이트
# sudo apt update

# 2. Node.js 설치 (npm도 같이 설치됩니다)
# sudo apt install -y nodejs npm

# 3. 설치 확인 (버전이 나오면 성공)
# node -v
# npm -v
# npm install socket.io-client 명령어를 미리 실행

# 3000번 포트 허용 (Next.js)
# sudo ufw allow 3000/tcp

# (이미 되어있겠지만) 5000번 포트 확인 (Flask API)
# sudo ufw allow 5000/tcp

# 방화벽 상태 확인
# sudo ufw reload
# sudo ufw status

# # 1. 프로젝트 폴더로 이동
# cd ~/yolo-server/next-app

# 2. 도커 이미지를 빌려와서 현재 폴더(.)에 Next.js 프로젝트 생성
# (설정 질문이 나오면 모두 Enter 또는 Yes를 누르세요)
# docker run --rm -it -v $(pwd):/app -w /app node:20-alpine npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Ok to proceed? (y) -> y 입력
# 나머지 모든 질문 -> Enter만 계속 치세요.

# 성공 시: Success! Created next-app at /app 문구가 뜹니다

# AI 영상 데이터를 소켓으로 받아오기 위해 필수 라이브러리를 설치합니다.
# docker run --rm -v $(pwd):/app -w /app node:20-alpine npm install socket.io-client

# next-app 폴더에 Dockerfile 파일생성
-----------------------------------------------------------
FROM node:20-alpine

WORKDIR /app

# 1. 의존성 설치 (이 부분은 유지)
COPY package*.json ./
RUN npm install

# 2. 소스 복사
COPY . .

# 3000번 포트 노출
EXPOSE 3000

# 3. 개발 서버 실행 (수정 사항 즉시 반영)
CMD ["npm", "run", "dev"]

-------------------------------------------------

requirements.txt 에 추가 내용 
# Next.js 연동을 위한 CORS 허용 패키지
flask-cors==5.0.0

ls -F 실행시 아래 목록이 보이면 성공
app/  node_modules/  package.json  public/  next.config.mjs  Dockerfile ...

cd ~/yolo-server
docker compose up --build 

docker compose ps # 프로세스 확인용
WARN[0000] /home/ai320/yolo-server/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
NAME       IMAGE                  COMMAND                  SERVICE    CREATED          STATUS          PORTS
flask      yolo-server-flask      "python LMS/app.py"      flask      38 minutes ago   Up 37 minutes   0.0.0.0:5000->5000/tcp, [::]:5000->5000/tcp
mysql      mysql:8.0              "docker-entrypoint.s…"   mysql      26 hours ago     Up 3 hours      0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp, 33060/tcp
next-app   yolo-server-frontend   "docker-entrypoint.s…"   frontend   38 minutes ago   Up 12 minutes   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp

권한 부족으로 저장시 오류 발생 -> 소유권변경
sudo chown -R ai320:ai320 ~/yolo-server/next-app 

캐시 및 빌드 파일 삭제
도커 환경에서 꼬인 파일을 싹 정리하고 다시 빌드합니다.

Bash
cd ~/yolo-server

# 1. 컨테이너 중지 및 볼륨 삭제
docker compose down
# 1. 컨테이너 중지 및 관련 이미지 삭제
docker compose down --rmi all

# 2. 캐시 폴더 강제 삭제 (sudo 권한 필요할 수 있음)
sudo rm -rf next-app/.next

# 2. 캐시 없이 완전히 새로 빌드 (패키지 설치 과정을 다시 수행)
docker compose build --no-cache 
# 3. 다시 빌드 및 실행
docker compose up --build

# 4. 용량 부족시 해결법
# 4.1. 사용하지 않는 모든 도커 리소스(이미지, 컨테이너, 볼륨, 네트워크) 정리
docker system prune -a --volumes -f

# 4.2. (선택) 빌드 캐시만 따로 한 번 더 정리
docker builder prune -f
docker builder prune -a -f

# 5. 코드 수정시
코드 수정 시: 이제 build를 매번 하실 필요 없다
volumes 설정이 되어 있다면 코드만 고치고 docker compose restart flask만 해도 바로 반영됩니다.

패키지 추가 시: 
requirements.txt에 새 라이브러리를 적었을 때만 docker compose build flask
이때는 --no-cache 없이 해도 torch는 캐시를 써서 사용됨

로그 확인: PYTHONUNBUFFERED=1 덕분에 이제 
docker compose logs -f flask를 치면 실시간으로 YOLO 탐지 결과나 에러 보임

# 6. 코드 수정후에도 변경이 안될때
# 6.1. 컨테이너 중지 및 관련 볼륨 삭제
docker compose down

# 6.2. 로컬에 있는 .next 폴더 삭제 (이게 남아있으면 도커가 계속 옛날 파일을 읽습니다)
# 윈도우라면 폴더 삭제, 리눅스라면 아래 명령어:
rm -rf ./next-app/.next

# 6.3. 캐시 없이 다시 빌드 및 실행
docker compose up -d --build

-----------Next.js로 개발 시작하면 “React + 백엔드 + 성능 최적화까지 한 번에 제공되는 프레임워크”------
1. 파일 기반 라우팅 : 폴더 구조가 곧 URL이 됩니다.

app/
 ├─ page.tsx        → /
 ├─ login/page.tsx  → /login
 └─ user/[id]/page.tsx → /user/123


2. 기본 컴포넌트가 서버에서 실행됩니다.

export default async function Page() {
  const data = await fetch("https://api");
  return <div>{data.name}</div>;
}

3. 렌더링 방식 4가지 (이게 Next.js의 가장 중요한 개념)
방식	설명	            사 용 예
CSR 	브라우저            렌더링	대시보드
SSR	    요청마다            서버 렌더	로그인 페이지
SSG	    빌드 시 생성	    블로그
ISR 	정적 + 자동 갱신	쇼핑몰

4. 레이아웃 시스템 (공통 UI 재사용)
app/layout.tsx
<html>
  <body>
    <Header />
    {children}
  </body>
</html>

페이지마다 헤더/푸터 반복 작성 안 해도 됨

5. 최신 Next.js 핵심 기능 (App Router 기준)
App Router 구조
app/                지원 기능
 ├─ layout.tsx      중첩 라우팅
 ├─ page.tsx        스트리밍 렌더링
 ├─ loading.tsx     로딩 UI
 ├─ error.tsx       에러 UI
 └─ api/


6. 서버 액션 (폼 처리 혁신 기능)

폼 → fetch → API → 응답

Next.js 최신 방식:

<form action={createUser}>

"use server"
export async function createUser(formData: FormData) {
  await db.insert(formData)
} → API 없이 바로 서버 함수 실행

장점 : 브라우저 JS 번들 감소 / API 키 노출 방지 / 서버에서 바로 DB 접근 가능


------------------------ React 컴포넌트(Component) 개념 (Next.js는 React 위에서 동작)-----------------------------------------------

1. 컴포넌트(Component) 개념 : React는 화면을 작은 블록 단위로 나눠서 조립하는 방식입니다.

웹페이지 -> 각각이 컴포넌트입니다.
 ├─ Header
 ├─ Sidebar
 ├─ Content
 └─ Footer 

2. 컴포넌트 기본 문법 (함수 = 컴포넌트)

생성 : 대문자로 시작하는 함수

function Hello() {
  return <h1>Hello React</h1>;
}

export default Hello;

사용 : JSX 반환 = 화면

<Hello />

3. JSX 문법 핵심 : React는 HTML처럼 보이지만 JavaScript 안에서 동작합니다.

const name = "Kim";
return <h1>Hello {name}</h1>;

특징 : 
{ } 안에 JS 코드 사용 가능 / class → className / for → htmlFor

4. 컴포넌트 재사용 (Props) : 컴포넌트에 데이터를 전달할 수 있습니다.

생성 : 
function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

사용:

<Hello name="Kim" />
<Hello name="Lee" />

결과:

Hello Kim
Hello Lee

Props = 부모 → 자식 데이터 전달


5. 상태(State) 개념 : State는 컴포넌트 내부에서 변하는 값입니다.
예: 버튼 클릭 횟수 / 로그인 여부 / 입력창 내용


6. useState 기본 사용법

생성 : 
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </>
  );
}

구조 설명: [count, setCount] = useState(초기값)
변수	    의미
count	    현재 상태 값
setCount	상태 변경 함수

7. 왜 상태를 직접 바꾸면 안 되는가 

잘못된 방식 : 
count = count + 1; React는 변경을 감지하지 못합니다.

올바른 방식 : 보안상 세터를 사용함(타입감지)
setCount(count + 1); 

이유:
React는 setState 호출을 기준으로 렌더링을 다시 실행합니다.


8. 이벤트 처리 : React에서는 HTML과 다르게 카멜케이스를 사용합니다.
버튼생성 :
<button onClick={handleClick}>클릭</button>

함수로 구동 : 
function handleClick() {
  alert("클릭됨");  // 결과 출력
}

9. 입력값 처리 (폼 상태 관리)

function Input() {
  const [text, setText] = useState("");

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

이걸 Controlled Component 라고 합니다.

10. 컴포넌트 + 상태 흐름 요약

React 동작 구조:

상태 변경
   ↓
setState 호출
   ↓
컴포넌트 재실행
   ↓
화면 갱신

즉:
React = 상태 기반 UI 렌더링 엔진

11. 가장 많이 쓰는 패턴 3가지

1. 토글 버튼
const [open, setOpen] = useState(false);

2. 카운터
setCount(count + 1);

3. 입력폼
onChange={(e) => setValue(e.target.value)}

이 3개 패턴이 거의 모든 서비스에서 반복됩니다. 

12. 핵심 한 줄 정리

React는:
UI = f(state)

즉, 상태가 바뀌면 화면이 자동으로 다시 그려진다는 구조입니다.

---------------useEffect는 React에서 “컴포넌트가 화면에 렌더링된 이후에 실행되는 코드”를 작성할때 사용하는 hook----------------------
렌더링과 무관한 작업(부수 효과, side effect) 을 처리하는 용도

1. 왜 useEffect가 필요한가 : React는 기본적으로 UI 렌더링 함수입니다.

UI = f(state)

하지만 실제 앱에서는 이런 작업도 필요합니다. 
1. 서버 API 호출
2. 타이머 설정 
3. 이벤트 리스너 등록 
4. 로컬스토리지 접근

이런 것들은 렌더링 외부 작업이므로 → useEffect에서 처리합니다.

2. 기본 문법

생성 : 
import { useEffect } from "react";

useEffect(() => {
  console.log("렌더링 후 실행됨");
});

실행 시점: 렌더링 → 화면 표시 → useEffect 실행

3. 가장 중요한 구조

useEffect(() => {
  // 실행 코드
}, [의존성]);

요소	        의미
첫 번째 함수	실행할 코드
두 번째 배열	언제 실행할지 조건(의존성)


4. 실행 타이밍 3가지 패턴

4.1 매 렌더링마다 실행
useEffect(() => {
  console.log("항상 실행");
}); 
상태 변경 → 다시 실행


4.2 최초 1회만 실행 (가장 많이 사용)
useEffect(() => {
  console.log("처음에만 실행");
}, []);

사용 예: 초기 데이터 로딩

useEffect(() => {
  fetch("/api/user");
}, []);

사용 예: 로그인 상태 확인


4.3 특정 상태가 변경될 때만 실행
useEffect(() => {
  console.log("count 변경됨");
}, [count]);

즉: count 변경 → effect 실행

5. 실제 예제 (API 호출)

function User() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return <div>{user?.name}</div>;
}

흐름: 렌더링 → useEffect → fetch → setUser → 재렌더링

6. 정리 함수 (cleanup) – 매우 중요
이벤트나 타이머는 제거하지 않으면 메모리 누수가 발생합니다.

useEffect(() => {
  const id = setInterval(() => {
    console.log("실행");
  }, 1000);

  return () => {
    clearInterval(id);
  };
}, []);

구조: 실행 → 컴포넌트 제거 → cleanup 실행

7. 이벤트 리스너 예제

useEffect(() => {
  const handler = () => console.log("resize");

  window.addEventListener("resize", handler);

  return () => {
    window.removeEventListener("resize", handler);
  };
}, []);

이 패턴은 실무에서 매우 자주 사용됩니다.

8. useEffect 실행 순서 이해

컴포넌트 동작 순서:
1. render()
2. 화면 업데이트
3. useEffect 실행

즉: 렌더링 전에 실행되지 않습니다.


9. useEffect를 쓰면 안 되는 경우

초보자가 가장 많이 하는 실수: 렌더링 계산을 useEffect에서 하는 것

useEffect(() => {
  setTotal(price * count);
}, [price, count]);

이건 이렇게 해야 합니다:
const total = price * count;
->useEffect는 외부 작업에만 사용

---------------------- 쿠키관련 설정-------------------------------------------------

지금 작성하신 코드는 쿠키(Cookie)를 기반으로 하는 세션 방식을 사용하고 있다.


1. 프론트엔드(fetch 옵션)
Next.js 코드에서 API를 호출할 때 사용한 이 옵션이 핵심입니다.

JavaScript
{ credentials: "include" }
의미: 이 옵션은 "요청을 보낼 때 브라우저에 저장된 쿠키를 함께 실어서 보내라"는 뜻입니다.

만약 이 옵션이 없다면, 로그인을 했더라도 브라우저가 쿠키를 보내지 않아 서버(Flask)는 누군지 알아볼 수 없다.

2. 백엔드(Flask session)
Flask 코드에서 사용하신 session 객체는 기본적으로 쿠키를 저장소로 사용함

Python
if 'user_id' in session:  # 세션(쿠키)에서 정보를 꺼냄
    user_id = session.get('user_id')
작동 원리:

사용자가 로그인에 성공하면, Flask는 session 데이터를 암호화해서 브라우저에게 session이라는 이름의 쿠키로 만듬

브라우저는 이후 모든 요청(상세 조회, 삭제 등)을 보낼 때 이 쿠키를 자동으로 헤더에 담아 보냄

Flask는 들어온 쿠키를 복호화해서 "아, 이 사람은 user_id가 5번인 김기원님이구나!"라고 알아채는 방식


------------------------레이아웃 페이지 변경---------------------------------------------------------------
flask-app\templates\layout.html -> next-app\app\layout.tsx 역할을 대체함

class → className: React(Next.js)에서는 HTML 예약어인 class 대신 className을 사용합니다.
{% block content %} → {children}: 상위 레이아웃에서 하위 페이지 내용을 렌더링할 때 사용하는 문법입니다.

Client-Side Hydration: 부트스트랩 드롭다운(data-bs-toggle)이 작동하려면 JS 파일이 필요하므로 RootLayout 하단에 <script>를 추가했습니다.

------------------------메인 페이지 변경---------------------------------------------------------------
flask-app\templates\main.html -> next-app\app\page.tsx 역할을 대체함
주요 변경 사항 및 팁
기존에 사용하시던 main.html의 3컬럼 카드 레이아웃을 Next.js의 app/page.tsx로 옮겨보겠습니다.
Next.js(React)에서는 {% if %} 같은 Jinja2 문법 대신 **삼항 연산자(? :)**를 사용하여 로그인 여부에 따른 버튼을 렌더링합니다.

w-100 추가: 부트스트랩 카드가 컨테이너 너비에 꽉 차도록 w-100 클래스를 추가했습니다.

isLoggedIn 상태:
기존의 session.get('user_id') 역할을 합니다.
나중에는 이 값을 **브라우저의 쿠키(Cookie)**나 로컬 스토리지, 또는 Context API를 통해 관리하게 됩니다.

suppressHydrationWarning:
서버와 클라이언트의 렌더링 결과가 미세하게 다를 때 발생하는 경고를 방지하기 위해 추가했습니다 (부트스트랩 연동 시 유용합니다).

로그인 페이지 생성 (폴더 및 파일)
먼저 터미널에서 로그인 페이지용 폴더를 만듭니다


------------------------로그인 페이지 변경---------------------------------------------------------------
mkdir -p ~/yolo-server/next-app/app/login
파일 생성 app/login/page.tsx


주요 변경 사항 및 팁
폴더 구조가 주소(URL)가 됩니다:
app/login/page.tsx를 만들면 자동으로 http://localhost:3000/login 주소가 생깁니다.

use client:
버튼 클릭이나 입력값 처리 같은 사용자 상호작용이 있는 페이지 상단에는 반드시 이 문구를 써야 합니다.
로그인 처리 방식:

기존 Flask는 action="/login"으로 페이지를 통째로 서버에 던졌지만, Next.js는 보통 fetch나 axios를 사용해 Flask API 서버(5000포트)와 비동기로 데이터를 주고받습니다.

**fetch**는 쉽게 말해서 브라우저가 **"네트워크를 통해 다른 서버에 데이터를 요청하고 받아오는 기능"**이에요.
기존에 사용하시던 Flask(Jinja2) 방식과 Next.js 방식의 결정적인 차이점이 바로 이 fetch에 있습니다.

1. Flask vs Next.js 데이터 전송 차이
기존 방식 (Flask HTML):
<form action="/login" method="POST">를 쓰면, 버튼을 누르는 순간 브라우저 화면이 새로고침되면서 서버로 데이터를 통째로 던집니다. 서버가 응답을 주면 화면이 통째로 바뀝니다.

새로운 방식 (Next.js + fetch):
화면은 그대로 가만히 있고, 배후(Background)에서 fetch라는 비서가 Flask 서버(:5000)에 몰래 가서 "이 아이디랑 비번 맞는지 확인해줘"라고 물어보고 결과값(JSON)만 받아옵니다. 화면 새로고침 없이 "로그인 성공!" 메시지만 띄우거나 페이지를 이동시킬 수 있죠.

------------------------회원가입 페이지 변경---------------------------------------------------------------
회원가입(join) 페이지 만들기

로그인창과 비슷하게 app/join/page.tsx 폴더와 파일을 만들어서 회원가입 폼을 구성합니다.
로그인 기능 활성화 (Flask 연동)
로그인 버튼을 눌렀을 때, Next.js에서 fetch를 사용해 Flask 서버(5000 포트)로 데이터를 보내고 실제 로그인이 되는지 확인합니다.

내비게이션 바 상태 연동
로그인이 성공하면 상단 메뉴에 **"OOO님 환영합니다"**가 뜨고, 메뉴 구성이 바뀌도록 설정합니다.

mkdir -p ~/yolo-server/next-app/app/join
/join/page.tsx 생성


달라진 포인트
onSubmit={handleSubmit}:
HTML 폼의 action="/join" 대신 JavaScript 함수인 handleSubmit이 가로채서 처리합니다.

e.preventDefault():
fetch를 쓰기 전의 가장 중요한 약속입니다. "브라우저야, 네 맘대로 새로고침(동기 방식)하지 마! 내가 직접 통신(비동기)할 거야!"라는 선언입니다.

className:
여전히 부트스트랩 클래스를 그대로 사용하여 Flask 때와 동일한 디자인을 유지합니다.

------------------------회원수정 페이지 변경---------------------------------------------------------------
폴더 생성 및 파일 생성 : app/mypage/edit/page.tsx 
mkdir -p ~/yolo-server/next-app/app/mypage/edit

defaultValue vs value:
React에서 사용자가 내용을 수정할 수 있게 하려면 value 대신 defaultValue를 쓰거나, onChange 핸들러로 상태를 관리해야 합니다. 위 코드는 간단하게 defaultValue를 썼습니다.

readOnly:
아이디처럼 수정하면 안 되는 필드는 readOnly 속성을 부여해 Flask 때와 동일하게 막았습니다.

------------------------next + flask 변경---------------------------------------------------------------
가장 중요한 Next.js(프론트)와 Flask(백엔드)의 결합 단계입니다!
전통적인 Flask 세션(session['user_id'])은 브라우저와 Flask가 직접 통신할 때만 작동합니다. 
하지만 지금처럼 Next.js가 중간에 끼어 있는 구조에서는 JWT(JSON Web Token) 방식을 쓰거나, CORS 설정을 통해 쿠키를 공유해야 합니다.
가장 빠르고 표준적인 CORS + Credentials(쿠키 공유) 방식으로 연결해 보겠습니다.

app/login/page.tsx 수정 docker compose up 
이 코드가 정상 작동하려면 Flask 서버(app.py) 쪽에서 아래 두 가지 처리가 반드시 되어 있어야 합니다.
CORS 설정 허용: * CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)가 설정되어 있어야 브라우저 차단이 안 됩니다.
응답 방식 변경: * 기존의 redirect(url_for('index')) 대신 return jsonify({"success": True, "user_name": user['name']}) 형태로 JSON을 반환해야 합니다.
