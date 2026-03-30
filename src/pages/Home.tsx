import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#83B698] font-dm-sans flex-col">
      <div className="p-8 shadow-lg text-center bg-white-30 rounded-30px">
        <h1 className="text-2xl font-bold text-green-900 mb-4">
          What is your plan?
        </h1>
        <p className="text-green-900 mb-6">วางแผนการเงินเพื่อชีวิตที่ดีขึ้น</p>
        <div className="space-y-4">
          <button
            className="w-full h-[60px] py-2 bg-white text-green-900 rounded-lg shadow hover:bg-green-900 hover:text-white"
            onClick={() => navigate("/emergency")}
          >
            วางแผนเงินฉุกเฉิน
          </button>

          <button
            className="w-full h-[60px] py-2 bg-white text-green-900 rounded-lg shadow hover:bg-green-900 hover:text-white"
          >
            วางแผนอนาคต
          </button>

          <button
            className="w-full h-[60px] py-2 bg-white text-green-900 rounded-lg shadow hover:bg-green-900 hover:text-white"
            onClick={() => navigate("/retirement")}
          >
            วางแผนเงินเกษียณ
          </button>

          <button
            className="w-full h-[60px] py-2 bg-white text-green-900 rounded-lg shadow hover:bg-green-900 hover:text-white"
            onClick={() => navigate("/search")}
          >
            Search
          </button>
        </div>
      </div>

      <p className="text-white font-sans font-blod text-sm my-10 text-center">
        <a
          href="https://linktr.ee/faiichannn"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          develop by @faiichannn 🐶
        </a>
      </p>
    </div>
  );
};

export default Home;
