import { Container, Navbar, Image } from "react-bootstrap";
import Logo from "../assets/img/Gespa_LogoFrame.svg";

const NavContainer = () => {
  return (
    <Container fluid className="justify-content-between w-auto ms-1">
      <Navbar.Toggle
        aria-controls="offcanvasNavbar"
        style={{ margin: "0 10px" }}
      />

      <Navbar.Brand href="/home" className="d-none d-md-block">
        <h3>
          {" "}
          <Image
            src={Logo}
            style={{ width: "30px", left: "5px", font: "bold" }}
            roundedCircle
          />{" "}
          GESPA
        </h3>
      </Navbar.Brand>
    </Container>
  );
};

export default NavContainer;
