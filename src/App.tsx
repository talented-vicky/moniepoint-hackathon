import { useEffect, useState } from 'react'
import './App.css'

interface dataPair {
  id: number,
  value: number
}

function App() {
  const [dailySales, setDailySales] = useState<string[]>([]);
  const [highestSale, setHighestSale] =  useState<number | null>(null);
  const [productsSold, setProductsSold] =  useState<string[]>([])
  const [highestQty, setHighestQty] = useState<number | null>(null);

  const [highestQtyValue, setHighestQtyValue] = useState<number| null>(null);
  const [highestQtyID, setHighestQtyID] = useState<number[] | null>(null);

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

      line.map(items => {
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
      const matchPattern = item.match(/\[(\d+):/);
      return matchPattern ? parseInt(matchPattern[1], 10) : NaN;
    }))
    const test = values.filter(value => !isNaN(value))
    const result = test.length > 0 ? Math.max(...test) : null;
    setHighestQty(result)
  }

  const getMax = () => {
    // const filteredProductSold = productsSold?.filter(product => product !== null && product !== undefined)

    const idValuePairs: dataPair[] = [];

    productsSold?.forEach(items => {
      if(typeof(items) === 'string'){
        const item = items?.split('|');
        item.forEach(item => {
          const match = item.match(/\[(\d+):(\d+)\]/);
          if(match){
            const id = parseInt(match[1], 10);
            const value = parseInt(match[2], 10);
            idValuePairs.push({id, value})
          }
        })
      }
    })

    if(idValuePairs.length > 0){
      const maxValue = Math.max(...idValuePairs.map(item => item.value));
      setHighestQtyValue(maxValue);

      const IDs = idValuePairs.filter(item => item.value === maxValue).map(
        item => item.id
        )
      setHighestQtyID(IDs);
    }
  }

  // console.log('highest sold is -> ', productsSold)
  // console.log('value for highest', highestQty)

  return (
    <>
      <h1> Accounting system</h1>
      <div>
        {dailySales.length !== 0 
          ? <div style={{
            display: 'flex',
            height: '80vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
              <span style={{fontSize: '2rem'}}> -- Sales data Query -- </span>

              <div style={{display: 'flex'}}>
                <button onClick={getTotalAmount}> view highest sales volume </button>
                {highestSale && ( <p> Highest Sale is: {highestSale} </p> )}
              </div>
              
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div>
                  <button onClick={getSales}> Check Highest Value </button>
                </div>                
                {highestQty && (
                  <div >  Highest Sale is: {highestQty}  </div>
                )}
              </div>

              <div style={{backgroundColor: 'teal', padding: '2rem', borderRadius: '30%'}}>
                <div>
                  <button onClick={getMax}> Check Max Value </button>
                </div>
                {highestQtyValue && (
                  <div style={{
                    display: 'flex',
                    color: 'white',
                    justifyContent: 'space-between'
                  }}>
                    <p> Highest Qty is: {highestQtyValue} </p>
                    {highestQtyID?.map(item => (
                      <p> Product ID : {item} </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          : <span>No data provided yet</span>
        }
      </div>
    </>
  )
}

export default App
