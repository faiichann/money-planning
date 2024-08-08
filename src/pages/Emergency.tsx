import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga";

const Emergency = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [emergencyMonths, setEmergencyMonths] = useState<number>(0);

  const [emergencyPlan, setEmergencyPlan] = useState<number>(0);
  const [MothPlan, setMonthPlan] = useState<number>(0);
  const [isPlan, setIsPlan] = useState<boolean>(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    ReactGA.event({
      category: "Emergency",
      action: "Toggle",
      value: Math.round(monthlyExpenses * emergencyMonths),
    });
    setIsChecked(!isChecked);
  };

  const navigate = useNavigate();

  const calculateEmergencyFund = (
    monthlyExpenses: number,
    emergencyMonths: number
  ): string => {
    const formattedExpenses = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(monthlyExpenses * emergencyMonths);

    return formattedExpenses;
  };

  const calculateEmergencyMonth = (emergencyPlan: number): number => {
    const monthlySaving =
      Math.round(monthlyExpenses * emergencyMonths) / emergencyPlan;

    return monthlySaving;
  };

  const calculateEmergencyMoney = (MothPlan: number): string => {
    const moneySaving = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Math.round(monthlyExpenses * emergencyMonths) / MothPlan);

    return moneySaving;
  };

  const goHome = () => {
    setIsPlan(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-[#83B698] font-dm-sans">
      {isPlan ? null : (
        <button
          className="text-3xl text-green-900 top-1 absolute"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
      )}
      <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">
        คุณควรมีเงินสำรองฉุกเฉิน
      </h1>

      <div className="p-8 shadow-lg text-center bg-white-30 rounded-30px mb-8 w-[350px]">
        <p className="text-3xl font-bold text-green-900 mb-10 text-center">
          {calculateEmergencyFund(monthlyExpenses, emergencyMonths)} บาท
        </p>

        {isPlan ? (
          <>
            <p className="text-xl font-bold text-green-900 mb-2 text-center">
              ต้องการวางแผน
            </p>

            <div className="flex justify-center items-center mb-5">
              <span
                className={`mr-2 ${
                  isChecked ? "text-green-900" : "text-white"
                }`}
              >
                เวลาที่ใช้เก็บ
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isChecked}
                  onChange={handleToggle}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 dark:bg-gray-700">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      isChecked ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
              <span
                className={`ml-2 ${
                  isChecked ? "text-white" : "text-green-900"
                }`}
              >
                เงินที่ต้องเก็บ
              </span>
            </div>

            {!isChecked ? (
              <div className="mt-3 flex flex-col">
                <label className="flex mb-2 text-green-900 justify-start">
                  ต้องการเก็บเดือนละ
                </label>
                <div className="flex flex-row">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="border border-gray-300  text-green-900 rounded-lg p-2 w-80 placeholder:text-gray-400  bg-white"
                    value={emergencyPlan === 0 ? "" : emergencyPlan}
                    onChange={(e) => setEmergencyPlan(Number(e.target.value))}
                  />
                  <span className="text-green-900 ml-3 flex flex-col justify-end">
                    บาท
                  </span>
                </div>
                <p className="text-xl font-medium text-green-900 mb-10 text-start mt-8">
                  🗓️ คุณต้องใช้เวลาเก็บ{" "}
                  {emergencyPlan === 0
                    ? "..."
                    : calculateEmergencyMonth(emergencyPlan)}{" "}
                  เดือน{" "}
                  {emergencyPlan === 0 ||
                    (Math.round(calculateEmergencyMonth(emergencyPlan) / 12) !==
                      0 &&
                      `หรือ ${Math.round(
                        calculateEmergencyMonth(emergencyPlan) / 12
                      )} ปี`)}
                </p>
              </div>
            ) : (
              <div className="mt-3 flex flex-col">
                <label className="flex mb-2 text-green-900 justify-start">
                  ต้องการใช้เวลาเก็บ
                </label>
                <div className="flex flex-row">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="border border-gray-300  text-green-900 rounded-lg p-2 w-80 placeholder:text-gray-400 bg-white"
                    value={MothPlan === 0 ? "" : MothPlan}
                    onChange={(e) => setMonthPlan(Number(e.target.value))}
                  />
                  <span className="text-green-900 ml-3 flex flex-col justify-end">
                    เดือน
                  </span>
                </div>
                <p className="text-xl font-medium text-green-900 mb-10 text-start mt-8">
                  💰 คุณต้องเก็บเงินเดือนละ{" "}
                  {MothPlan === 0 ? "..." : calculateEmergencyMoney(MothPlan)}{" "}
                  บาท
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                ค่าใช้จ่ายต่อเดือน
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0.00"
                  className="border border-gray-300  text-green-900 rounded-lg p-2 w-80 placeholder:text-gray-400 bg-white"
                  value={monthlyExpenses === 0 ? "" : monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  บาท
                </span>
              </div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="flex mb-2 text-green-900 justify-start">
                ต้องการสำรองฉุกเฉิน
              </label>
              <div className="flex flex-row">
                <input
                  type="number"
                  placeholder="0"
                  className="border border-gray-300  text-green-900 rounded-lg p-2 w-80 placeholder:text-gray-400  bg-white"
                  value={emergencyMonths === 0 ? "" : emergencyMonths}
                  onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                />
                <span className="text-green-900 ml-3 flex flex-col justify-end">
                  เดือน
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
          className="w-fit px-4 py-2 bg-green-900 text-white rounded-full shadow hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
          disabled={monthlyExpenses === 0 || emergencyMonths === 0}
          onClick={() => setIsPlan(true)}
        >
          เริ่มวางแผน →
        </button>
      )}
    </div>
  );
};

export default Emergency;
