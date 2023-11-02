import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import { useParams } from "react-router-dom";
import { SketchPicker } from "react-color";

import "./Lab.css";

function Lab() {
  const { pabellon, lab_id } = useParams();
  const [selectedHours, setSelectedHours] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedDuringDrag, setSelectedDuringDrag] = useState([]);
  const [professor, setProfessor] = useState("");
  const [course, setCourse] = useState("");
  const [section, setSection] = useState(1); // Inicializa con la sección 1
  const [color, setColor] = useState("#FF5733"); // Color inicial
  const [showColorPicker, setShowColorPicker] = useState(false); // Estado para mostrar/ocultar el selector de colores
  const colorPickerRef = useRef(null); // Referencia al selector de colores
  const [formData, setFormData] = useState({
    profesor: "",
    curso: "",
    section: 1,
    color: "#FF5733", // Color inicial
    fecha: { dia: "", horas: "" },
  });
  const currentNumber = parseInt(lab_id, 10) || 1; // Obtiene el número actual desde la URL

  //guardar en selectedHours la info del local storage

  useEffect(() => {
    // Obtiene los datos del localStorage
    const pabellones = JSON.parse(localStorage.getItem("pabellones"));
    // busca el lab especificado dentro del pabellon especificado en los props del link
    const lab = pabellones[pabellon].find(
      (lab) => lab.id === parseInt(lab_id, 10)
    );

    console.log(lab.id);
    console.log(lab);

    //si el lab existe, guardar en selectedHours la info del local storage
    if (lab) {
      const turno = lab.turnos.find(
        (turno) =>
          turno.profesor === formData.profesor &&
          turno.curso === formData.curso &&
          turno.section === formData.section
      );
      if (turno) {
        console.log(turno.fecha.horas);
        //convertir el string de horas en un array de horas
        const horas = turno.fecha.horas.split(" - ");
        //convertir las horas en numeros
        const horaInicio = parseInt(horas[0], 10);
        const horaFin = parseInt(horas[1], 10);
        //convertir las horas en indices
        const indiceInicio = horaInicio - 8;
        const indiceFin = horaFin - 8;
        //crear un array de indices
        const indices = Array.from(
          { length: indiceFin - indiceInicio },
          (_, i) => i + indiceInicio
        );
        //crear un array de horas
        const horasSeleccionadas = indices.map((indice) => `${0}-${indice}`);
        //guardar en selectedHours las horas seleccionadas en el dia respectivo
        setSelectedHours(horasSeleccionadas);

        setColor(turno.color);
      }
    }
  }, [formData.profesor, formData.curso, formData.section]);

  const incrementNumber = () => {
    // Calcula el nuevo número sumándole 1 al actual

    const newNumber = currentNumber + 1;

    // Redirige la página al nuevo número
    if (newNumber <= 10 && pabellon == "antiguoPabellon") {
      window.location.href = `/SUOE/labs/${pabellon}/${newNumber}`;
    } else if (newNumber > 10 && pabellon == "antiguoPabellon") {
      const new_pabellon = "nuevoPabellon";
      window.location.href = `/SUOE/labs/${new_pabellon}/1`;
    } else if (newNumber <= 10 && pabellon == "nuevoPabellon") {
      window.location.href = `/SUOE/labs/${pabellon}/${newNumber}`;
    } else {
      const old_pabellon = "antiguoPabellon";
      window.location.href = `/SUOE/labs/${old_pabellon}/1`;
    }
  };

  const decreaseNumber = () => {
    // Calcula el nuevo número restandole 1 al actual
    const newNumber = currentNumber - 1;
    // Redirige la página al nuevo número

    if (newNumber > 0 && pabellon == "antiguoPabellon") {
      window.location.href = `/SUOE/labs/${pabellon}/${newNumber}`;
    }
    else if (newNumber <= 0 && pabellon == "antiguoPabellon") {
      const new_pabellon = "nuevoPabellon";
      window.location.href = `/SUOE/labs/${new_pabellon}/10`;
    }
    else if (newNumber > 0 && pabellon == "nuevoPabellon") {
      window.location.href = `/SUOE/labs/${pabellon}/${newNumber}`;
    }
    else {
      const old_pabellon = "antiguoPabellon";
      window.location.href = `/SUOE/labs/${old_pabellon}/10`;
    }
  };

  // Función para manejar el inicio del arrastre
  const handleMouseDown = () => {
    setIsMouseDown(true);
    setSelectedDuringDrag([]); // Inicia un nuevo seguimiento durante el arrastre
  };

  // Función para manejar el fin del arrastre
  const handleMouseUp = () => {
    setIsMouseDown(false);
    setSelectedDuringDrag([]); // Reinicia el seguimiento al final del arrastre
    console.log(selectedHours);
  };

  // Función para manejar el movimiento del mouse y la selección
  const handleMouseMove = (day, hour) => {
    if (isMouseDown) {
      const clickedHour = `${day}-${hour}`;
      if (!selectedDuringDrag.includes(clickedHour)) {
        setSelectedDuringDrag([...selectedDuringDrag, clickedHour]);
        setSelectedHours([...selectedHours, clickedHour]);
      }
    }
  };

  // Función para manejar el clic en un cuadrado
  const handleHourClick = (day, hour) => {
    const clickedHour = `${day}-${hour}`;
    if (selectedDuringDrag.includes(clickedHour)) {
      // Evita cambios si la celda se seleccionó durante el arrastre
      return;
    }

    if (selectedHours.includes(clickedHour)) {
      setSelectedHours(selectedHours.filter((h) => h !== clickedHour));
    } else {
      setSelectedHours([...selectedHours, clickedHour]);
    }
  };

  useEffect(() => {
    // Al soltar el botón del mouse, copia los cuadrados seleccionados durante el arrastre
    // para evitar que se cambien al hacer clic en ellos
    setSelectedDuringDrag([...selectedHours]);
  }, [selectedHours]);

  const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const hours = Array.from({ length: 13 }, (_, i) => `${i + 8} AM`);

  // Función para manejar cambios en el campo del nombre del profesor
  const handleProfessorChange = (e) => {
    setProfessor(e.target.value);
    setFormData({ ...formData, profesor: e.target.value });
  };

  // Función para manejar cambios en el campo del curso
  const handleCourseChange = (e) => {
    setCourse(e.target.value);
    setFormData({ ...formData, curso: e.target.value });
  };
  // Función para manejar cambios en el campo de la sección
  const handleSectionChange = (e) => {
    setSection(parseInt(e.target.value, 10)); // Convierte el valor a un número entero
    setFormData({ ...formData, section: parseInt(e.target.value, 10) });
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
    setFormData({ ...formData, color: color.hex });
  };

  // Función para alternar entre mostrar y ocultar el selector de colores
  const handleShowColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const updateLocalStorage = (turno) => {
    // Obtiene los datos del localStorage
    const pabellones = JSON.parse(localStorage.getItem("pabellones"));
    // busca el lab especificado dentro del pabellon especificado en los props del link
    const lab = pabellones[pabellon].find(
      (lab) => lab.id === parseInt(lab_id, 10)
    );

    //buscar si existe un turno con el mismo curso y misma seccion, si existe, eliminarlo y crear uno nuevo
    const index = lab.turnos.findIndex(
      (turno) =>
        //turno.profesor === formData.profesor &&
        turno.curso === formData.curso && turno.section === formData.section
    );
    if (index !== -1) {
      lab.turnos.splice(index, 1);
    }

    //subir el turno creado al lab
    lab.turnos.push(turno);
    // Convierte el objeto principal en una cadena de texto
    const dataToStoreString = JSON.stringify(pabellones);
    // Almacena la cadena de texto en el localStorage
    localStorage.setItem("pabellones", dataToStoreString);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un objeto para almacenar la información de la fecha
    const fecha = { dia: "", horas: "" };

    // Recorrer los días y horas seleccionados
    Array.from({ length: 6 }, (_, day) => {
      const dia = days[day];
      const horas = Array.from({ length: 13 }, (_, hour) =>
        selectedHours.includes(`${day}-${hour}`) ? hour + 8 : null
      ).filter((hour) => hour !== null);

      if (horas.length > 0) {
        const inicioHora = `${horas[0]}:00`; // Hora de inicio
        const finHora = `${horas[horas.length - 1] + 1}:00`; // Hora de finalización
        fecha["horas"] = `${inicioHora} - ${finHora}`;
        fecha["dia"] = dia;
      }
    });

    // Actualizar el estado o enviar los datos a la base de datos
    setFormData({ ...formData, fecha });
    console.log(formData);
    updateLocalStorage({ ...formData, fecha });
  };

  return (
    <div className="lab-page">
      <div className="data-form">
        <h2>
          Lab {lab_id} {pabellon == "antiguoPabellon" ? "AP" : "NP"}
        </h2>
        <br />
        <br />
        <form>
          <input
            type="text"
            placeholder="profesor"
            value={professor}
            onChange={handleProfessorChange}
          />
          <input
            type="text"
            placeholder="curso"
            value={course}
            onChange={handleCourseChange}
          />

          <label htmlFor="section">Sección:</label>
          <select id="section" value={section} onChange={handleSectionChange}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>

          <div className="color-selector">
            <button
              type="button"
              onClick={handleShowColorPicker}
              style={{ backgroundColor: color }}
              className="select-color"
            ></button>
            <button type="submit" onClick={handleSubmit} className="submit">
              Submit
            </button>

            {showColorPicker && (
              <div ref={colorPickerRef} className="paleta-colores">
                <SketchPicker color={color} onChange={handleColorChange} />
              </div>
            )}
          </div>
        </form>
      </div>
      <div className="horario">
        <Stage width={800} height={500}>
          <Layer>
            {
              /* Renderiza la cuadrícula de días y horas con encabezados */
              days.map((day, index) => (
                <Text
                  key={`day-${index}`}
                  text={day}
                  x={index * 100 + 100}
                  y={0}
                />
              ))
            }
            {hours.map((hour, index) => (
              <Text
                key={`hour-${index}`}
                text={hour}
                x={0}
                y={index * 30 + 30}
              />
            ))}
            {Array.from({ length: 6 }, (_, day) =>
              Array.from({ length: 13 }, (_, hour) => (
                <Rect
                  key={`${day}-${hour}`}
                  x={day * 100 + 100}
                  y={hour * 30 + 30}
                  width={100}
                  height={30}
                  fill={
                    selectedHours.includes(`${day}-${hour}`) ? color : "white"
                  }
                  stroke="black"
                  strokeWidth={1}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={() => handleMouseMove(day, hour)}
                  onClick={() => handleHourClick(day, hour)}
                />
              ))
            )}
          </Layer>
        </Stage>
        <div className="buttons">
          <div>
            <button onClick={decreaseNumber} className="next">
            &lt;&lt;
            </button>
          </div>
          <div>
            <button onClick={incrementNumber} className="next">
            &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lab;
