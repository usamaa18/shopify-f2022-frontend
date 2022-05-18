import './App.css';
import React from 'react';

var engines = [{
  name: "text-ada-001",
  label: "Ada"
}, {
  name: "text-davinci-002",
  label: "Davinci"
}, {
  name: "text-curie-001",
  label: "Curie"
}, {
  name: "text-babbage-001",
  label: "Babbage"
},]
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
      selectValue: "",
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
    this.setState(prevState => {
      console.log(event.target)
      return { selectValue: event.target.value }
    });
  }

  render() {

    return (
      <div className="container mx-auto font-mono text-color2 flex flex-col space-y-8 mt-8 font-['Lato'] font-light px-2 sm:px-4 ">
        <p className='text-4xl text-center tracking-normal lg:tracking-widest text-color3'>FUN WITH AI!</p>
        <form onSubmit={this.handleSubmit} className="flex flex-col space-y-0 border border-color2 divide-color2 divide-y">
          <select  defaultValue="" required className="duration-300 w-full m-0 p-4 valid:text-color3 bg-color1 hover:bg-color2 focus:bg-color2 focus:text-color1 hover:text-color1" onChange={this.handleSelectChange}>
            <option disabled value="" hidden>ENGINE</option>
            {engines.map(element => {
              return <option key={element.name} value={element.name} name="hello">{element.label}</option>
            })}
          </select>
          <textarea className="duration-300 w-full m-0 p-4 outline-0 focus:outline-none placeholder:text-color2 hover:placeholder:text-color1 bg-color1 text-color3 hover:bg-color2 hover:text-color1" placeholder='PROMPT' rows="3" value={this.state.textAreaValue} onChange={this.handleTextAreaChange} required />
          <button type="submit" className="duration-300 w-full m-0 p-4 text-color3 hover:bg-color2 hover:text-color1">GO</button>
        </form>

        <div className='overflow-y-auto text-color3'>
          <p className='text-xl text-center tracking-normal lg:tracking-widest mb-4'>RESPONSES</p>
          {this.state.itemArr.length === 0 ? <p className='p-4'>No items</p> : <div />}

          <div className='space-y-6 mb-6 '>
            {this.state.itemArr.map((element, i) => {
              return <div key={i} className="border border-color2 p-4 space-y-2">
                <div className='flex flex-row'>
                  <p className='basis-1/4 font-medium'>Engine:</p>
                  <p className='basis-3/4'>{element.engine}</p>
                </div>
                <div className='flex flex-row'>
                  <p className='basis-1/4 font-medium'>Prompt:</p>
                  <p className='basis-3/4'>{element.prompt}</p>
                </div>
                <div className='flex flex-row'>
                  <p className='basis-1/4 font-medium'>Response:</p>
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
