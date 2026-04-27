import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga";
import PageLayout from "../Components/PageLayout";
import GlassCard from "../Components/GlassCard";
import FormField from "../Components/FormField";
import PrimaryButton from "../Components/PrimaryButton";

const Emergency = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [emergencyMonths, setEmergencyMonths] = useState<number>(0);

  const [emergencyPlan, setEmergencyPlan] = useState<number>(0);
  const [MothPlan, setMonthPlan] = useState<number>(0);
  const [isPlan, setIsPlan] = useState<boolean>(false);
  const [planMode, setPlanMode] = useState<"time" | "money">("time");

  const navigate = useNavigate();

  const handleTabChange = (mode: "time" | "money") => {
    ReactGA.event({
      category: "Emergency",
      action: "Toggle",
      value: Math.round(monthlyExpenses * emergencyMonths),
    });
    setPlanMode(mode);
  };

  const calculateEmergencyFund = (): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
      monthlyExpenses * emergencyMonths
    );

  const calculateEmergencyMonth = (plan: number): number =>
    Math.round(monthlyExpenses * emergencyMonths) / plan;

  const calculateEmergencyMoney = (months: number): string =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
      Math.round(monthlyExpenses * emergencyMonths) / months
    );

  const goHome = () => {
    setIsPlan(false);
    navigate("/");
  };

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
            🛡️
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            เงินสำรองฉุกเฉิน
          </h1>
          <p className="text-white/60 text-sm mt-1">
            คุณควรมีเงินสำรองเท่าไหร่?
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pb-12 flex flex-col gap-4">
        {/* Result Card */}
        <GlassCard className="text-center">
          <p className="text-white/70 text-sm mb-1">ยอดเงินสำรองที่ควรมี</p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {calculateEmergencyFund()}
          </p>
          <p className="text-white/60 text-sm mt-1">บาท</p>
        </GlassCard>

        {/* Form Card */}
        <GlassCard className="flex flex-col gap-4">
          {isPlan ? (
            <>
              {/* Tab switcher */}
              <div className="flex rounded-xl bg-white/10 p-1 gap-1">
                <button
                  onClick={() => handleTabChange("time")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    planMode === "time"
                      ? "bg-white text-green-900 shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  🗓️ เวลาที่ใช้เก็บ
                </button>
                <button
                  onClick={() => handleTabChange("money")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    planMode === "money"
                      ? "bg-white text-green-900 shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  💰 เงินที่ต้องเก็บ
                </button>
              </div>

              {planMode === "time" ? (
                <>
                  <FormField
                    label="ต้องการเก็บเดือนละ"
                    value={emergencyPlan}
                    onChange={setEmergencyPlan}
                    placeholder="0.00"
                    unit="บาท"
                  />
                  {emergencyPlan > 0 && (
                    <div className="bg-white/10 rounded-xl px-4 py-3 text-white/90 text-sm leading-relaxed">
                      คุณต้องใช้เวลาเก็บ{" "}
                      <span className="font-bold text-white">
                        {calculateEmergencyMonth(emergencyPlan).toFixed(1)}
                      </span>{" "}
                      เดือน
                      {Math.round(calculateEmergencyMonth(emergencyPlan) / 12) >
                        0 && (
                        <span>
                          {" "}
                          หรือ{" "}
                          <span className="font-bold text-white">
                            {Math.round(
                              calculateEmergencyMonth(emergencyPlan) / 12
                            )}
                          </span>{" "}
                          ปี
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <FormField
                    label="ต้องการใช้เวลาเก็บ"
                    value={MothPlan}
                    onChange={setMonthPlan}
                    placeholder="0"
                    unit="เดือน"
                  />
                  {MothPlan > 0 && (
                    <div className="bg-white/10 rounded-xl px-4 py-3 text-white/90 text-sm">
                      ต้องเก็บเงินเดือนละ{" "}
                      <span className="font-bold text-white">
                        {calculateEmergencyMoney(MothPlan)}
                      </span>{" "}
                      บาท
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <FormField
                label="ค่าใช้จ่ายต่อเดือน"
                value={monthlyExpenses}
                onChange={setMonthlyExpenses}
                placeholder="0.00"
                unit="บาท"
              />
              <FormField
                label="ต้องการสำรองฉุกเฉิน"
                value={emergencyMonths}
                onChange={setEmergencyMonths}
                placeholder="0"
                unit="เดือน"
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
              disabled={monthlyExpenses === 0 || emergencyMonths === 0}
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

export default Emergency;
