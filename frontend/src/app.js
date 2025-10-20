import React, { useState } from 'react'; import axios from 'axios'; import AdminPanel
from './AdminPanel'; import StudentPanel from './StudentPanel'; import './App.css';
function App() { const [isAdmin, setIsAdmin] = useState(false); const [view, setView]=
useState('home'); return (
<div className="App"><h1> HOUSE OF HEARTS QUIZ</h1>
{!isAdmin ? <Login setIsAdmin={setIsAdmin} setView={setView} /> : view ===
'admin' ? <AdminPanel setView={setView} /> : <StudentPanel setView={setView} />}
</div>); }
const Login = ({ setIsAdmin, setView }) => { const [username, setUsername] =
useState(''); const [password, setPassword] = useState('');
const handleLogin = async () => { try { const res = await axios.post('/api/login', {
username, password}); if (res.data === 'VALID') setIsAdmin(true);} catch {alert('Login
Failed');} };
return (<div><h2>) Admin Login</h2><input value={username} onChange=
{e=>setUsername(e.target.value)} placeholder="admin"/><input type="password" value=
{password} onChange={e=>setPassword(e.target.value)} placeholder="1234"/><button onClick=
{handleLogin}>Login</button></div>); };
export default App;