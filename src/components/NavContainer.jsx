
import { Container, Navbar, Image } from "react-bootstrap";
import Logo from "../assets/img/logo22.png";

const NavContainer = () => {
  return (
    <Container fluid className="justify-content-between w-auto ms-1">
      <Navbar.Toggle aria-controls="offcanvasNavbar" style={{ margin: "0 10px" }} />
      <Image src={Logo} style={{ width: "30px", left: "5px"}} roundedCircle />
      <Navbar.Brand href="/home" className="d-none d-md-block">
        <h3>GespaWeb</h3>
      </Navbar.Brand>
    </Container>
  );
};

export default NavContainer;