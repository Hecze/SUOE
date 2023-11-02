
import "./Navbar.css";
import Link from "next/link";
import Image from "next/image";

function Navbar () {

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <div className="logo" id="fisi">
        <Image src="/fisi.png" width={"300"} height={"300"} alt="" />
        <h2>ESPACIOS FISI</h2>
        </div>
        <li className="nav-item"><Link href="/">Inicio</Link></li>
        <li className="nav-item"><Link href="/">Servicios</Link></li>
        <li className="nav-item"><Link href="/LabsPage">Laboratorios</Link></li>
        <li className="nav-item"><Link href="https://mrsquatch.github.io/Reserva-de-Espacio-FISI/">Otros espacios</Link></li>
        <div className="logo" id="unmsm">
        <Image src="/unmsm.png" width={"150"} height={"40"} alt="" />
        </div>

      </ul>
    </nav>
  );
}

export default Navbar;
