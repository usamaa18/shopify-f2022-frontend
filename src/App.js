import './App.css';
import React from 'react';

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
  // console.log(process.env.REACT_APP_OPENAPI_KEY);
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
    getResponse(prompt, engine).then(data => {
      let newItem = {
        prompt: prompt,
        response: data.choices[0].text,
        engine: engine
      };
      console.log(newItem);
      this.setState(prevState => ({
        itemArr: [newItem, ...prevState.itemArr]
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
      <div className="container mx-auto font-mono text-color2 flex flex-col space-y-8 mt-8 font-['Lato'] font-light px-2 sm:px-4 ">
        <p className='text-4xl text-center tracking-normal lg:tracking-widest'>FUN WITH AI!</p>
        <form onSubmit={this.handleSubmit} className="flex flex-col space-y-0 border-2 border-color2 divide-color2 divide-y-2">
          <select className="w-full m-0 p-4 text-color2 bg-color1 hover:bg-color2 focus:bg-color2 focus:text-color1 hover:text-color1" onChange={this.handleSelectChange} required>
            {engines.map(element => {
              return <option key={element}>{element}</option>
            })}
          </select>
          <textarea className="w-full m-0 p-4 outline-0 focus:outline-none placeholder:text-color2 hover:placeholder:text-color1 bg-color1 text-color2 hover:bg-color2 hover:text-color1" placeholder='PROMPT' rows="3" value={this.state.textAreaValue} onChange={this.handleTextAreaChange} required />
          <button type="submit" className="w-full m-0 p-4 text-color2 hover:bg-color2 hover:text-color1">GO</button>
        </form>

        <div className='overflow-y-auto'>
          <p className='text-xl text-center tracking-normal lg:tracking-widest mb-4'>RESPONSES</p>
          {this.state.itemArr.length === 0 ? <p className='p-4'>No items</p> : <div/>}
          
          <div className='space-y-6 mb-6'>
            {this.state.itemArr.map((element, i) => {
              return <div key={i} className="border-2 border-color2 p-4 space-y-2">
                <div className='flex flex-row'>
                  <p className='basis-1/4 font-bold'>ENGINE</p>
                  <p className='basis-3/4'>{element.engine}</p>
                </div>
                <div className='flex flex-row'>
                  <p className='basis-1/4 font-bold'>PROMPT</p>
                  <p className='basis-3/4'>{element.prompt}</p>
                </div>
                <div className='flex flex-row'>
                  <p className='basis-1/4 font-bold'>RESPONSE</p>
                  <p className='basis-3/4'>{element.response}</p>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
