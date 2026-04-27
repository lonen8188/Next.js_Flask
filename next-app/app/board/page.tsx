"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function BoardListPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_BASE_URL = "http://192.168.0.12:5000";

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]); // 페이지 번호가 바뀔 때마다 다시 호출

  const fetchPosts = async (page: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/board/list?page=${page}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error("로딩 에러:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>자유게시판</h2>
        <Link href="/board/write" className="btn btn-primary">글쓰기</Link>
      </div>

      <table className="table table-hover border">
        <thead className="table-light">
          <tr>
            <th>번호</th><th>제목</th><th>작성자</th><th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: any) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td><Link href={`/board/${post.id}`} className="text-decoration-none">{post.title}</Link></td>
              <td>{post.author}</td>
              <td>{post.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 UI */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>이전</button>
          </li>
          
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>다음</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}