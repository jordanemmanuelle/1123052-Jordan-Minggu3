import { useState } from "react";
import { isEmail } from "./utils/isEmail";
import { ToDo } from "./ToDo";
import { PostList } from "./PostList";

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async () => {
    // 1. Validasi format email di awal
    if (!isEmail(email)) {
      alert("Invalid email format");
      return;
    }

    try {
      // 2. Request ke Server
      // Pastikan URL ini benar. Jika backend beda port, ganti 5173 ke port backend (misal 3000)
      const response = await fetch('http://localhost:5173/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // <--- PENTING: Mencegah Error 500
        },
        body: JSON.stringify({
          email,
          password,
        })
      });

      // 3. Cek hasil dari server
      if (response.ok) { // response.ok bernilai true jika status 200-299
        setIsLoggedIn(true); // <--- PENTING: Ubah state agar UI berubah
        // Opsional: Kosongkan password agar tidak tersimpan di state
        setPassword(''); 
      } else {
        // Jika password salah atau user tidak ditemukan
        alert("Login failed: Check your email or password");
      }

    } catch (error) {
      // Jika server mati atau internet putus
      console.error("Login Error:", error);
      alert("Failed to connect to server");
    }
  }

  const Logout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  }

  // Jika sudah login, tampilkan halaman Hello + ToDo
  if (isLoggedIn) {
    return (
      <div>
        <div> Hello, {email} </div>
        {/* <ToDo/> */}
        <PostList/>
        <br/>
        <button onClick={Logout}> Logout </button>
      </div>
    );
  }

  // Jika belum login, tampilkan Form Login
  return (
    <div>
      <h4> Login </h4>
      
      <div>
        <p> Email </p>
        <input type="text" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter email..."
        />
      </div>
      
      <div>
        <p> Password </p>
        <input type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password..."
        />
      </div>
      
      <br />

      <div>
        <button onClick={login}> Login </button>
      </div>

      <br /> 
      
      {/* Debugging helpers - boleh dihapus nanti */}
      <div style={{ fontSize: '12px', color: 'gray' }}> 
        Debug: {email} | {password} 
      </div>

    </div>
  );
}

export default App;