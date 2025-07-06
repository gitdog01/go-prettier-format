FROM golang:1.21-alpine AS go-builder

# Go 빌드 환경 설정
WORKDIR /app
COPY go_src/ ./go_src/

# WebAssembly 빌드
RUN cd go_src && GOOS=js GOARCH=wasm go build -o ../go.wasm .

FROM node:18-alpine AS node-builder

# Node.js 빌드 환경 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스코드 복사
COPY src/ ./src/

# JavaScript 빌드
RUN npm run build:js

# 최종 이미지
FROM node:18-alpine

WORKDIR /app

# 빌드 결과물 복사
COPY --from=go-builder /app/go.wasm ./
COPY --from=node-builder /app/dist/ ./dist/
COPY --from=node-builder /app/node_modules/ ./node_modules/

# package.json 복사
COPY package*.json ./

# 기본 명령어
CMD ["npm", "test"] 