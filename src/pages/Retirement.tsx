import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../Components/PageLayout";
import GlassCard from "../Components/GlassCard";
import FormField from "../Components/FormField";
import PrimaryButton from "../Components/PrimaryButton";

const Retirement = () => {
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(0);
  const [deathAge, setDeathAge] = useState<number>(0);
  const [retirementExpenses, setRetirementExpenses] = useState<number>(0);

  const [isPlan, setIsPlan] = useState<boolean>(false);

  const navigate = useNavigate();

  const inflationRate = 0.03;

  const getAdjustedExpenses = (): number => {
    const retirementYears = deathAge - retirementAge;
    return (
      retirementExpenses *
      retirementYears *
      12 *
      (1 + inflationRate) ** (retirementAge - currentAge)
    );
  };

  const formatNumber = (n: number): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

  const calculateRetirementSavings = (): string =>
    formatNumber(getAdjustedExpenses());

  const [presentValue, setPresentValue] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [timePeriod, setTimePeriod] = useState<number>(0);
  const [futureValue, setFutureValue] = useState<string>("");
  const [isEnough, setIsEnough] = useState<boolean>(false);

  const handleCalculate = () => {
    const FV =
      presentValue *
      ((Math.pow(1 + interestRate / 100, timePeriod) - 1) /
        (interestRate / 100));
    setIsEnough(Math.round(FV) >= Math.round(getAdjustedExpenses()));
    setFutureValue(formatNumber(FV));
  };

  const goHome = () => {
    setIsPlan(false);
    navigate("/");
  };

  const canCalculate = interestRate > 0 && timePeriod > 0 && presentValue > 0;

  return (
    <PageLayout>
      {/* Header */}
      <header className="pt-10 pb-6 px-4 relative">
        {!isPlan && (
          <button
            className="absolute left-4 top-10 text-white/70 hover:text-white text-2xl transition-colors"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
        )}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-3 text-2xl">
            🌅
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            วางแผนเกษียณ
          </h1>
          <p className="text-white/60 text-sm mt-1">
            คุณควรมีเงินเกษียณเท่าไหร่?
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pb-12 flex flex-col gap-4">
        {/* Result Card */}
        <GlassCard className="text-center">
          <p className="text-white/70 text-sm mb-1">ยอดเงินที่ควรมีหลังเกษียณ</p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {calculateRetirementSavings()}
          </p>
          <p className="text-white/60 text-sm mt-1">บาท</p>
          <p className="text-white/40 text-xs mt-2">
            *คิดตามอัตราเงินเฟ้อ 3% ต่อปี
          </p>
        </GlassCard>

        {/* Plan Result (shown after calculate) */}
        {isPlan && futureValue && (
          <GlassCard
            className={`text-center border ${
              isEnough ? "border-green-400/40" : "border-red-400/40"
            }`}
          >
            <p className="text-white/70 text-sm mb-1">คุณจะมีเงิน</p>
            <p className="text-3xl font-bold text-white">{futureValue}</p>
            <p className="text-white/60 text-sm mb-3">บาท</p>
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                isEnough
                  ? "bg-green-400/20 text-green-200"
                  : "bg-red-400/20 text-red-300"
              }`}
            >
              {isEnough ? "😍 พอสำหรับเกษียณ" : "🥺 ไม่พอสำหรับเกษียณ"}
            </div>
          </GlassCard>
        )}

        {/* Form Card */}
        <GlassCard className="flex flex-col gap-4">
          {isPlan ? (
            <>
              <p className="text-white/80 text-sm font-medium">
                ข้อมูลการลงทุน
              </p>
              <FormField
                label="มีเวลาเก็บเงินก่อนเกษียณ"
                value={timePeriod}
                onChange={setTimePeriod}
                unit="ปี"
              />
              <FormField
                label="ต้องการลงทุนปีละ"
                value={presentValue}
                onChange={setPresentValue}
                placeholder="0.00"
                unit="บาท"
              />
              <FormField
                label="ลงทุนให้ได้กำไร"
                value={interestRate}
                onChange={setInterestRate}
                unit="% / ปี"
              />
              <div className="flex justify-center pt-1">
                <PrimaryButton
                  disabled={!canCalculate}
                  onClick={handleCalculate}
                >
                  คำนวณ
                </PrimaryButton>
              </div>
            </>
          ) : (
            <>
              <p className="text-white/80 text-sm font-medium">ข้อมูลของคุณ</p>
              <FormField
                label="อายุปัจจุบัน"
                value={currentAge}
                onChange={setCurrentAge}
                unit="ปี"
              />
              <FormField
                label="อายุที่ต้องการเกษียณ"
                value={retirementAge}
                onChange={setRetirementAge}
                unit="ปี"
              />
              <FormField
                label="อายุที่คาดว่าอยู่ถึง"
                value={deathAge}
                onChange={setDeathAge}
                unit="ปี"
              />
              <FormField
                label="ค่าใช้จ่ายหลังเกษียณต่อเดือน"
                value={retirementExpenses}
                onChange={setRetirementExpenses}
                placeholder="0.00"
                unit="บาท"
              />
            </>
          )}
        </GlassCard>

        {/* Action */}
        <div className="flex justify-center pt-2">
          {isPlan ? (
            <PrimaryButton onClick={goHome}>← กลับหน้าแรก</PrimaryButton>
          ) : (
            <PrimaryButton
              disabled={
                currentAge === 0 ||
                retirementAge === 0 ||
                deathAge === 0 ||
                retirementExpenses === 0
              }
              onClick={() => setIsPlan(true)}
            >
              เริ่มวางแผน →
            </PrimaryButton>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default Retirement;

