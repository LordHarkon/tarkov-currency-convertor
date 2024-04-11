import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CloseIcon from "./components/CloseIcon";
import { Window } from "@tauri-apps/api/window";
import clsx from "clsx";
import IconImage from "./assets/tarkov.png";

function App() {
  const [usd, setUSD] = useState(0);
  const [eur, setEUR] = useState(0);
  const [rub, setRUB] = useState(0);
  const [valueUSD, setValueUSD] = useState(0);
  const [valueEUR, setValueEUR] = useState(0);

  const appWindow = new Window("main");

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const id = e.target.id;

    if (id === "currency-rub") {
      setRUB(parseFloat(value));
      setUSD(parseFloat((parseFloat(value) / valueUSD).toFixed(2)));
      setEUR(parseFloat((parseFloat(value) / valueEUR).toFixed(2)));
    } else if (id === "currency-usd") {
      setUSD(parseFloat(value));
      setRUB(parseFloat((parseFloat(value) * valueUSD).toFixed(2)));
      setEUR(parseFloat(((parseFloat(value) * valueUSD) / valueEUR).toFixed(2)));
    } else if (id === "currency-eur") {
      setEUR(parseFloat(value));
      setRUB(parseFloat((parseFloat(value) * valueEUR).toFixed(2)));
      setUSD(parseFloat(((parseFloat(value) * valueEUR) / valueUSD).toFixed(2)));
    }
  };

  const MONEY_VALUE_QUERY = gql`
    query {
      euros: items(name: "Euros") {
        id
        name
        normalizedName
        price: buyFor {
          value: priceRUB
        }
      }
      dollars: items(name: "Dollars") {
        id
        name
        normalizedName
        price: buyFor {
          value: priceRUB
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(MONEY_VALUE_QUERY);

  useEffect(() => {
    if (data && !error) {
      setValueUSD(data.dollars[0].price[0].value);
      setValueEUR(data.euros[0].price[0].value);
    }
  }, [data, loading, error, setValueUSD, setValueEUR]);

  return (
    <div className="bg-slate-900 w-full h-full flex flex-col items-center justify-center text-gray-200 border border-white/20">
      <div data-tauri-drag-region className="h-9 w-full flex justify-between">
        <div className="h-full flex items-center px-2 select-none pointer-events-none">
          <h3 className="text-base font-bold">Tarkov Currency Converter</h3>
        </div>
        <div className="h-full">
          <div
            className="inline-flex justify-center items-center w-8 h-8 m-0.5 select-none hover:bg-slate-800"
            id="titlebar-close"
            onClick={() => appWindow.close()}
          >
            <CloseIcon className="pointer-events-none" />
          </div>
        </div>
      </div>
      <div
        className={clsx("w-full h-[296px] bg-slate-900 p-2", {
          hidden: loading,
        })}
      >
        {/* <h3 className="text-xl font-bold text-center">Currency Converter</h3> */}
        <h5 className="text-2xl font-bold text-center">₽ – $ – €</h5>
        <div className="space-y-2">
          <div>
            <label htmlFor="currency-rub" className="font-bold">
              RUB (₽)
            </label>
            <input
              type="number"
              id="currency-rub"
              value={rub}
              onChange={handleCurrencyChange}
              step={0.01}
              className="bg-slate-600 w-full focus:outline-none py-1 px-2"
            />
          </div>
          <div>
            <label htmlFor="currency-usd" className="font-bold">
              USD ($)
            </label>
            <input
              type="number"
              id="currency-usd"
              value={usd}
              onChange={handleCurrencyChange}
              step={0.01}
              className="bg-slate-600 w-full focus:outline-none py-1 px-2"
            />
          </div>
          <div>
            <label htmlFor="currency-eur" className="font-bold">
              EUR (€)
            </label>
            <input
              type="number"
              id="currency-eur"
              value={eur}
              onChange={handleCurrencyChange}
              step={0.01}
              className="bg-slate-600 w-full focus:outline-none py-1 px-2"
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-col">
              <label htmlFor="currency-value-usd" className="font-bold">
                Value USD
              </label>
              <input
                type="number"
                id="currency-value-usd"
                value={valueUSD}
                onChange={(e) => setValueUSD(parseInt(e.target.value))}
                className="bg-slate-600 w-full focus:outline-none py-1 px-2"
              />
            </div>
            <div className="flex-col">
              <label htmlFor="currency-value-eur" className="font-bold">
                Value EUR
              </label>
              <input
                type="number"
                id="currency-value-eur"
                value={valueEUR}
                onChange={(e) => setValueEUR(parseInt(e.target.value))}
                className="bg-slate-600 w-full focus:outline-none py-1 px-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx("w-full h-[296px] bg-slate-900 p-2 flex flex-col items-center justify-center space-y-2", {
          hidden: !loading,
        })}
      >
        <img src={IconImage} alt="Loading Icon" className="w-32 h-32 animate-pulse select-none" />
        <h3 className="text-xl font-bold text-center animate-pulse select-none">Loading...</h3>
      </div>
    </div>
  );
}

export default App;
