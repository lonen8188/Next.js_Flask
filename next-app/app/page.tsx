"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  // 나중에 Flask API와 연동하여 실제 로그인 상태를 관리할 변수입니다.
  // 지금은 화면 구성을 위해 임시로 false(로그아웃 상태)로 두었습니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main suppressHydrationWarning>
      {/* 히어로 섹션 */}
      <div className="py-5 text-center">
        <h1 className="display-5 fw-bold text-body-emphasis">학습 관리 시스템</h1>
        <p className="lead mb-4">게시판 소통부터 성적 관리까지 한 번에 처리하세요.</p>
      </div>

      {/* 3컬럼 카드 레이아웃 */}
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        {/* 1. 자유게시판 */}
        <div className="col d-flex align-items-start">
          <div className="card h-100 shadow-sm w-100">
            <div className="card-body">
              <h3 className="fs-2 text-body-emphasis">AI게시판</h3>
              <p>AI vision 객체 탐지 게시판 입니다.</p>
              <a href="/board" className="btn btn-primary">
                게시판 바로가기
              </a>
            </div>
          </div>
        </div>

        {/* 2. 성적관리 */}
        <div className="col d-flex align-items-start">
          <div className="card h-100 shadow-sm border-success w-100">
            <div className="card-body">
              <h3 className="fs-2 text-success">자유게시판</h3>
              <p>자유로운 게시물을 입력하고 확인하세요.</p>
              <a href="/board" className="btn btn-success">
                게시판 입장
              </a>
            </div>
          </div>
        </div>

        {/* 3. 회원관리 (조건부 렌더링) */}
        <div className="col d-flex align-items-start">
          <div className="card h-100 shadow-sm border-info w-100">
            <div className="card-body">
              <h3 className="fs-2 text-info">회원관리</h3>
              <p>사용자 정보 및 권한을 관리합니다. 현재 등급을 확인해 보세요.</p>
              {isLoggedIn ? (
                <a href="/mypage" className="btn btn-info text-white">
                  마이페이지
                </a>
              ) : (
                <a href="/login" className="btn btn-info text-white">
                  로그인하기
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}