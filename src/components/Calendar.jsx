import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";

export const DatePickerComponent = () => {
  const [selectedDate, setSelectedDate] = useState();

  return (
    <div className="calendar">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        locale={es}
        showOutsideDays
        fixedWeeks
        modifiersClassNames={{
          selected: "selected-day",
          today: "today-day"
        }}
        className="calendar-keys"
      />
      {selectedDate && (
        <p className="calendar-screen">
          Fecha seleccionada: {selectedDate.toLocaleDateString("es-ES")}
        </p>
      )}
    </div>
  );
};

export default DatePickerComponent;
