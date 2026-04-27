"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BoardWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://192.168.0.12:5000/api/board/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
      credentials: "include", // ✅ 세션 쿠키 전송 필수!
    });

    const result = await res.json();
    if (result.success) {
      alert("글이 등록되었습니다.");
      router.push("/board"); // 등록 후 목록으로 이동
    } else {
      alert(result.message || "등록 실패");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4">새 글 작성</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        <div className="mb-3">
          <label className="form-label fw-bold">제목</label>
          <input
            type="text"
            className="form-control"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">내용</label>
          <textarea
            className="form-control"
            rows={10}
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light" onClick={() => router.back()}>
            취소
          </button>
          <button type="submit" className="btn btn-primary px-4">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}