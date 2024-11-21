import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

const MyApp = () => {
 
  const backendUrl = procces.env.REACT_APP_BACKEND_URL

  const [inputJSON, setInputJSON] = useState('');
  const [APIResponse, setAPIResponse] = useState(null);
  const [filters, setFilters] = useState([]);

  const dropdownOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedData = JSON.parse(inputJSON);
      const response = await axios.post(`${backendUrl}/bfhl`, parsedData);
      console.log(response);
      toast.success("Response fetched");
      setAPIResponse(response.data);
    } catch (err) {
      if (err.response) {
        toast.error(`Error: ${err.response.data.error || 'Unknown error'} - Status: ${err.response.status}`);
      } else if (err.request) {
        toast.error('Error: No response received from server');
      } else {
        toast.error(`Error: ${err.message}`);
      }
      setAPIResponse(null);
    }
  };

  const displayResponse = () => {
    if (!APIResponse) return null;

    return (
      <div>
        {filters.includes('alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <p>{APIResponse.alphabets.join(', ')}</p>
          </div>
        )}
        {filters.includes('numbers') && (
          <div>
            <h3>Numbers:</h3>
            <p>{APIResponse.numbers.join(', ')}</p>
          </div>
        )}
        {filters.includes('highest_alphabet') && (
          <div>
            <h3>Highest Alphabet:</h3>
            <p>{APIResponse.highest_alphabet.join(', ')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="app">
        <h1>JSON Processor</h1>
        <form onSubmit={handleFormSubmit}>
          <textarea
            value={inputJSON}
            onChange={(e) => setInputJSON(e.target.value)}
            placeholder='Enter JSON here, e.g. {"data": ["A", "C", "z"]}'
          ></textarea>
          <br></br>
          <button className='process-btn' type="submit">Process</button>
        </form>
        {APIResponse && (
          <div>
            <Select
              isMulti
              name="filters"
              options={dropdownOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selected) => setFilters(selected.map(option => option.value))}
            />
            {displayResponse()}
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default MyApp;