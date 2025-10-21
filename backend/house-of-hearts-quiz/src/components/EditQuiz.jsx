import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateQuiz.css';

const emptyQuestion = () => ({ questionText: '', options: ['', '', '', ''], correctAnswer: '' });

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/student/quizzes/${quizId}`, { withCredentials: true });
        const data = res.data;
        setQuizData({ title: data.title || '', description: data.description || '' });
        // convert questions format
        const q = (data.questions || []).map(qi => ({
          questionText: qi.text || '',
          options: Array.isArray(qi.options) ? qi.options.slice(0,4).concat(Array(4 - (qi.options||[]).length).fill('')).slice(0,4) : ['', '', '', ''],
          correctAnswer: '' // correctAnswer isn't returned to students; editor will need existing corrects. We'll fetch full quiz if needed
        }));

        // fetch full quiz from admin endpoint to get correct answers if available
        try {
          const full = await axios.get(`http://localhost:8080/api/quizzes` , { withCredentials: true });
          // find full quiz by id
          const fullQuiz = (full.data || []).find(x => String(x.id) === String(quizId));
          if (fullQuiz && fullQuiz.questions) {
            const merged = fullQuiz.questions.map(fq => ({
              questionText: fq.text || '',
              options: fq.options || ['', '', '', ''],
              correctAnswer: fq.correctAnswer || ''
            }));
            setQuestions(merged);
          } else {
            setQuestions(q);
          }
        } catch (innerErr) {
          // fallback to student-visible questions
          setQuestions(q);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz for editing');
        console.error(err);
        setLoading(false);
      }
    };
    load();
  }, [quizId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      if (field === 'option') {
        copy[index].options = [...copy[index].options];
        copy[index].options[value.idx] = value.val;
      } else {
        copy[index][field] = value;
      }
      return copy;
    });
  };

  const addQuestion = () => {
    if (questions.length >= 25) return;
    setQuestions(prev => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (idx) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // validate
      if (!quizData.title.trim()) {
        setError('Title is required');
        return;
      }
      // prepare payload
      const payload = {
        title: quizData.title,
        description: quizData.description,
        questions: questions.map(q => ({ questionText: q.questionText, options: q.options, correctAnswer: q.correctAnswer }))
      };

      await axios.put(`http://localhost:8080/api/admin/quizzes/${quizId}`, payload, { withCredentials: true });
      navigate('/admin');
    } catch (err) {
      setError('Failed to save quiz: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="create-quiz-container">
      <h2>Edit Quiz</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title</label>
          <input name="title" value={quizData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={quizData.description} onChange={handleChange} />
        </div>

        <h3>Questions ({questions.length})</h3>
        {questions.map((q, idx) => (
          <div key={idx} className="question-edit">
            <div className="form-group">
              <label>Question {idx + 1}</label>
              <input value={q.questionText} onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)} />
            </div>
            {q.options.map((opt, oi) => (
              <div key={oi} className="form-group">
                <label>Option {oi + 1}</label>
                <input value={opt} onChange={(e) => handleQuestionChange(idx, 'option', { idx: oi, val: e.target.value })} />
              </div>
            ))}
            <div className="form-group">
              <label>Correct Answer</label>
              <select value={q.correctAnswer} onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}>
                <option value="">Select correct answer</option>
                {q.options.map((opt, oi) => opt && <option key={oi} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <button type="button" onClick={() => removeQuestion(idx)}>Remove question</button>
            </div>
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <button type="button" onClick={addQuestion}>Add question</button>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditQuiz;

