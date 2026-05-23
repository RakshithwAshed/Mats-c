import Chat from "./Chat";

function Dashboard() {

  const logout = () => {

    localStorage.removeItem("token");

    window.location.reload();

  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Private Dashboard 🔐</h1>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <Chat />

    </div>

  );

}

export default Dashboard;