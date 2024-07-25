import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoArrowDown } from "react-icons/io5";
import { useDebounce } from "../hooks/use-debounce";
import ethIcon from "../assets/eth64.png";
import lizIcon from "../assets/liz64.png";

type Props = {
  isConnected: boolean;
  ethBalance?: string;
  usdPrice?: string;
  ethPrice?: string;
  connect: () => void;
  submit: (input: string) => void;
  estimate: (input: string) => Promise<string | undefined>;
};

export const SwapForm: React.FC<Props> = (props) => {
  const {
    ethBalance,
    usdPrice,
    ethPrice,
    isConnected,
    connect,
    submit,
    estimate,
  } = props;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const onInputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }, []);

  const onSwap = useCallback(() => {
    if (input) {
      submit(input);
    }
  }, [input, submit]);

  const debounceValue = useDebounce(input);
  useEffect(() => {
    if (!debounceValue) {
      setOutput("");
    } else {
      estimate(debounceValue).then((value) => {
        if (value) {
          setOutput(value);
        }
      });
    }
  }, [debounceValue, estimate]);

  return (
    <main className="mt-6">
      <section className="flex flex-col gap-1 md:gap-2 mb-4 relative">
        <div className="bg-gray-100 p-4 rounded-lg flex flex-col gap-2">
          <p className="text-neutral-500">You pay</p>
          <div className="flex items-center justify-between">
            <input
              className="flex-1 text-2xl md:text-4xl leading-normal bg-transparent focus:border-none focus:outline-none flex items-center py-1 text-gray-600 max-w-40 md:max-w-60"
              value={input}
              onChange={onInputChanged}
              placeholder="0"
              inputMode="decimal"
              disabled={!isConnected}
            />
            <div className="flex items-center justify-between bg-white rounded-full p-1 min-w-[112px] md:min-w-[136px]">
              <img src={ethIcon} alt="ETH" className="w-6 md:w-8" />
              <span className="text-xl md:text-2xl mt-1">ETH</span>
              <IoIosArrowDown className="text-xl md:text-2xl" />
            </div>
          </div>
          <div className="mb-4 text-right text-neutral-500">{`Balance: ${ethBalance}`}</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg flex flex-col gap-2 min-h-[156px] md:min-h-[158px]">
          <p className="text-neutral-500">You receive</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl md:text-4xl">{output}</span>
            <div className="flex items-center justify-between bg-white rounded-full p-1 min-w-[112px] md:min-w-[136px]">
              <img src={lizIcon} alt="PLPE" className="w-6 md:w-8" />
              <span className="text-xl md:text-2xl mt-1">PLPE</span>
              <IoIosArrowDown className="text-xl md:text-2xl" />
            </div>
          </div>
        </div>
        <button className="bg-gray-100 border-4 md:border-8 border-white rounded-lg w-fit p-1 md:p-2 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <IoArrowDown size={30} />
        </button>
      </section>
      <button
        className="w-full bg-primary text-blue-900 rounded-lg py-4 text-xl font-semibold hover:opacity-80 transition-opacity"
        onClick={isConnected ? onSwap : connect}
        disabled={isConnected && (!input || Number(input) < 0)}
      >
        {isConnected ? "Swap" : "Connect"}
      </button>
      {usdPrice && ethPrice && (
        <p className="mt-2">{`1 PLPE = ${usdPrice} USD = ${ethPrice} ETH`}</p>
      )}
    </main>
  );
};
