import { useParams } from "react-router-dom";

export default function LetterTempPage() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <div className="text-lg font-semibold">Letter Temp</div>
      <div className="mt-2">id: {id}</div>
    </div>
  );
}
