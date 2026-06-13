import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import basicQuestions from "../data/basic-question-block.json";
import deeptalkFanQuestions from "../data/deeptalk-fan-questions.json";
import deeptalkFriendQuestions from "../data/deeptalk-friend-questions.json";
import likelyQuestions from "../data/likely-questions.json";
import likely18Questions from "../data/likely-18-questions.json";
import neverQuestions from "../data/never-questions.json";
import neverGreenQuestions from "../data/never-green-questions.json";

type Topic = {
  id: string;
  title: string;
  description: string;
  badge: string;
  questions: string[];
};

type CardItem = {
  id: string;
  text: string;
};

const TOPICS: Topic[] = [
  {
    id: "basic",
    title: "basic",
    description: "ชวนคุยเบาๆ ทำความรู้จักกันก่อน ปั่นฮาได้",
    badge: "ชิล",
    questions: basicQuestions as string[],
  },
  {
    id: "deeptalk-fan",
    title: "Deeptalk (แฟน)",
    description: "คำถามลึกขึ้นสำหรับคู่รัก เน้นความรู้สึกและอนาคต",
    badge: "ลึก",
    questions: deeptalkFanQuestions as string[],
  },
  {
    id: "deeptalk-friend",
    title: "Deeptalk (เฟรน)",
    description: "คำถามเพื่อนสนิท ทั้งฮาและจริงใจ",
    badge: "เพื่อน",
    questions: deeptalkFriendQuestions as string[],
  },
  {
    id: "likely",
    title: "ใครน่าจะ",
    description: "โหวตขำๆ ในวงเพื่อน เน้นความสนุกไม่แรงมาก",
    badge: "ปั่น",
    questions: likelyQuestions as string[],
  },
  {
    id: "likely-18",
    title: "ใครน่าจะ (18+)",
    description: "โหมดผู้ใหญ่ คำถามแรงขึ้นสำหรับวงที่โอเคเท่านั้น",
    badge: "18+",
    questions: likely18Questions as string[],
  },
  {
    id: "never",
    title: "ฉันไม่เคย",
    description: "ปาร์ตี้สายฮา วัยเด็ก เพื่อน และความโก๊ะ",
    badge: "คลาสสิก",
    questions: neverQuestions as string[],
  },
  {
    id: "never-green",
    title: "ฉันไม่เคย (วงเขียว only)",
    description: "โหมดผู้ใหญ่สำหรับวงปิดที่ยินยอมร่วมกัน",
    badge: "ผู้ใหญ่",
    questions: neverGreenQuestions as string[],
  },
];
const CARD_STACK_VARIANTS = {
  enter: { opacity: 0, scale: 0.92, y: 18 },
  center: { opacity: 1, scale: 1, y: 0 },
  exit: (x: number) => ({
    opacity: 0,
    x,
    rotate: x > 0 ? 10 : -10,
    scale: 0.96,
  }),
};

const AnswerMe = () => {
  const navigate = useNavigate();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [deck, setDeck] = useState<CardItem[]>([]);
  const [currentCard, setCurrentCard] = useState<CardItem | null>(null);
  const [exitX, setExitX] = useState(0);

  const selectedTopic = useMemo(
    () => TOPICS.find((topic) => topic.id === selectedTopicId) ?? null,
    [selectedTopicId],
  );

  const buildDeck = (topic: Topic): CardItem[] =>
    topic.questions.map((q, index) => ({ id: `${topic.id}-${index}`, text: q }));

  const chooseTopic = (topic: Topic) => {
    const newDeck = buildDeck(topic);
    setSelectedTopicId(topic.id);
    setDeck(newDeck);
    setCurrentCard(null);
  };

  const pickRandom = () => {
    if (deck.length === 0) {
      setCurrentCard(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * deck.length);
    setCurrentCard(deck[randomIndex]);
  };

  const swipeRightDiscard = () => {
    if (!currentCard) return;
    setExitX(320);
    setDeck((prev) => prev.filter((item) => item.id !== currentCard.id));
    setCurrentCard(null);
  };

  const swipeLeftKeep = () => {
    if (!currentCard) return;
    setExitX(-320);
    setCurrentCard(null);
  };

  const randomReset = () => {
    if (!selectedTopic) return;
    const resetDeck = buildDeck(selectedTopic);
    setDeck(resetDeck);
    setCurrentCard(null);
  };

  const backToTopics = () => {
    setSelectedTopicId(null);
    setDeck([]);
    setCurrentCard(null);
  };

  return (
    <div className="min-h-screen bg-[#120612] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-24 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-rose-500/15 blur-3xl" />
      </div>

      <header className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => (selectedTopic ? backToTopics() : navigate("/"))}
          className="text-pink-200/80 hover:text-pink-100 transition-colors text-sm"
        >
          {selectedTopic ? "← กลับไปเลือกหัวข้อ" : "← กลับหน้าแรก"}
        </button>
        <div className="w-20" />
      </header>

      {!selectedTopic ? (
        <main className="relative z-10 max-w-5xl mx-auto px-4 pb-10">
          <div className="mb-5 text-center">
            <p className="text-pink-100 text-3xl font-black">Answer Me!</p>
            <p className="text-pink-200/80 mt-1 text-sm">คำถามปาร์ตี้สุดปั่นชวนคุย อย่าเงียบ!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOPICS.map((topic, idx) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.25 }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => chooseTopic(topic)}
                className="text-left p-5 rounded-2xl border border-pink-300/20 bg-black/35 backdrop-blur-md hover:border-pink-300/50 hover:bg-black/45 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-pink-100">{topic.title}</h2>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/20 border border-pink-300/30 text-pink-100">
                    {topic.badge}
                  </span>
                </div>
                <p className="text-pink-200/75 text-sm mt-2">{topic.description}</p>
                <p className="text-pink-200/50 text-xs mt-3">{topic.questions.length} cards</p>
              </motion.button>
            ))}
          </div>
        </main>
      ) : (
        <main className="relative z-10 max-w-3xl mx-auto px-4 pb-10 flex flex-col gap-5">
          <div className="rounded-2xl border border-pink-300/25 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-pink-100 font-bold text-lg">{selectedTopic.title}</p>
              <p className="text-pink-200/70 text-sm">เหลือในกอง {deck.length} ใบ</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={pickRandom}
                disabled={deck.length === 0}
                className="px-4 py-2 rounded-xl font-semibold text-sm bg-pink-500 hover:bg-pink-400 disabled:bg-white/10 disabled:text-white/40 transition-colors"
              >
                สุ่มการ์ด
              </button>
              <button
                onClick={randomReset}
                className="px-4 py-2 rounded-xl font-semibold text-sm border border-pink-300/40 text-pink-100 hover:bg-pink-500/15 transition-colors"
              >
                Random Reset
              </button>
            </div>
          </div>

          <div className="relative min-h-[360px] rounded-3xl border border-pink-300/20 bg-black/35 backdrop-blur-md overflow-hidden p-4">
            <AnimatePresence custom={exitX} mode="wait">
              {currentCard ? (
                <motion.div
                  key={currentCard.id}
                  custom={exitX}
                  variants={CARD_STACK_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.35}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 110) {
                      swipeRightDiscard();
                      return;
                    }
                    if (info.offset.x < -110) {
                      swipeLeftKeep();
                    }
                  }}
                  className="h-[320px] rounded-2xl border border-pink-200/25 bg-gradient-to-b from-[#2a0d24] to-[#170817] p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center justify-between text-xs text-pink-200/70">
                    <span>ลากซ้าย = เก็บไว้สุ่มต่อ</span>
                    <span>ลากขวา = เอาออกจากกอง</span>
                  </div>
                  <p className="text-xl sm:text-2xl leading-relaxed font-semibold text-pink-50 text-center">
                    {currentCard.text}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={swipeLeftKeep}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-fuchsia-500/20 border border-fuchsia-300/40 text-fuchsia-100 hover:bg-fuchsia-500/30 transition-colors"
                    >
                      ปัดซ้าย (เก็บ)
                    </button>
                    <button
                      onClick={swipeRightDiscard}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-pink-500/25 border border-pink-300/45 text-pink-100 hover:bg-pink-500/35 transition-colors"
                    >
                      ปัดขวา (ทิ้ง)
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="h-full min-h-[320px] flex flex-col items-center justify-center text-center px-6"
                >
                  <p className="text-6xl mb-2">🎴</p>
                  <p className="text-pink-100 text-lg font-bold mb-1">ยังไม่มีการ์ดบนโต๊ะ</p>
                  <p className="text-pink-200/70 text-sm">กดปุ่ม "สุ่มการ์ด" เพื่อเริ่มเล่น</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      )}
    </div>
  );
};

export default AnswerMe;
