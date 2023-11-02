import { useState, useEffect } from "react";
import "./Labs.css";
import Image from "next/image";

function Labs() {
  const [antiguoPabellon, setAntiguoPabellon] = useState([]);
  const [nuevoPabellon, setNuevoPabellon] = useState([]);

  const [turno, setTurno] = useState();

  function createData() {
    // Verifica si los objetos ya existen en el localStorage
    if (!localStorage.getItem("pabellones")) {
      // Si no existen, procede a crear y almacenar los datos
      console.log("Creando datos de prueba...");
      const dataToStore = {
        antiguoPabellon: Array(10)
          .fill(0)
          .map((_, index) => ({
            id: index + 1, // IDs del 1 al 10
            turnos: [
            ],
          })),
        nuevoPabellon: Array(10)
          .fill(0)
          .map((_, index) => ({
            id: index + 1, // IDs del 1 al 10
            turnos: [
            ],
          })),
      };

      // Convierte el objeto principal en una cadena de texto
      const dataToStoreString = JSON.stringify(dataToStore);

      // Almacena la cadena de texto en el localStorage
      localStorage.setItem("pabellones", dataToStoreString);
    }
  }

  // Función para obtener los datos de localStorage
  function getData() {
    const storedDataString = localStorage.getItem("pabellones");
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);
      setAntiguoPabellon(storedData.antiguoPabellon);
      setNuevoPabellon(storedData.nuevoPabellon);
    }
  }

  // Manejador de eventos para seleccionar un laboratorio
  function selectLab(lab) {
    // Busca el turno activo dentro del laboratorio
    const turnoActivo = lab.turnos.find((turno) => turno.in_use);
    // Agrega la clase "active" al laboratorio actual

    console.log(lab);

    // Si se encontró un turno activo, muéstralo
    if (turnoActivo) {
      setTurno(turnoActivo);
    } else {
      // Si no se encontró un turno activo, establece el turno en null
      setTurno(null);
    }
  }

  useEffect(() => {
    createData();
    getData();
  }, []);

  const handleClickEditar = () => {
    window.location.href = `/SUOE/labs/nuevoPabellon/3`;
  };

  // Llama a actualizarEstadoEnTiempoReal cada minuto (ajusta el intervalo según tus necesidades)
  useEffect(() => {
    // Función para verificar si un laboratorio está en uso
    const verificarUso = (fecha) => {
      const now = new Date();
      const diaActual = now.toLocaleDateString("es-ES", { weekday: "long" });
      const horaActual = now.getHours() * 60 + now.getMinutes(); // Convierte la hora actual a minutos desde la medianoche
      const horasLab = fecha.horas.split(" - ").map((hora) => {
        const [hh, mm] = hora.split(":");
        return parseInt(hh, 10) * 60 + parseInt(mm, 10); // Convierte las horas del laboratorio a minutos desde la medianoche
      });

      const resultado =
        diaActual === fecha.dia &&
        horaActual >= horasLab[0] &&
        horaActual <= horasLab[1];

      return resultado;
    };

    // Función para actualizar el estado de uso en tiempo real
    const actualizarEstadoEnTiempoReal = () => {
      // Actualiza el estado de uso en tiempo real para los turnos de antiguoPabellon
      const updatedAntiguoPabellon = antiguoPabellon.map((lab) => ({
        ...lab,
        turnos: lab.turnos.map((turno) => ({
          ...turno,
          in_use: verificarUso(turno.fecha),
        })),
      }));

      // Actualiza el estado de uso en tiempo real para los turnos de nuevoPabellon
      const updatedNuevoPabellon = nuevoPabellon.map((lab) => ({
        ...lab,
        turnos: lab.turnos.map((turno) => ({
          ...turno,
          in_use: verificarUso(turno.fecha),
        })),
      }));

      setAntiguoPabellon(updatedAntiguoPabellon);
      setNuevoPabellon(updatedNuevoPabellon);
    };

    // Llama a actualizarEstadoEnTiempoReal cada minuto (ajusta el intervalo según tus necesidades)
    const intervalId = setInterval(actualizarEstadoEnTiempoReal, 1000); // Cada minuto
    return () => clearInterval(intervalId);
  }, [antiguoPabellon, nuevoPabellon]);

  return (
    <>
      <div className="labs-page">
        <div className="container-labs">
          <h2>ANTIGUO PABELÓN</h2>
          <div className="labs">
            {antiguoPabellon.map((laboratorio) => (
              <div
                className={`lab ${
                  laboratorio.turnos.some((turno) => turno.in_use)
                    ? "ocupado"
                    : "disponible"
                }`}
                id={"lab-" + laboratorio.id + "-ap"}
                onClick={() => selectLab(laboratorio)}
                key={laboratorio.id}
              >
                <p>
                  <b>LAB-{laboratorio.id}</b>
                </p>
              </div>
            ))}
          </div>

          <h2>NUEVO PABELLÓN</h2>
          <div className="labs">
            {nuevoPabellon.map((laboratorio) => (
              <div
                className={`lab ${
                  laboratorio.turnos.some((turno) => turno.in_use)
                    ? "ocupado"
                    : "disponible"
                }`}
                id={"lab-" + laboratorio.id + "-np"}
                onClick={() => selectLab(laboratorio)}
                key={laboratorio.id}
              >
                <p>
                  <b>LAB-{laboratorio.id}</b>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="lab-data">
          <div className="header">
            {turno ? (
              <div className="ocupado">OCUPADO</div>
            ) : (
              <div className="disponible">DISPONIBLE</div>
            )}
          </div>
          <hr />
          <div className="body">
            <div className="perfil">
              <img
                src={
                  turno
                    ? "https://scontent.flim15-2.fna.fbcdn.net/v/t39.30808-6/250326312_262981839172907_4136456428755108223_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFMiFtSPWE6AqxMycMpwy7BdWWon76RI811ZaifvpEjzYVlaWWS4z79TyQszNsP_aNiXta0XVUna8FSNWP67RzE&_nc_ohc=ffl0UZB8TUQAX9A8UDL&_nc_ht=scontent.flim15-2.fna&oh=00_AfB4GC1gVdMC_0ukD-ZNbJC6rVTHAe9OBY52LALeV5sTGg&oe=6535F53B"
                    : "https://images.jdmagicbox.com/comp/gaya/i8/9999px631.x631.170612231203.y3i8/catalogue/surya-communication-gaya-cyber-cafes-827t4pqgly.jpg?clr="
                }
                alt=""
              />
            </div>
            {turno ? (
              <div className="data">
                <p>{turno.profesor}</p>
                <p>{turno.curso}</p>

                <p className="hora">{turno.fecha.horas}</p>
                <button className="editar" onClick={handleClickEditar}>
                  Editar
                </button>
              </div>
            ) : (
              <div className="data">
                <p></p>
                <p></p>
                <p className="hora"></p>
                <button className="editar" onClick={handleClickEditar}>
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Labs;
