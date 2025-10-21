import React, { useState, useEffect } from 'react'; import axios from 'axios';
const AdminPanel = ({ setView }) => { const [houses, setHouses] = useState([]); const
[quizzes, setQuizzes] = useState(''); const [title, setTitle] = useState(''); const
[description, setDescription] = useState(''); const [houseId, setHouseId] = useState('');
useEffect(() => { axios.get('/api/houses').then (res=> setHouses (res.data));
axios.get('/api/quizzes'). then(res => setQuizzes(res.data)); }, []);
const createQuiz = () => { axios.post('/api/quizzes', { title, description, house: {
id: houseId } }). then(() => { setTitle (''); setDescription ('');
axios.get('/api/quizzes'). then(res => setQuizzes(res.data)); }); };
return (<div><h2>) ADMIN PANEL</h2><button onClick=
{ ()=>setView('home')}>Logout</button>
<h3+ Create Quiz</h3><input value={title} onChange={e=>setTitle(e.target.value)}
placeholder="Title"/><input value={description} onChange=
{e=>setDescription(e.target.value)} placeholder="Description"/>
<select value={houseId} onChange={e=>setHouseId(e.target.value)}><option
value=" "> House</option>{houses.map(h=><option key={h.id} value={h.id}>{h.name} {h.color}
</option>)}</select>
<button onclick={createQuiz}>Create</button>
<h3> Quizzes</h3><ul>{quizzes.map(q => <li key={q.id}>{q.title} - {q.house.name}
{q.house.color}</li)}</ul></div); };
export default AdminPanel;
