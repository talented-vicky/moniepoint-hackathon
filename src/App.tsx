import { useEffect, useState } from 'react'
import './App.css'


function App() {
  const [dailySales, setDailySales] = useState<string[]>([]);
  const [highestSale, setHighestSale] =  useState<number | null>(null);
  const [productsSold, setProductsSold] =  useState<string[]>([])
  const [highestQty, setHighestQty] = useState<number | null>(null);

  useEffect(() => {
    const dataCalls = [
      fetchFileInfo()
    ];
    Promise.all(dataCalls).finally(() => {})
  }, [])

  const fetchFileInfo = async () => {
    try {
      const data = await fetch('/accounting-data/2025-01-01.txt');
      const textFile = await data.text();

      const line = textFile.split('\n');

      const total = line.map(items => {
        const lineItem = items.split(',')
        const salesStaffId =  lineItem[0];
        const transactionTime =  lineItem[1];


        const productSold =  lineItem[2];
        setProductsSold(currArr => [...currArr, productSold])


        const saleAmount =  lineItem[3];
        setDailySales(currArray => [...currArray, saleAmount]);
      })
      
      
    } catch (error) {
      console.log('error reading this file');
    }
  }
    
  const getTotalAmount = () => {
    const result = dailySales?.map(sale => parseFloat(sale)).filter(sale => !isNaN(sale))
    if(result.length > 0){
      const value = Math.max(...result)
      setHighestSale(value)
    }
  }

  const getSales = () => {
    const values = productsSold?.flatMap(items => items?.split('|').map(item => {
      const value = item.match(/\[(\d+):/);
      return value ? parseInt(value[1], 10) : NaN;
    }))
    const test = values.filter(value => !isNaN(value))
    const result = test.length > 0 ? Math.max(...test) : null;
    setHighestQty(result)
  }

  console.log('highest sold is -> ', productsSold)
  console.log('value for highest', highestQty)

  return (
    <>
      <span> Accounting system</span>
      <div>
        {dailySales.length !== 0 
          ? <div>
              <span> gotten sales data </span>
              {highestSale && (
                <p> Highest Sale is: {highestSale} </p>
              )}
              <button onClick={getTotalAmount}> view highest sales volume </button>
              {highestQty && (
                <p> Highest Sale is: {highestQty} </p>
              )}
              <div>
                <button onClick={getSales}> Check Highest Value </button>
              </div>
            </div>
          : <span>sales amount should come here</span>
        }
      </div>
    </>
  )
}

export default App
