import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Retirement = () => {
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(0);
  const [deathAge, setDeathAge] = useState<number>(0);
  const [retirementExpenses, setRetirementExpenses] = useState<number>(0);

  const [isPlan, setIsPlan] = useState<boolean>(false);

  const navigate = useNavigate();

  const calculateRetirementSavings = (
    currentAge: number,
    retirementAge: number,
    deathAge: number,
    retirementExpenses: number
  ): string => {
    const inflationRate = 0.03;
    const retirementYears = deathAge - retirementAge;
    const adjustedRetirementExpenses =
      retirementExpenses *
      retirementYears *
      12 *
      (1 + inflationRate) ** (retirementAge - currentAge);

    const formattedExpenses = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(adjustedRetirementExpenses);
    return formattedExpenses;
  };

  const [presentValue, setPresentValue] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [timePeriod, setTimePeriod] = useState<number>(0);
  const [futureValue, setFutureValue] = useState<string>("");
  const [isEnough, setIsEnough] = useState<boolean>(false);

  const calculateFutureValue = (PV: number, i: number, n: number): string => {
    const FV = PV * ((Math.pow(1 + i / 100, n) - 1) / (i / 100));
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(FV);
  };

  const handleCalculate = () => {
    const FV = calculateFutureValue(presentValue, interestRate, timePeriod);
    const inflationRate = 0.03;
    const retirementYears = deathAge - retirementAge;
    const futurePlan =
      presentValue *
      ((Math.pow(1 + interestRate / 100, timePeriod) - 1) /
        (interestRate / 100));
    const adjustedRetirementExpenses =
      retirementExpenses *
      retirementYears *
      12 *
      (1 + inflationRate) ** (retirementAge - currentAge);

    setIsEnough(
      Math.round(futurePlan) >= Math.round(adjustedRetirementExpenses)
    );
    setFutureValue(FV);
  };

  const goHome = () => {
    setIsPlan(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-[#83B698] font-dm-sans">
      {isPlan ? null : (
        <button
          className="text-3xl text-green-900 top-20 absolute"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
      )}
      <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">
        คุณควรมีเงินหลังเกษียณ
      </h1>

      <div className="p-8 shadow-lg text-center bg-white-30 rounded-30px mb-8 w-[400px]">
        <p className="text-3xl font-bold text-green-900 mb-5 text-center">
          {calculateRetirementSavings(
            currentAge,
            retirementAge,
            deathAge,
            retirementExpenses
          )}
          {"  "}
          บาท
        </p>
        <p className="text-white font-sans font-light text-sm mb-10 text-center">
          **คิดตามอัตราเงินเฟ้อ 3% ต่อปี
        </p>
        {isPlan ? (
          <>
            <p className="text-xl font-bold text-green-900 mb-5 text-center">
              คุณจะมีเงิน {futureValue ? futureValue : "0"} บาท
            </p>
            <p
              className={`text-xl font-bold ${
                isEnough ? "text-green-800" : "text-red-500"
              } mb-5 text-center`}
            >
              {isEnough ? "😍 พอ" : "🥺 ไม่พอ"} สำหรับเกษียณ
            </p>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                มีเวลาเก็บเงินก่อนเกษียณ
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg p-2 w-80 placeholder:text-gray-400 bg-white"
                  value={timePeriod === 0 ? "" : timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  ปี
                </span>
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                ต้องการลงทุนปีละ
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg p-2 w-80 placeholder:text-gray-400  bg-white"
                  value={presentValue === 0 ? "" : presentValue}
                  onChange={(e) => setPresentValue(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  บาท
                </span>
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                ลงทุนให้ได้กำไร
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg p-2 w-70 placeholder:text-gray-400  bg-white"
                  value={interestRate === 0 ? "" : interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  % ต่อปี
                </span>
              </div>
            </div>
            <button
              className="w-fit px-5 py-2 bg-green-900 text-white rounded-full shadow hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
              disabled={
                interestRate === 0 || timePeriod === 0 || presentValue === 0
              }
              onClick={handleCalculate}
            >
              คำนวณ
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                อายุปัจจุบัน
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg p-2 w-80 placeholder:text-gray-400 bg-white"
                  value={currentAge === 0 ? "" : currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  ปี
                </span>
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                อายุที่ต้องการเกษียณ
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg p-2 w-80 placeholder:text-gray-400  bg-white"
                  value={retirementAge === 0 ? "" : retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  ปี
                </span>
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                อายุที่คาดว่าอยู่ถึง
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0"
                  className="border border-gray-300 rounded-lg p-2 w-80 placeholder:text-gray-400  bg-white"
                  value={deathAge === 0 ? "" : deathAge}
                  onChange={(e) => setDeathAge(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  ปี
                </span>
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                เงินที่ต้องการใช้จ่ายหลังเกษียณต่อเดือน
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0.00"
                  className="border border-gray-300 rounded-lg p-2 w-80 placeholder:text-gray-400 bg-white"
                  value={retirementExpenses === 0 ? "" : retirementExpenses}
                  onChange={(e) =>
                    setRetirementExpenses(Number(e.target.value))
                  }
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  บาท
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {isPlan ? (
        <button
          className="w-fit px-5 py-2 bg-green-900 text-white rounded-full shadow hover:bg-green-700"
          onClick={goHome}
        >
          กลับหน้าแรก
        </button>
      ) : (
        <button
          className="w-fit px-3 py-2 bg-green-900 text-white rounded-full shadow hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
          disabled={
            currentAge === 0 ||
            retirementAge === 0 ||
            deathAge === 0 ||
            retirementExpenses === 0
          }
          onClick={() => setIsPlan(true)}
        >
          เริ่มวางแผน →
        </button>
      )}
    </div>
  );
};

export default Retirement;
