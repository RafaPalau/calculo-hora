
"use client";
import TimeInput from "@/components/TimeInput";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";

export default function Home() {
  const [result, setResult] = useState(null);
  const [totalHours, setTotalHours] = useState("0h 0min");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isTotalHoursValid, setIsTotalHoursValid] = useState(true);

  useEffect(() => {
    const currentCount = localStorage.getItem("accessCount") || "0";
    const newCount = parseInt(currentCount) + 1;
    localStorage.setItem("accessCount", newCount.toString());
    console.log(`Total de acessos: ${newCount}`);
  }, []);

  const calculateTimes = (times) => {
    const { horario1, horario2, horario3, horario4 } = times;

    const entryTime = horario1 ? DateTime.fromISO(horario1) : null;
    const lunchStart = horario2 ? DateTime.fromISO(horario2) : null;
    const lunchEnd = horario3 ? DateTime.fromISO(horario3) : null;
    const exitTime = horario4 ? DateTime.fromISO(horario4) : null;

    let errors = [];
    let totalWork = 0;

    if (entryTime && lunchStart) {
      const morningWork = lunchStart.diff(entryTime, "hours").hours;
      totalWork += morningWork;
    }
    if (lunchEnd && exitTime) {
      const afternoonWork = exitTime.diff(lunchEnd, "hours").hours;
      totalWork += afternoonWork;
    }

    const totalHoursText = `${Math.floor(totalWork)}h ${Math.round((totalWork % 1) * 60)}min`;
    setTotalHours(totalHoursText);

    const isValidTotalHours = totalWork >= 8 && totalWork <= 8.25;
    setIsTotalHoursValid(isValidTotalHours);

    if (!isValidTotalHours) {
      if (totalWork < 8) {
        errors.push("O total de horas trabalhadas é menor que 8 horas. 🙄");
      } else if (totalWork > 8.25) {
        errors.push("O total de horas trabalhadas excede 8 horas. 🙄");
      }
    }

    if (entryTime) {
      if (!(entryTime.hour >= 7 && entryTime.hour <= 9)) {
        errors.push("Entrada fora do horário permitido (7h ~ 9h).");
      }
    } else {
      errors.push("Horário de entrada não preenchido.");
    }

    if (lunchStart) {
      if (entryTime && !(lunchStart >= entryTime.plus({ hours: 3 }) && lunchStart <= entryTime.plus({ hours: 5 }))) {
        errors.push("O período da manhã deve ter entre 3h e 5h de trabalho.");
      }
    } else {
      errors.push("Horário de saída para intervalo não preenchido.");
    }

    if (lunchEnd) {
      const lunchDuration = lunchStart ? lunchEnd.diff(lunchStart, "minutes").minutes : 0;
      if (!(lunchDuration >= 30 && lunchDuration <= 150)) {
        errors.push("Intervalo de almoço inválido (30min ~ 2h30min).");
      }
    } else {
      errors.push("Horário de retorno do intervalo não preenchido.");
    }

    if (exitTime) {
      if (lunchEnd && !(exitTime >= lunchEnd.plus({ hours: 3 }) && exitTime <= lunchEnd.plus({ hours: 5 }))) {
        errors.push("O período da tarde deve ter entre 3h e 5h de trabalho.");
      }
      if (!(exitTime.hour >= 17 && exitTime.hour <= 19)) {
        errors.push("Saída fora do horário permitido (17h ~ 19h).");
      }
    } else {
      errors.push("Horário de saída não preenchido.");
    }

    if (entryTime && lunchStart) {
      const morningCoreHours = entryTime <= DateTime.fromObject({ hour: 9, minute: 0 }) &&
                               lunchStart >= DateTime.fromObject({ hour: 11, minute: 30 });
      if (!morningCoreHours) {
        errors.push("Núcleo da manhã não cumprido (9h ~ 11:30h).");
      }
    }

    if (lunchEnd && exitTime) {
      const afternoonCoreHours = lunchEnd <= DateTime.fromObject({ hour: 14, minute: 0 }) &&
                                 exitTime >= DateTime.fromObject({ hour: 17, minute: 0 });
      if (!afternoonCoreHours) {
        errors.push("Núcleo da tarde não cumprido (14h ~ 17h).");
      }
    }

    setValidationErrors(errors);
    setResult(errors.length === 0 ? { success: true } : { errors });
  };

  const handleSubmit = (times) => {
    calculateTimes(times, true);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-500">Cálculo hora - Procergs</h1>

        <TimeInput onSubmit={handleSubmit} onChange={(times) => calculateTimes(times, false)} />

        <p
          className={`text-lg font-bold text-center mt-4 ${
            isTotalHoursValid ? "text-green-400" : "text-red-400"
          }`}
        >
          Total de horas trabalhadas: {totalHours}
        </p>

        {validationErrors.length > 0 && (
          <div className="mt-4 p-4 rounded bg-red-800">
            <p className="text-red-200 font-bold">Alguns horários estão incorretos:</p>
            <ul className="mt-2">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-300 font-bold">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result && result.success && isTotalHoursValid && (
          <div className="mt-4 p-4 rounded bg-green-800">
            <p className="text-green-200 font-bold">Horário correto, bom descanso! 😄</p>
          </div>
        )}
      </div>
    </div>
  );
}
