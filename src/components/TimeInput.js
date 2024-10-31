
import { useState } from "react";

const TimeInput = ({ onSubmit, onChange }) => {
  const [formData, setFormData] = useState({
    horario1: "",
    horario2: "",
    horario3: "",
    horario4: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    onChange(updatedFormData); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-gray-300">Horário 1 (Entrada): </label>
        <input
          type="time"
          name="horario1"
          value={formData.horario1}
          onChange={handleChange}
          className="border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 w-full"
        />
      </div>
      <div>
        <label className="text-gray-300">Horário 2 (Intervalo): </label>
        <input
          type="time"
          name="horario2"
          value={formData.horario2}
          onChange={handleChange}
          className="border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 w-full"
        />
      </div>
      <div>
        <label className="text-gray-300">Horário 3 (Retorno do Intervalo): </label>
        <input
          type="time"
          name="horario3"
          value={formData.horario3}
          onChange={handleChange}
          className="border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 w-full"
        />
      </div>
      <div>
        <label className="text-gray-300">Horário 4 (Saída): </label>
        <input
          type="time"
          name="horario4"
          value={formData.horario4}
          onChange={handleChange}
          className="border border-gray-600 rounded p-2 bg-gray-700 text-gray-100 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full font-bold hover:bg-blue-700">
        Calcular
      </button>
    </form>
  );
};

export default TimeInput;
