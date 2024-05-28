"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Link from "next/link";

export default function TableButton() {
  const [rows, setRows] = useState([]);

  // const [result, setResult] = useState({});

  const [filename, setFilename] = useState("");

  const onChange = async e => {
    let file = e.target.files[0];
    if (file) {
      setFilename(file.name);
    }

    let readFile = file =>
      new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);

        reader.readAsText(file);
      });

    let csvText = await readFile(file);

    Papa.parse(csvText, {
      header: true,
      complete: function (results) {
        setRows(results.data);
      },
    });

    //const result = JSON.stringify(rows, null, 2);
    // setResult(result);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!rows) return;

    const body = {
      filename,
      rows,
    };

    const res = await fetch("/api/TableInsert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };
  useEffect(() => {});
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={onChange} />
        <button type="submit">Upload</button>
      </form>
      <Link href="/manage-plan/modal">모달 띄우기</Link>
    </div>
  );
}
