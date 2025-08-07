import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MenteeInterests({
  onBack,
  onDataChange,
  formId = 'mentee-interests'
}) {
  const navigate = useNavigate();

  // fetched choices
  const [broadAreaChoices, setBroadAreaChoices] = useState([]);
  const [narrowAreaChoices, setNarrowAreaChoices] = useState([]);

  // search inputs
  const [searchBroad, setSearchBroad] = useState('');
  const [searchNarrow, setSearchNarrow] = useState('');

  // selections
  const [selectedBroadAreas, setSelectedBroadAreas] = useState([]);
  const [selectedNarrowAreas, setSelectedNarrowAreas] = useState([]);

  // fetch on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getbroadareas`)
      .then(res => setBroadAreaChoices(res.data.broadAreasJson))
      .catch(console.error);

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getnarrowareas`)
      .then(res => setNarrowAreaChoices(res.data.narrowAreasJson))
      .catch(console.error);
  }, []);

  // persist & bubble up
  useEffect(() => {
    const data = { selectedBroadAreas, selectedNarrowAreas };
    sessionStorage.setItem(`form-${formId}`, JSON.stringify(data));
    onDataChange?.(data);
  }, [selectedBroadAreas, selectedNarrowAreas]);

  // load saved
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(`form-${formId}`));
      if (saved) {
        setSelectedBroadAreas(saved.selectedBroadAreas || []);
        setSelectedNarrowAreas(saved.selectedNarrowAreas || []);
      }
    } catch {}
  }, []);

  // toggle helpers
  const toggleBroad = area => {
    setSelectedBroadAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };
  const toggleNarrow = area => {
    setSelectedNarrowAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleSubmit = async () => {
    if (!selectedBroadAreas.length || !selectedNarrowAreas.length) {
      return alert('Pick at least one in both Broad & Narrow areas!');
    }
    try {
      const menteeData = JSON.parse(localStorage.getItem('menteeData'));
      const reqData = {
        role: 'mentee',
        menteeData: {
          personal_email: menteeData.personalEmail,
          phone_no: menteeData.phoneNo,
          broad_area_of_interest: selectedBroadAreas,
          narrow_area_of_interest: selectedNarrowAreas
        }
      };
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/register/mentee`,
        reqData,
        { withCredentials: true }
      );
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('menteeData', JSON.stringify(res.data.newMentee));
      alert('Registration successful!');
      navigate('/menteewelcomepage');
    } catch (err) {
      console.error(err);
      alert('Registration failed, try again?');
    }
  };

  // filter (keep selected visible)
  const filteredBroad = broadAreaChoices.filter(
    a =>
      a.toLowerCase().includes(searchBroad.toLowerCase()) ||
      selectedBroadAreas.includes(a)
  );
  const filteredNarrow = narrowAreaChoices.filter(
    a =>
      a.toLowerCase().includes(searchNarrow.toLowerCase()) ||
      selectedNarrowAreas.includes(a)
  );

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Broad Areas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Broad Areas of interests <span className="text-red-600">*</span></h2>
        <input
          type="text"
          placeholder="Search broad areas..."
          value={searchBroad}
          onChange={e => setSearchBroad(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
      <div className="max-h-60 overflow-auto border rounded">
          {filteredBroad.map(area => (
            <label key={area} className="block mb-1">
              <input
                type="checkbox"
                checked={selectedBroadAreas.includes(area)}
                onChange={() => toggleBroad(area)}
                className="mr-2"
              />
              {area}
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedBroadAreas.map(area => (
            <span
              key={area}
              className="px-3 py-1 bg-blue-100 rounded-full text-sm"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Narrow Areas */}
      <div className="mb-8">
        <h2 className="text-base sm:text-xl font-semibold mb-2">Narrow Areas of interests <span className="text-red-600">*</span></h2>
        <input
          type="text"
          placeholder="Search narrow areas..."
          value={searchNarrow}
          onChange={e => setSearchNarrow(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <div className="max-h-60 overflow-auto border rounded p-3">
          {filteredNarrow.map(area => (
            <label key={area} className="block mb-1">
              <input
                type="checkbox"
                checked={selectedNarrowAreas.includes(area)}
                onChange={() => toggleNarrow(area)}
                className="mr-2"
              />
              {area}
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedNarrowAreas.map(area => (
            <span
              key={area}
              className="px-3 py-1 bg-green-100 rounded-full text-sm"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
