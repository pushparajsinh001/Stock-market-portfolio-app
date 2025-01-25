import React, { useEffect, useState } from "react"; 
import { deleteShares, getHeldShares, postNewShareAdd } from "../services/PortfolioServices";
import PortfolioSharesList from "../components/portfolioComponents/PortfolioSharesList";
import ChartHoldingsByCompany from "../components/sharedComponents/ChartHoldingsByCompany";
import ColumnChartPortfolioPerformance from "../components/sharedComponents/ColumnChartPortfolioPerformance";
import './PortfolioContainer.css';

const PortfolioContainer = ({ apiData }) => {
  const [heldShares, setHeldShares] = useState([]); // Holds the shares data fetched from the backend
  const [sharesWithPrice, setSharesWithPrice] = useState([]); // Shares combined with current prices
  const [portfolioTotals, setPortfolioTotals] = useState({}); // Total portfolio values (paid & value)
  const [loading, setLoading] = useState(true); // Loading state for asynchronous fetching

  // Fetch held shares when component mounts
  useEffect(() => {
    let isMounted = true; // Track whether the component is still mounted

    getHeldShares()
      .then(response => {
        if (isMounted) {
          if (response && response.success && Array.isArray(response.data)) {
            setHeldShares(response.data); // Use the `data` property from the response
          } else {
            console.error("Invalid shares data:", response);
          }
          setLoading(false);
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error("Error fetching held shares:", error);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false; // Cleanup to avoid state updates on unmounted components
    };
  }, []);

  // Map current prices to shares once `heldShares` and `apiData` are available
  useEffect(() => {
    if (Array.isArray(heldShares) && apiData && apiData.length > 0) {
      const apiDataMap = apiData.reduce((acc, stock) => {
        acc[stock.symbol] = stock.price; // Store price by symbol
        return acc;
      }, {});

      const portfolioCurrentPrices = heldShares.map(company => ({
        ...company,
        currentPrice: apiDataMap[company.symbol] || 0 // Default to 0 if no price found
      }));

      setSharesWithPrice(portfolioCurrentPrices);
    }
  }, [heldShares, apiData]);

  // Calculate portfolio totals once `sharesWithPrice` updates
  useEffect(() => {
    if (Array.isArray(sharesWithPrice) && sharesWithPrice.length > 0) {
      const portfolioTotalPaid = sharesWithPrice
        .reduce((total, holding) => total + (holding.avgPurchasePrice * holding.numberOfShares), 0)
        .toFixed(2);

      const portfolioTotalValue = sharesWithPrice
        .reduce((total, holding) => total + (holding.currentPrice * holding.numberOfShares), 0)
        .toFixed(2);

      setPortfolioTotals({
        paid: parseFloat(portfolioTotalPaid), // Parse as numbers
        value: parseFloat(portfolioTotalValue),
      });
    } else {
      setPortfolioTotals({ paid: 0, value: 0 }); // Handle empty data gracefully
    }
  }, [sharesWithPrice]);

  // REMOVE ALL SHARES IN A PARTICULAR COMPANY
  const removeHeldSharesInCompany = id => {
    setHeldShares(prevShares => prevShares.filter(share => share._id !== id));
  };

  // REMOVE SOME SHARES IN A PARTICULAR COMPANY
  const removeSomeSharesInCompany = (id, updatedShareNumber) => {
    setHeldShares(prevShares => prevShares.map(share =>
      share._id === id ? { ...share, numberOfShares: updatedShareNumber } : share
    ));
  };

  // ADD A SHARE IN A STOCK WE DO NOT HAVE IN OUR PORTFOLIO
  const addNewShares = newShares => {
    postNewShareAdd(newShares)
      .then(savedNewShares => {
        setHeldShares(prevShares => [...prevShares, savedNewShares]);
      })
      .catch(error => {
        console.error("Error adding new shares:", error);
      });
  };

  // ADD MORE SHARES TO CURRENT HOLDING IN PARTICULAR STOCK
  const addSomeSharesInCompany = (id, numShares, avgPrice) => {
    setHeldShares(prevShares => prevShares.map(share =>
      share._id === id ? { ...share, numberOfShares: numShares, avgPurchasePrice: avgPrice } : share
    ));
  };

  return (
    <div className="portfoliocontainer">
      {loading ? (
        <div>Loading...</div> // Show loading text while data is fetching
      ) : (
        <>
          <PortfolioSharesList
            heldShares={sharesWithPrice}
            removeHeldSharesInCompany={removeHeldSharesInCompany}
            removeSomeSharesInCompany={removeSomeSharesInCompany}
            addSomeSharesInCompany={addSomeSharesInCompany}
          />
          <ChartHoldingsByCompany sharesData={sharesWithPrice} />
          <ColumnChartPortfolioPerformance
            portfolioData={sharesWithPrice.length ? sharesWithPrice : []} // Ensure data is not empty
            portfolioTotals={portfolioTotals}
          />
        </>
      )}
    </div>
  );
};

export default PortfolioContainer;
