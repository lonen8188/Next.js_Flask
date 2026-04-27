# 1. 베이스 이미지 설정: 
# - node:20: 최신 안정화 버전인 Node.js 20을 사용합니다.
# - alpine: 일반 리눅스보다 용량이 10배 이상 작은 '알파인 리눅스' 기반입니다. 
#   (이미지 용량을 줄여서 빌드와 배포 속도를 획기적으로 높여줍니다.)
FROM node:20-alpine

# 2. 작업 디렉토리 설정: 
# - 컨테이너 내부에서 소스 코드가 위치할 기본 폴더를 /app으로 지정합니다.
WORKDIR /app

# 3. 의존성 설치 (패키지 목록 복사):
# - package.json과 package-lock.json 파일만 먼저 복사합니다.
# - 이렇게 하면 소스 코드가 바뀌어도 라이브러리(npm install)는 다시 설치하지 않고 
#   도커 캐시를 사용하여 빌드 시간을 단축할 수 있습니다.
COPY package*.json ./

# 4. 라이브러리 설치:
# - package.json에 명시된 리액트, 넥스트 관련 라이브러리들을 컨테이너 안에 설치합니다.
RUN npm install

# 5. 소스 코드 전체 복사:
# - 현재 내 컴퓨터에 있는 Next.js 프로젝트 파일 전체를 컨테이너의 /app 폴더로 복사합니다.
# - .dockerignore 파일이 있다면 node_modules 등 불필요한 폴더는 제외하고 복사됩니다.
COPY . .

# 6. 포트 설정 (문서화):
# - 이 컨테이너는 기본적으로 3000번 포트를 사용한다는 것을 명시합니다.
# - (실제 연결은 docker-compose.yml의 ports 설정에서 이루어집니다.)
EXPOSE 3000

# 7. 실행 명령 (개발 모드):
# - "npm run dev" 명령어를 통해 Next.js 개발 서버를 실행합니다.
# - docker-compose.yml에서 볼륨(Volumes) 설정을 해두었기 때문에, 
#   내 컴퓨터에서 코드를 수정하면 컨테이너 안에서도 즉시 반영(Hot Reload)됩니다.
CMD ["npm", "run", "dev"]