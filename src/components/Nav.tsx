import Logo from "../assets/decklab_logo.png";
const Nav = () => {
  return (
    <div className="bg-slate-900 w-full fixed top-0">
      <img src={Logo} alt="Decklab Logo" className="h-30 w-auto" />
    </div>
  );
};

export default Nav;
