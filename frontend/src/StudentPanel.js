import React, { useState, useEffect } from 'react'; import axios from 'axios';
const studentPanel = ({ setView }) => { const [houseName, setHouseName] =
useState('RED'); const [quizzes, setQuizzes] = useState([]); const [selectedQuiz,
setSelectedQuiz] = useState(null); const [questions, setQuestions]= useState([]); const
[answers, setAnswers] = useState({});
useEffect(() => {axios.get(/api/quizzes/house/{houseName === 'RED' ? 1 : houseName
=== 'BLUE' ? 2 : 3}).then(res => setQuizzes(res.data)); }, [houseName];
const takeQuiz = (quizId) => { setSelectedQuiz(quizId);
axios.get('/api/quizzes/${quizId}/questions').then(res => setQuestions(res.data)); };
const submitQuiz = () => { axios.post('/api/quizzes/submit,' { quizId: selectedQuiz,
answers: Object.entries(answers).map(([qId, ans] => ({ questionId: =qId, answer:ans}))
}).then(res=> alert('Score: ${res.data}/10'));setSelectedQuiz(null); };
return (<div><h2> STUDENT PORTAL</h2><button onClick=
{()=>setView('admin')}>Admin</button>
<select value={houseName} onChange={e=>setHouseName(e.target.value)}>
<option>RED</option><option>BLUE</option><option>GREEN</option></select>
<h3>Quizzes</h3><ul>{quizzes.map(q => <li key={q.id}><button onClick=
{()=>takeQuiz(q.id)}>{q.title}</button></li>)}</ul>
{selectedQuiz && <div><h3>Taking Quiz</h3>{questions.map(q => <div key={q.id}><p>
{q.text}</p>{q.options.map(opt => <label><input type="radio" name={q.id} value={opt}
onChange={e=>setAnswers({...answers, [q.id:] e.target.value})}/>{opt}</label>)}</div>)}
<button onClick={submitQuiz}>Submit</button></div>}</div>); };
export default StudentPanel;