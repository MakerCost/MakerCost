'use client';

import { useState } from 'react';

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface LaborItem {
  id: string;
  name: string;
  hours: number;
  rate: number;
}

interface MachineItem {
  id: string;
  name: string;
  hours: number;
  rate: number;
}

interface OverheadCalculatorData {
  rent: number;
  electricity: number;
  insurance: number;
  marketing: number;
  accounting: number;
  other: number;
  numPeople: number;
  hoursPerPerson: number;
}

export default function MakerCalc() {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [labor, setLabor] = useState<LaborItem[]>([]);
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [overheadRate, setOverheadRate] = useState<number>(0);
  const [showOverheadCalculator, setShowOverheadCalculator] = useState(false);
  const [overheadCalcData, setOverheadCalcData] = useState<OverheadCalculatorData>({
    rent: 0,
    electricity: 0,
    insurance: 0,
    marketing: 0,
    accounting: 0,
    other: 0,
    numPeople: 1,
    hoursPerPerson: 160
  });

  const addMaterial = () => {
    setMaterials([...materials, { id: Date.now().toString(), name: '', quantity: 0, unit: '', cost: 0 }]);
  };

  const addLabor = () => {
    setLabor([...labor, { id: Date.now().toString(), name: '', hours: 0, rate: 0 }]);
  };

  const addMachine = () => {
    setMachines([...machines, { id: Date.now().toString(), name: '', hours: 0, rate: 0 }]);
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: string | number) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const updateLabor = (id: string, field: keyof LaborItem, value: string | number) => {
    setLabor(labor.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const updateMachine = (id: string, field: keyof MachineItem, value: string | number) => {
    setMachines(machines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const deleteLabor = (id: string) => {
    setLabor(labor.filter(l => l.id !== id));
  };

  const deleteMachine = (id: string) => {
    setMachines(machines.filter(m => m.id !== id));
  };

  const calculateOverheadRate = () => {
    const totalExpenses = overheadCalcData.rent + overheadCalcData.electricity + overheadCalcData.insurance + 
                          overheadCalcData.marketing + overheadCalcData.accounting + overheadCalcData.other;
    const totalWorkingHours = overheadCalcData.numPeople * overheadCalcData.hoursPerPerson;
    const rate = totalWorkingHours > 0 ? totalExpenses / totalWorkingHours : 0;
    setOverheadRate(rate);
    setShowOverheadCalculator(false);
  };

  const totalMaterialCost = materials.reduce((sum, m) => sum + (m.quantity * m.cost), 0);
  const totalLaborCost = labor.reduce((sum, l) => sum + (l.hours * l.rate), 0);
  const totalLaborHours = labor.reduce((sum, l) => sum + l.hours, 0);
  const totalMachineCost = machines.reduce((sum, m) => sum + (m.hours * m.rate), 0);
  const totalOverheadCost = overheadRate * totalLaborHours;
  const totalCost = totalMaterialCost + totalLaborCost + totalMachineCost + totalOverheadCost;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Maker Calculator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Materials</h2>
                <button 
                  onClick={addMaterial}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Material
                </button>
              </div>
              <div className="space-y-3">
                {materials.map((material) => (
                  <div key={material.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Material name"
                      value={material.name}
                      onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={material.quantity || ''}
                      onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20 p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={material.unit}
                      onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                      className="w-20 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="₪ Cost"
                      value={material.cost || ''}
                      onChange={(e) => updateMaterial(material.id, 'cost', parseFloat(e.target.value) || 0)}
                      className="w-24 p-2 border rounded"
                    />
                    <button 
                      onClick={() => deleteMaterial(material.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Labor</h2>
                <button 
                  onClick={addLabor}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Labor
                </button>
              </div>
              <div className="space-y-3">
                {labor.map((laborItem) => (
                  <div key={laborItem.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Labor description"
                      value={laborItem.name}
                      onChange={(e) => updateLabor(laborItem.id, 'name', e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Hours"
                      value={laborItem.hours || ''}
                      onChange={(e) => updateLabor(laborItem.id, 'hours', parseFloat(e.target.value) || 0)}
                      className="w-24 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="₪/hr"
                      value={laborItem.rate || ''}
                      onChange={(e) => updateLabor(laborItem.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-24 p-2 border rounded"
                    />
                    <button 
                      onClick={() => deleteLabor(laborItem.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Machine Time</h2>
                <button 
                  onClick={addMachine}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Add Machine
                </button>
              </div>
              <div className="space-y-3">
                {machines.map((machine) => (
                  <div key={machine.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Machine name"
                      value={machine.name}
                      onChange={(e) => updateMachine(machine.id, 'name', e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Hours"
                      value={machine.hours || ''}
                      onChange={(e) => updateMachine(machine.id, 'hours', parseFloat(e.target.value) || 0)}
                      className="w-24 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="₪/hr"
                      value={machine.rate || ''}
                      onChange={(e) => updateMachine(machine.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-24 p-2 border rounded"
                    />
                    <button 
                      onClick={() => deleteMachine(machine.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overhead per Labor Hour</h2>
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="₪25/hour"
                    value={overheadRate || ''}
                    onChange={(e) => setOverheadRate(parseFloat(e.target.value) || 0)}
                    className="flex-1 p-2 border rounded"
                  />
                  <span className="text-gray-600">/hour</span>
                </div>
                <button
                  onClick={() => setShowOverheadCalculator(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded border"
                >
                  🧮 Calculate Overhead Rate
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Profit & Loss</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Materials:</span>
                  <span>₪{totalMaterialCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor:</span>
                  <span>₪{totalLaborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Machine Time:</span>
                  <span>₪{totalMachineCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overhead ({totalLaborHours}h × ₪{overheadRate}):</span>
                  <span>₪{totalOverheadCost.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Cost:</span>
                  <span>₪{totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showOverheadCalculator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Overhead Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Rent</label>
                  <input
                    type="number"
                    value={overheadCalcData.rent || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, rent: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded"
                    placeholder="₪"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Electricity</label>
                  <input
                    type="number"
                    value={overheadCalcData.electricity || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, electricity: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded"
                    placeholder="₪"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Insurance</label>
                  <input
                    type="number"
                    value={overheadCalcData.insurance || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, insurance: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded"
                    placeholder="₪"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Marketing</label>
                  <input
                    type="number"
                    value={overheadCalcData.marketing || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, marketing: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded"
                    placeholder="₪"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Accounting</label>
                  <input
                    type="number"
                    value={overheadCalcData.accounting || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, accounting: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded"
                    placeholder="₪"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Other Monthly Expenses</label>
                  <input
                    type="number"
                    value={overheadCalcData.other || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, other: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded"
                    placeholder="₪"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of People Working</label>
                  <input
                    type="number"
                    value={overheadCalcData.numPeople || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, numPeople: parseInt(e.target.value) || 1})}
                    className="w-full p-2 border rounded"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Working Hours per Person</label>
                  <input
                    type="number"
                    value={overheadCalcData.hoursPerPerson || ''}
                    onChange={(e) => setOverheadCalcData({...overheadCalcData, hoursPerPerson: parseFloat(e.target.value) || 160})}
                    className="w-full p-2 border rounded"
                    placeholder="160"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={calculateOverheadRate}
                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Calculate
                  </button>
                  <button
                    onClick={() => setShowOverheadCalculator(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
