"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BoardEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const API_BASE_URL = "http://192.168.0.12:5000";

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/board/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTitle(data.post.title);
          setContent(data.post.content);
        }
      });
  }, [id]);

  // 2. 수정 요청 보내기
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/board/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
      credentials: "include", 
    });

    const result = await res.json();
    if (result.success) {
      alert("수정되었습니다!");
      router.push(`/board/${id}`); // 상세 페이지로 돌아가기
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4">게시글 수정</h2>
      <form onSubmit={handleUpdate} className="card p-4 shadow-sm border-0">
        <div className="mb-3">
          <label className="form-label fw-bold">제목</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">내용</label>
          <textarea className="form-control" rows={10} value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light" onClick={() => router.back()}>취소</button>
          <button type="submit" className="btn btn-warning text-white px-4">수정완료</button>
        </div>
      </form>
    </div>
  );
}