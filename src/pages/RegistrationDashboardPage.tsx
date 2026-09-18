import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  UserPlus, 
  Search, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const RegistrationDashboardPage: React.FC = () => {
  const { patients, registerPatient } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.medicalCondition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Patient full name is required.');
      return;
    }
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      setFormError('Please enter a valid patient age.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Valid contact phone number is required.');
      return;
    }

    const created = registerPatient({
      name: name.trim(),
      age: Number(age),
      gender,
      phone: phone.trim(),
      medicalCondition: medicalCondition.trim() || 'General Consultation',
      address: address.trim(),
      emergencyContact: emergencyContact.trim()
    });

    setSuccessMessage(`Patient ${created.name} successfully registered with Patient ID: ${created.patientId}`);
    setIsModalOpen(false);

    setName('');
    setAge('');
    setGender('Male');
    setPhone('');
    setMedicalCondition('');
    setAddress('');
    setEmergencyContact('');

    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <UserPlus className="w-7 h-7 text-purple-600" />
            Patient Registration
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Register new hospital patients and manage profile records
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all cursor-pointer"
          title="Register new patient"
        >
          <Plus className="w-5 h-5" />
          <span>Register New Patient</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter patients by Name, ID, or Phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-xl">
            {patients.length} Registered Patients Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Patient ID</th>
                <th className="p-3.5">Age / Gender</th>
                <th className="p-3.5">Contact Phone</th>
                <th className="p-3.5">Medical Condition</th>
                <th className="p-3.5">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{p.name}</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-purple-700">
                    <span className="bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      {p.patientId}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">{p.age} yrs ({p.gender})</td>
                  <td className="p-3.5 font-mono text-slate-600">{p.phone}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{p.medicalCondition}</td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-30 group">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl shadow-purple-600/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Register new patient"
        >
          <Plus className="w-7 h-7" />
        </button>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden group-hover:block bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
          Register new patient
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full space-y-5 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-purple-600" />
                <h3 className="font-black text-slate-900 text-lg">Register New Patient</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePatientSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Patient Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Age *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={age}
                    onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 45"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Medical Condition / Sick Reason</label>
                <input
                  type="text"
                  value={medicalCondition}
                  onChange={e => setMedicalCondition(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Fever, Routine Check"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Address (Optional)</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 14 Healthcare Avenue"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Emergency Contact (Optional)</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="e.g. +91 98765 99999 (Spouse)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/25 cursor-pointer"
                >
                  Create Patient Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
