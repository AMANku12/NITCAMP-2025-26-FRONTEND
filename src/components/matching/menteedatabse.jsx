import { useEffect, useState } from "react";

export default function MenteesDatabase({ onBack }) {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMentees() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/menteedb`, {
          credentials: "include",
        });
        const data = await res.json();
        setMentees(data.mentees || []);
      } catch (err) {
        setMentees([]);
      }
      setLoading(false);
    }
    fetchMentees();
  }, []);

  if (loading) {
    return (
      <div className="text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Mentees Database</h2>
          <button onClick={onBack} className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium">
            Back
          </button>
        </div>
        <div className="text-center text-gray-300 py-10">Loading...</div>
      </div>
    );
  }

  if (!mentees.length) {
    return (
      <div className="text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Mentees Database</h2>
          <button onClick={onBack} className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium">
            Back
          </button>
        </div>
        <div className="text-center text-gray-300 py-10">No mentees found.</div>
      </div>
    );
  }

  return (
    <div className="text-white p-4">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">Mentees Database</h2>
        <button 
          onClick={onBack} 
          className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium"
        >
          Back
        </button>
      </div>

      {/* Mobile/Small Tablet view - Card layout */}
      <div className="block lg:hidden space-y-4">
        {mentees.map((mentee, idx) => (
          <div key={mentee.id || idx} className="bg-white text-black rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-bold text-lg">#{idx + 1}</span>
                <h3 className="font-bold text-lg">{mentee.user?.fullname || "-"}</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium">Email:</span> {mentee.user?.email || "-"}</div>
              <div><span className="font-medium">Branch Code:</span> {mentee.branch_code || "-"}</div>
              <div><span className="font-medium">Degree Code:</span> {mentee.degree_code || "-"}</div>
              <div><span className="font-medium">Year of Admission:</span> {mentee.year_of_admission || "-"}</div>
              <div className="sm:col-span-2"><span className="font-medium">Broad Area:</span> {Array.isArray(mentee.broad_area_of_interest) ? mentee.broad_area_of_interest.join(", ") : (mentee.broad_area_of_interest || "-")}</div>
              <div className="sm:col-span-2"><span className="font-medium">Narrow Area:</span> {Array.isArray(mentee.narrow_area_of_interest) ? mentee.narrow_area_of_interest.join(", ") : (mentee.narrow_area_of_interest || "-")}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view - Responsive Table layout */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-black bg-white rounded-xl overflow-hidden">
            <thead className="bg-gray-200 text-xs">
              <tr>
                <th className="px-3 py-3 text-left font-medium">Sl.no</th>
                <th className="px-3 py-3 text-left font-medium min-w-[150px]">Name</th>
                <th className="px-3 py-3 text-left font-medium min-w-[200px]">Email</th>
                <th className="px-3 py-3 text-left font-medium min-w-[100px]">Branch Code</th>
                <th className="px-3 py-3 text-left font-medium min-w-[100px]">Degree Code</th>
                <th className="px-3 py-3 text-left font-medium min-w-[120px]">Year of Admission</th>
                <th className="px-3 py-3 text-left font-medium min-w-[180px]">Broad Area</th>
                <th className="px-3 py-3 text-left font-medium min-w-[180px]">Narrow Area</th>
              </tr>
            </thead>
            <tbody>
              {mentees.map((mentee, idx) => (
                <tr key={mentee.id || idx} className="text-sm border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3">{idx + 1}</td>
                  <td className="px-3 py-3 font-medium">{mentee.user?.fullname || "-"}</td>
                  <td className="px-3 py-3 break-words">{mentee.user?.email || "-"}</td>
                  <td className="px-3 py-3">{mentee.branch_code || "-"}</td>
                  <td className="px-3 py-3">{mentee.degree_code || "-"}</td>
                  <td className="px-3 py-3">{mentee.year_of_admission || "-"}</td>
                  <td className="px-3 py-3">
                    <div className="max-w-[200px]">
                      {Array.isArray(mentee.broad_area_of_interest) ? mentee.broad_area_of_interest.join(", ") : (mentee.broad_area_of_interest || "-")}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-[200px]">
                      {Array.isArray(mentee.narrow_area_of_interest) ? mentee.narrow_area_of_interest.join(", ") : (mentee.narrow_area_of_interest || "-")}
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}