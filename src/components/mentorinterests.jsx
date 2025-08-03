import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MentorInterests({ onBack }) {
  const navigate = useNavigate();

  // fetched lists
  const [broadOptions, setBroadOptions] = useState([]);
  const [narrowOptions, setNarrowOptions] = useState([]);

  // search filters
  const [searchBroad, setSearchBroad] = useState('');
  const [searchNarrow, setSearchNarrow] = useState('');

  // selections
  const [selectedBroad, setSelectedBroad] = useState([]);
  const [selectedNarrow, setSelectedNarrow] = useState([]);

  // fetch data once
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getbroadareas`)
      .then(res => {
        console.log('broadAreas response:', res.data);
        // adjust the next line if your API shape is different
        setBroadOptions(res.data.broadAreasJson || res.data || []);
      })
      .catch(console.error);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getnarrowareas`)
      .then(res => {
        console.log('narrowAreas response:', res.data);
        setNarrowOptions(res.data.narrowAreasJson || res.data || []);
      })
      .catch(console.error);
  }, []);

  // toggle helpers
  const toggle = (area, list, setList) =>
    setList(prev =>
      prev.includes(area) ? prev.filter(x => x !== area) : [...prev, area]
    );

  // filtered lists (keep selected visible, guard against undefined)
  const filteredBroad = Array.isArray(broadOptions)
    ? broadOptions.filter(
        a =>
          a.toLowerCase().includes(searchBroad.toLowerCase()) ||
          selectedBroad.includes(a)
      )
    : [];

  const filteredNarrow = Array.isArray(narrowOptions)
    ? narrowOptions.filter(
        a =>
          a.toLowerCase().includes(searchNarrow.toLowerCase()) ||
          selectedNarrow.includes(a)
      )
    : [];

  // submit handler
  const handleSubmit = async () => {
    if (!selectedBroad.length || !selectedNarrow.length) {
      return alert('Please pick at least one Broad & one Narrow area.');
    }

    try {
      const mentorData = JSON.parse(localStorage.getItem('mentorData') || '{}');
      const payload = {
        role: 'mentor',
        mentorData: {
          ...mentorData,
          broad_area_of_expertise: selectedBroad,
          narrow_area_of_expertise: selectedNarrow
        }
      };

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register/mentor`, payload, { withCredentials: true });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('mentorData', JSON.stringify(res.data.newMentor));
      alert('Registered successfully!');
      navigate('/mentorwelcomepage');

    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-6 text-xs sm:text-base">
      <h1 className="text-base sm:text-2xl font-bold mb-6">Mentor Interests</h1>

      {/* Broad Areas */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2 text-xs sm:text-base">Broad Areas of Expertise <span className="text-red-600">*</span></h2>
        <input
          type="text"
          placeholder="Search broad areas..."
          value={searchBroad}
          onChange={e => setSearchBroad(e.target.value)}
          className="w-full p-1 sm:p-2 border rounded mb-2 sm:mb-3 text-xs sm:text-base"
        />
        <div className="border rounded max-h-60 overflow-auto p-3">
          {filteredBroad.map(area => (
            <label key={area} className="block mb-1 text-xs sm:text-base">
              <input
                type="checkbox"
                checked={selectedBroad.includes(area)}
                onChange={() => toggle(area, selectedBroad, setSelectedBroad)}
                className="mr-2"
              />
              {area}
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedBroad.map(a => (
            <span
              key={a}
              className="px-2 sm:px-3 py-1 bg-blue-100 rounded-full text-xs sm:text-sm"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Narrow Areas */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2 text-xs sm:text-base">Narrow Areas of Expertise <span className="text-red-600">*</span></h2>
        <input
          type="text"
          placeholder="Search narrow areas..."
          value={searchNarrow}
          onChange={e => setSearchNarrow(e.target.value)}
          className="w-full p-1 sm:p-2 border rounded mb-2 sm:mb-3 text-xs sm:text-base"
        />
        <div className="border rounded max-h-60 overflow-auto p-3">
          {filteredNarrow.map(area => (
            <label key={area} className="block mb-1 text-xs sm:text-base">
              <input
                type="checkbox"
                checked={selectedNarrow.includes(area)}
                onChange={() => toggle(area, selectedNarrow, setSelectedNarrow)}
                className="mr-2"
              />
              {area}
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedNarrow.map(a => (
            <span
              key={a}
              className="px-2 sm:px-3 py-1 bg-green-100 rounded-full text-xs sm:text-sm"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-300 rounded text-xs sm:text-base"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 sm:px-6 py-1 sm:py-2 bg-blue-600 text-white rounded text-xs sm:text-base"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
