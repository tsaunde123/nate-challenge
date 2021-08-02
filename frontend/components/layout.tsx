import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center">
      <Navbar />
      <div className="flex-grow">{children}</div>
      {/* footer */}
    </div>
  );
};

export default Layout;
