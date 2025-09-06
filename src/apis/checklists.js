import { useEffect, useState } from "react";
import { fetchChecklists } from "@apis/checklists";

export default function ChecklistPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchChecklists().then(setList).catch(console.error);
  }, []);

  return (
    <div>
      <h1>체크리스트 목록</h1>
      <ul>
        {list.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
}
