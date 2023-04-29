import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Configuration, OpenAIApi } from "openai";

import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    // const configuration = new Configuration({
    //     apiKey: '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'
    // });
    // const openai = new OpenAIApi(configuration);

    // setLoading(true);

    // setResponses(prevResponses => [...prevResponses, prompt]);

    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: prompt,
    //   temperature: 0.7,
    //   max_tokens: 512,
    // });

    // setPrompt('');

    // setLoading(false);

    // setResponses(prevResponses => [...prevResponses, response.data.choices[0].text]);

    setMessages(prevResponses => [...prevResponses, { role: "user", content: prompt }]);
    messages.push( { role: "user", content: prompt } );

    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo',
        'messages': messages
      })
    };

    setLoading(true);

    setResponses(prevResponses => [...prevResponses, prompt]);

    setPrompt('');

    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();

    setLoading(false);

    setResponses(prevResponses => [...prevResponses, data.choices[0].message.content]);
    setMessages(prevResponses => [...prevResponses, { role: "assistant", content: data.choices[0].message.content }]);
    messages.push( { role: "assistant", content: data.choices[0].message.content } );
  };

  return (
    <main>
      <div className='container mx-auto flex justify-center'>

        <div className='w-1/3 mt-20'>
          <h2 className='text-5xl text-center text-white mb-5'>MY CHAT APP</h2>
          <div className='border rounded-md'>
            
            <div className='border-b p-6'>
              <p className='text-md text-white text-center'>Your chat history goes here: </p>
            </div>
            <div className='border-b p-6'>

              {responses && responses.map((item, index) => {
                return(
                  <div key={index} className='bg-zinc-800 p-3 rounded-md flex mb-3'>
                    <p className='text-zinc-200 text-xs mr-2'>[{index + 1}]</p>
                    <p className='text-white text-sm'>{item}</p>
                  </div>
                )
              })}

              {loading && (
                <p className='text-white text-md text-center'>Loading...</p>
              )}

            </div>
            <div className='border-t p-6 flex'>
              <input onChange={(e) => { setPrompt(e.target.value) }} value={prompt} type="text" className='w-8/12 bg-zinc-600 px-4 py-2 rounded-tl-md rounded-bl-md text-white' placeholder='Your message goes here' />
              <button onClick={() => { sendMessage() }} type="button" className='w-4/12 bg-zinc-700 text-white rounded-tr-md rounded-br-md'>Send</button>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}
