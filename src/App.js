import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

var colors = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];
var engines = ["text-ada-001", "text-davinci-002", "text-curie-001", "text-babbage-001"];
async function getResponse(prompt, engine) {
  const data = {
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  const response = await fetch("https://api.openai.com/v1/engines/" + engine + "/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAPI_KEY}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: engines[0],
      textAreaValue: "",
      itemArr: []
    }
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event) {
    event.preventDefault();
    let prompt = this.state.textAreaValue;
    let engine = this.state.selectValue;
    console.log(prompt);
    getResponse(prompt, engine).then(data => {
      let newItem = {
        prompt: prompt,
        response: data.choices[0].text,
        engine: engine
      };
      console.log(newItem);
      this.setState(prevState => ({
        itemArr: [...prevState.itemArr, newItem]
      }));
    });


  }

  handleTextAreaChange(event) {
    this.setState({ textAreaValue: event.target.value });
  }

  handleSelectChange(event) {
    this.setState({ selectValue: event.target.value });
  }

  render() {

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3 mt-3">
            <select className="form-select" aria-label="Default select example" onChange={this.handleSelectChange} required>
              {engines.map(element => {
                return <option key={element}>{element}</option>
              })}
            </select>
          </div>
          <div className="mb-3">
            <textarea className="form-control" placeholder='PROMPT' rows="3" value={this.state.textAreaValue} onChange={this.handleTextAreaChange} required />

          </div>
          <div className="d-grid gap-2">

            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>

        {this.state.itemArr.map((element, i) => {
          return <div key={i}>
            <p>{element.prompt}</p>
            <p>{element.response}</p>
          </div>
        })}
      </div>
    );
  }
}

export default App;
