import { useEffect, useState } from "react";

export default function MentorsDatabase({ onBack }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMentors() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/mentordb`, {
          credentials: "include",
        });
        const data = await res.json();
        setMentors(data.mentors || []);
      } catch (err) {
        setMentors([]);
      }
      setLoading(false);
    }
    fetchMentors();
  }, []);

  if (loading) {
    return (
      <div className="text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Mentors Database</h2>
          <button onClick={onBack} className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium">
            Back
          </button>
        </div>
        <div className="text-center text-gray-300 py-10">Loading...</div>
      </div>
    );
  }

  if (!mentors.length) {
    return (
      <div className="text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Mentors Database</h2>
          <button onClick={onBack} className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium">
            Back
          </button>
        </div>
        <div className="text-center text-gray-300 py-10">No mentors found.</div>
      </div>
    );
  }

  return (
    <div className="text-white p-4">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">Mentors Database</h2>
        <button 
          onClick={onBack} 
          className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors font-medium"
        >
          Back
        </button>
      </div>
      
      {/* Mobile/Small Tablet view - Card layout */}
      <div className="block lg:hidden space-y-4">
        {mentors.map((mentor, idx) => (
          <div key={mentor.id || idx} className="bg-white text-black rounded-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="sm:col-span-2 pb-2 mb-2 border-b">
                <span className="font-bold text-lg">#{idx + 1} - {mentor.user?.fullname || "-"}</span>
              </div>
              <div><span className="font-medium">Email:</span> {mentor.user?.email || "-"}</div>
              <div><span className="font-medium">Department Code:</span> {mentor.department_code || "-"}</div>
              <div><span className="font-medium">Degree Code:</span> {mentor.highest_degree_at_nitc_code || "-"}</div>
              <div><span className="font-medium">Year Graduated:</span> {mentor.year_graduated || "-"}</div>
              <div><span className="font-medium">Mentee Capacity:</span> {mentor.mentee_capacity || "-"}</div>
              <div className="sm:col-span-2"><span className="font-medium">Broad Areas:</span> {(mentor.broad_area_of_expertise || []).join(", ") || "-"}</div>
              <div className="sm:col-span-2"><span className="font-medium">Narrow Areas:</span> {(mentor.narrow_area_of_expertise || []).join(", ") || "-"}</div>
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
                <th className="px-3 py-3 text-left font-medium min-w-[120px]">Degree code</th>
                <th className="px-3 py-3 text-left font-medium min-w-[120px]">Department code</th>
                <th className="px-3 py-3 text-left font-medium min-w-[100px]">Year Graduated</th>
                <th className="px-3 py-3 text-left font-medium min-w-[80px]">Mentee Capacity</th>
                <th className="px-3 py-3 text-left font-medium min-w-[180px]">Broad Areas of Interest</th>
                <th className="px-3 py-3 text-left font-medium min-w-[180px]">Narrow Areas of Interest</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor, idx) => (
                <tr key={mentor.id || idx} className="text-sm border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3">{idx + 1}</td>
                  <td className="px-3 py-3 font-medium">{mentor.user?.fullname || "-"}</td>
                  <td className="px-3 py-3 break-words">{mentor.user?.email || "-"}</td>
                  <td className="px-3 py-3">{mentor.highest_degree_at_nitc_code || "-"}</td>
                  <td className="px-3 py-3">{mentor.department_code || "-"}</td>
                  <td className="px-3 py-3">{mentor.year_graduated || "-"}</td>
                  <td className="px-3 py-3">{mentor.mentee_capacity || "-"}</td>
                  <td className="px-3 py-3">
                    <div className="max-w-[200px]">
                      {(mentor.broad_area_of_expertise || []).join(", ") || "-"}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-[200px]">
                      {(mentor.narrow_area_of_expertise || []).join(", ") || "-"}
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