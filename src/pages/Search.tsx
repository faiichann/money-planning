import HighlightText from "../Components/HighlightText";

const Search = () => {
  const highlight = "AA";

  const data = [
    {
      title: "Title Aa-ok",
      subtitle: "Subtitle 1 Search some thing special S-BOX ASP-AAAA",
    },
    {
      title: "Title Br-bee",
      subtitle: "Subtitle 2 Search some thing special Bbb",
    },
    { title: "Title C-lo", subtitle: "Subtitle 3 i am looking for something" },
    { title: "Title D-123", subtitle: "Subtitle 4 you can find it" },
    { title: "Title E-456", subtitle: "Subtitle 5 hi how are you" },
    { title: "Title F-789", subtitle: "Subtitle 6 do you have something" },
  ];

  return (
    <>
      <div className="py-4 px-8">
        <HighlightText
          text="Search some thing special S-BOX ASP-AAAA PA pssaapa"
          highlight="sp a"
        />
      </div>
      <div className="py-4 px-8">
        <HighlightText
          text="ฉันกินข้าวมันไก่ ไก่จิกเด็กตาย เด็กตาย ก่อนใคร กิน เกิด"
          highlight="ก"
        />
      </div>

      <hr className="border-gray-300 mx-8" />

      <div className="py-4 px-8">
        {data.map((item, index) => (
          <div key={index}>
            <p className="font-semibold text-black">
              <HighlightText text={item.title} highlight={highlight} />
            </p>
            <span>
              <HighlightText text={item.subtitle} highlight={highlight} />
            </span>
            <hr className="border-gray-400 w-1/4 py-2" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
