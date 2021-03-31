import './App.css';
import { useState, useEffect } from 'react'

const api = process.env.REACT_APP_API_URL

function App() {


  // useState
  const [ text, setText ] = useState('')
  const [ completed, setCompleted ] = useState(false)
  const [ taskList, setTaskList ] = useState([])

  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(null)

  // useEffect
  useEffect(() => {
    fetch(`${ api }/task`)
      .then(response => response.json())
      .then(data => {
        setTaskList(data.body)
        setLoading(false)
        setError(null)
      })
      .catch(error => setError('Ha ocurrido une error'))
  }, [])

  // Funciones
  const handleSubmit = e => {
    e.preventDefault()

    const textString = text.trim()
    const url = `${ api }/task`

    if (textString === '') {
      console.log('Faltan datos')
      return
    }

    fetch(url, {
      method: 'POST', 
      mode: 'cors',
      cache: 'no-cache', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: textString,
        completed
      }) 
    })
      .then(response => response.json())
      .then(dataResponse => {
        if (dataResponse.error) {
          // Handle error
        } else {
          const { data, result } = dataResponse.body

          setTaskList([
            ...taskList,
            { id: result.insertId, text: data.text, completed: data.completed }
          ])
          cleanForm()
        }

        setError(null)
      })
      .catch(error => setError('Ha ocurrido une error'))
  }

  const handleChangeCompleted = (id, checked) => {
    const url = `${ api }/task`

    fetch(url, {
      method: 'PUT', 
      mode: 'cors',
      cache: 'no-cache', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        completed: checked
      }) 
    })
      .then(response => response.json())
      .then(dataResponse => {
        setTaskList(actual => actual.map(a => {
          if (a.id === id) {
            return { id, text: a.text, completed: !a.completed }
          }

          return a
        }))

        setError(null)
      })
      .catch(error => setError('Ha ocurrido une error'))
  }

  const handleEliminar = id => {
    const url = `${ api }/task`

    fetch(url, {
      method: 'DELETE', 
      mode: 'cors',
      cache: 'no-cache', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id
      }) 
    })
      .then(response => response.json())
      .then(dataResponse => {
        setTaskList(actual => actual.filter(a => a.id !== dataResponse.body.id))
        setError(null)
      })
      .catch(error => setError('Ha ocurrido une error'))
  }

  const cleanForm = () => {
    setText('')
    setCompleted(false)
  }

  return (
    <>
    <header>
      <div className='container'>
        <h1>TODO - ocorea</h1>
      </div>
    </header>

    { error && (
      <div className='error'>
        <p className='container'>{ error }</p>
      </div>
    )}

    <main className='container'>
      { loading ? (
        <h1>Loading...</h1>  
      ) : (
        <>
          <form className='add-todo'>
            <p>Add task</p>

            <div className='inputs'>
              <input 
                type='text'
                placeholder='Task name'
                value={ text }
                onChange={ e => setText(e.target.value) }
              />
              <input 
                type='checkbox'
                checked={ completed }
                onChange={ e => setCompleted(e.target.checked) }
              />
            </div>
            <button onClick={ handleSubmit }>Save</button>
          </form>
          <div className='todos'>
            <div className='head'>
              <p>Task</p>
              <p className='right'>Completed</p>
              <p className='right'>Delete</p>
            </div>

            {/* Load tasks */}
            { taskList.map((task, index) => (
              <div 
                key={ index }
                className='list'
              >
                <p>{ task.text }</p>
                <div className='right'>
                    <input 
                      type='checkbox' 
                      checked={ task.completed }
                      onChange={ e => handleChangeCompleted(task.id, e.target.checked) } 
                    />
                  </div>
                <div className='right'>
                  <span onClick={ () => handleEliminar(task.id) }>X</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>

    </>
  );
}

export default App;
