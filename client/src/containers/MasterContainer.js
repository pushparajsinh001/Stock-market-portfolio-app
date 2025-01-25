import React, { useState, useEffect } from 'react';
import { getCurrentStocks } from '../services/ApiServices';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./master.css"
import Header from "../components/sharedComponents/Header";
import NavBar from "../components/sharedComponents/NavBar";
import StockMarketContainer from './StockMarketContainer';
import PortfolioContainer from "./PortfolioContainer";
import { fetchedData } from '../components/stockMarketComponents/fetchedData';
import TopBar from '../components/sharedComponents/TopBar';

import SideBar from '../components/sharedComponents/SideBar';
import Footer from '../components/sharedComponents/Footer';

const MasterContainer = () => {
  const [apiData, setApiData] = useState(fetchedData);
  // const [apiData, setApiData] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState(null);


  // useEffect(() => {
  //   getCurrentStocks()
  //   .then(data => setApiData(data))
  // },[]);
  useEffect(() => {
    getCurrentStocks() // Call the API service
      .then(data => {
        if (data) {
          // Check if data exists
          setApiData(data); // Update state if valid data is returned
        } else {
          console.error("No data returned from API."); // Handle cases where API returns null/undefined
        }
      })
      .catch(error => {
        console.error("Error fetching stock data:", error); // Catch and log any errors in the fetch process
      });
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts
  


  const handleHistPrices = (histPricesObject) => {
    setHistoricalPrices(histPricesObject)
  };
  // console.log(historicalPrices)

  return (


    <>
      <Router>
        <TopBar />
        <div className="sidebar-content-container">
          <SideBar />
          <Routes>
            <Route
              exact
              path="/"
              element={apiData ? <PortfolioContainer apiData={apiData} /> : <div>Loading...</div>}
            />
            <Route
              path="/stockmarket"
              element={apiData ? (
                <StockMarketContainer stocks={apiData} handleHistPrices={handleHistPrices} />
              ) : <div>Loading...</div>}
            />
            {/* <Route exact path='/' element={<PortfolioContainer apiData={apiData} />} />
            <Route path='/stockmarket' element={<StockMarketContainer stocks={apiData} handleHistPrices={handleHistPrices} />} /> */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default MasterContainer;