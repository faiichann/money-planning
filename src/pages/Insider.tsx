import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import foodWords from "../data/insider-food-words.json";
import objectsWords from "../data/insider-objects-words.json";
import placesWords from "../data/insider-places-words.json";
import occupationsWords from "../data/insider-occupations-words.json";

type GameState = "setup" | "role-reveal" | "playing" | "voting" | "result";
type Role = "host" | "insider" | "player";
type Category = "food" | "objects" | "places" | "occupations";

const BOARD_GROUP_NAMES = ["ฝ้าย", "ฟร้อง", "เอฟ", "เฟิร์น", "มาร์ค", "ตูน", "โอเปค", "เอิร์ท", "ซุง", "พีท", "จอย"];
const BOARD_GROUP_GIRLS_NAMES = ["ฝ้าย", "มาย", "มุก", "ออย", "แพร"];
const DEFAULT_PLAYER_NAMES = new Set(["A", "B", "C", ""]);

interface Player {
  id: number;
  name: string;
  role: Role;
}

interface Word {
  word: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const categoryData: Record<Category, Word[]> = {
  food: foodWords as Word[],
  objects: objectsWords as Word[],
  places: placesWords as Word[],
  occupations: occupationsWords as Word[],
};

const FlipCard = ({
  player,
  secretWord,
  onFlip,
}: {
  player: Player;
  secretWord: Word | null;
  onFlip: (id: number) => void;
}) => {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    if (next) onFlip(player.id);
  };
  const isHostOrInsider = player.role === "host" || player.role === "insider";
  
  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: 800, height: 140 }}
      onClick={toggle}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", position: "relative", height: "100%" }}
      >
        <div
          className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-1.5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-2xl">🎭</span>
          <p className="text-white font-semibold text-sm">{player.name}</p>
          <p className="text-white/35 text-xs">แตะเพื่อดู</p>
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-blue-500/40 bg-blue-950/70 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 px-3"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-white font-bold text-sm">
            {player.role === "host"
              ? "🏛️ Host"
              : player.role === "insider"
              ? "👤 Insider"
              : "👥 Player"}
          </p>
          {isHostOrInsider && secretWord ? (
            <p className="text-yellow-300 font-bold text-lg text-center">
              {secretWord.word}
            </p>
          ) : (
            <p className="text-white/50 text-xs text-center">เป็นคนปกติ</p>
          )}
          <p className="text-white/30 text-xs">แตะเพื่อปิด</p>
        </div>
      </motion.div>
    </div>
  );
};

const Insider = () => {
  const navigate = useNavigate();
  // Setup state
  const [playerNames, setPlayerNames] = useState<string[]>(["A", "B", "C", ""]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("food");
  const [gameDuration, setGameDuration] = useState<number | null>(5);
  const [durationMode, setDurationMode] = useState<"limited" | "unlimited">(
    "limited"
  );

  // Game state
  const [gameState, setGameState] = useState<GameState>("setup");
  const [secretWord, setSecretWord] = useState<Word | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roles, setRoles] = useState<Record<number, Role>>({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [votingStarted, setVotingStarted] = useState(false);
  const [winner, setWinner] = useState<"insider" | "others" | null>(null);
  const [hint, setHint] = useState("");
  const [hintUsed, setHintUsed] = useState(false);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && durationMode === "limited" && timeLeft > 0 && !votingStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && durationMode === "limited" && gameState === "playing" && !votingStarted) {
      startVoting();
    }
  }, [timeLeft, gameState, votingStarted, durationMode]);

  // Player management
  const addPlayer = () => setPlayerNames((p) => [...p, ""]);
  const addBoardGroupPlayers = () => {
    setPlayerNames((prev) => {
      const existing = new Set(
        prev
          .map((name) => name.trim())
          .filter((name) => name && !DEFAULT_PLAYER_NAMES.has(name)),
      );
      const toAdd = BOARD_GROUP_NAMES.filter((name) => !existing.has(name));
      return [...existing, ...toAdd];
    });
  };
  const addBoardGroupGirlsPlayers = () => {
    setPlayerNames((prev) => {
      const existing = new Set(
        prev
          .map((name) => name.trim())
          .filter((name) => name && !DEFAULT_PLAYER_NAMES.has(name)),
      );
      const toAdd = BOARD_GROUP_GIRLS_NAMES.filter((name) => !existing.has(name));
      return [...existing, ...toAdd];
    });
  };
  const removePlayer = (i: number) => setPlayerNames((p) => p.filter((_, idx) => idx !== i));
  const updateName = (i: number, val: string) => setPlayerNames((p) => p.map((n, idx) => (idx === i ? val : n)));
  const validNames = playerNames.filter((n) => n.trim());

  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  // Start game function
  const handleStartGame = () => {
    if (validNames.length < 3) {
      alert("ต้องมีผู้เล่นอย่างน้อย 3 คน");
      return;
    }

    const roles_list: Role[] = [
      "host",
      "insider",
      ...Array(Math.max(0, validNames.length - 2)).fill("player"),
    ];
    const shuffledRoles = shuffle(roles_list);
    const shuffledNames = shuffle(validNames);

    const newPlayers: Player[] = shuffledNames.map((name, i) => ({
      id: i,
      name,
      role: shuffledRoles[i],
    }));

    setPlayers(newPlayers);

    const newRoles: Record<number, Role> = {};
    newPlayers.forEach((p) => {
      newRoles[p.id] = p.role;
    });
    setRoles(newRoles);

    const words = categoryData[selectedCategory];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSecretWord(randomWord);

    const durationSeconds =
      durationMode === "limited" && gameDuration ? gameDuration * 60 : 600;
    setTimeLeft(durationSeconds);

    setGameState("role-reveal");
    setRevealed(new Set());
    setHintUsed(false);
    setVotes({});
  };

  const handleFlip = (id: number) => {
    setRevealed((s) => new Set([...s, id]));
  };
  const allRevealed = revealed.size === players.length;

  // Start voting
  const startVoting = () => {
    setVotingStarted(true);
    setGameState("voting");
  };

  // Handle vote
  const handleVote = (votedId: number) => {
    setVotes({ 0: votedId });
    
    const insiderId = players.find((p) => p.role === "insider")?.id;

    if (votedId === insiderId) {
      setWinner("others");
    } else {
      setWinner("insider");
    }

    setGameState("result");
  };

  // Reset game
  const resetGame = () => {
    setGameState("setup");
    setPlayerNames(["A", "B", "C", ""]);
    setRoles({});
    setVotes({});
    setVotingStarted(false);
    setRevealed(new Set());
    setWinner(null);
    setHint("");
    setHintUsed(false);
  };

  // Generate hint
  const generateHint = () => {
    if (!secretWord || hintUsed) return;
    const word = secretWord.word;
    const hintText =
      word.length > 5 ? word.substring(0, 3) + "*".repeat(word.length - 3) : "*".repeat(word.length);
    setHint(hintText);
    setHintUsed(true);
  };

  return (
    <div className="min-h-screen font-dm-sans flex flex-col transition-colors duration-500 bg-[#080d1a]">
      <header className="flex items-center px-4 pt-8 pb-4 max-w-2xl mx-auto w-full">
        <button onClick={() => gameState === "setup" ? navigate("/") : resetGame()} className="text-white/40 hover:text-white text-sm transition-colors text-left">
          {gameState === "setup" ? "👈 " : "👈"}
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-xl">🕵️</span>
          <span className="text-white font-bold tracking-wide">Insider</span>
        </div>
        <div className="w-8" />
      </header>

      <AnimatePresence mode="wait">
        {gameState === "setup" && (
          <motion.main key="setup" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm">&#x1F465; </p>
                  <button
                    onClick={addBoardGroupPlayers}
                    className="px-2.5 py-1 rounded-lg border border-blue-400/40 text-blue-300 text-xs font-medium hover:bg-blue-500/10 transition-colors"
                  >
                    เด็กนัดบอร์ด
                  </button>
                  <button
                    onClick={addBoardGroupGirlsPlayers}
                    className="px-2.5 py-1 rounded-lg border border-pink-400/40 text-pink-300 text-xs font-medium hover:bg-pink-500/10 transition-colors"
                  >
                    กูสวย
                  </button>
                </div>
                <button onClick={addPlayer} className="text-blue-400 text-sm hover:text-blue-300 transition-colors">+ </button>
              </div>
              <div className="flex flex-col gap-2">
                {playerNames.map((name, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <input type="text" placeholder={`ผู้เล่นคนที่ ${i + 1}`} value={name} onChange={(e) => updateName(i, e.target.value)}
                      className="flex-1 bg-white/10 border border-white/15 text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 transition-colors" />
                    {playerNames.length > 3 && (
                      <button onClick={() => removePlayer(i)} className="text-white/25 hover:text-red-400 text-xl transition-colors leading-none">×</button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-white/80 text-sm">หมวดคำศัพท์</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory("food")}
                    className={`py-2 px-1 rounded-xl text-sm font-semibold transition-colors ${
                      selectedCategory === "food"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    🍜 ของกิน
                  </button>
                  <button
                    onClick={() => setSelectedCategory("objects")}
                    className={`py-2 px-1 rounded-xl text-sm font-semibold transition-colors ${
                      selectedCategory === "objects"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    🔧 สิ่งของ
                  </button>
                  <button
                    onClick={() => setSelectedCategory("places")}
                    className={`py-2 px-1 rounded-xl text-sm font-semibold transition-colors ${
                      selectedCategory === "places"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    🏢 สถานที่
                  </button>
                  <button
                    onClick={() => setSelectedCategory("occupations")}
                    className={`py-2 px-1 rounded-xl text-sm font-semibold transition-colors ${
                      selectedCategory === "occupations"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    👔 อาชีพ
                  </button>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex flex-col gap-3">
                <span className="text-white/80 text-sm">เวลาเล่น</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDurationMode("limited")}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      durationMode === "limited"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    จำกัดเวลา
                  </button>
                  <button
                    onClick={() => setDurationMode("unlimited")}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      durationMode === "unlimited"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    ไม่จำกัด
                  </button>
                </div>
                {durationMode === "limited" && (
                  <input
                    type="number"
                    value={gameDuration || 5}
                    onChange={(e) => setGameDuration(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                    max="30"
                    className="w-full bg-white/10 border border-white/15 text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                )}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleStartGame} disabled={validNames.length < 3}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/30 text-white font-bold text-base transition-colors">
              แสดง Role
            </motion.button>
          </motion.main>
        )}

        {gameState === "role-reveal" && (
          <motion.main key="reveal" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-5">
            <div className="text-center">
              <p className="text-white font-semibold">เปิดบทบาท</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {players.map((p) => <FlipCard key={p.id} player={p} secretWord={secretWord} onFlip={handleFlip} />)}
            </div>
            <AnimatePresence>
              {allRevealed && (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.97 }} onClick={() => setGameState("playing")}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-colors">
                  &#x1F3AE;&nbsp;เริ่มเกม
                </motion.button>
              )}
            </AnimatePresence>
          </motion.main>
        )}

        {gameState === "playing" && (
          <motion.main key="playing" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-5">
            {durationMode === "limited" ? (
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-yellow-400 font-mono tracking-wider">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </div>
              </div>
            ) : (
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-yellow-400">
                  โหมดไม่จำกัดเวลา
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {players.map((p) => (
                <div key={p.id}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 flex flex-col items-center gap-1.5">
                  <span className="text-2xl">👤</span>
                  <p className="text-sm font-semibold text-center text-white">{p.name}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={generateHint}
                disabled={hintUsed}
                className={`flex-1 py-3 rounded-2xl font-semibold transition-colors ${
                  hintUsed
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
                }`}
              >
                💡 ใบ้ {hintUsed && `(${hint})`}
              </button>
              <button onClick={startVoting} className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
                🗳️ โหวต
              </button>
            </div>
          </motion.main>
        )}

        {gameState === "voting" && (
          <motion.main key="voting" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-5">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-white mb-2">🗳️ โหวตใครคือ Insider</h2>
              <p className="text-sm text-white/50">โหวตให้ Host ไม่ได้</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {players.map((p) => {
                const isHost = roles[p.id] === "host";
                if (isHost) return null;
                return (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(p.id)}
                    className="py-4 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold transition-colors"
                  >
                    {p.name}
                  </motion.button>
                );
              })}
            </div>
          </motion.main>
        )}

        {gameState === "result" && (
          <motion.main key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-4">
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
              className={`border rounded-2xl p-6 text-center ${
                winner === "insider" ? "bg-red-900/20 border-red-500/30" : "bg-blue-900/20 border-blue-500/30"
              }`}>
              <p className="text-5xl mb-3">&#x1F3C1;</p>
              <h2 className={`font-bold text-2xl mb-2 ${winner === "insider" ? "text-red-400" : "text-blue-400"}`}>
                {winner === "insider" ? "Insider Win" : "Citizen Win"}
              </h2>
              <p className={`${winner === "insider" ? "text-red-300" : "text-blue-300"} text-sm leading-relaxed`}>
                {winner === "insider" ? "🕵️ Insider ชนะ!" : "✨ ทุกคน (ยกเว้น Insider) ชนะ!"}
              </p>
            </motion.div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex flex-col mb-4 items-center">
                <p className="text-white/50 text-xs mb-1">คำตอบคือ</p>
                <p className="text-2xl font-bold text-yellow-300">{secretWord?.word}</p>
              </div>
              <div className="h-px bg-white/10 mb-4" />
              <div className="flex flex-col">
                {players.map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between py-3 ${i < players.length - 1 ? "border-b border-white/5" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${
                        p.role === "host" ? "text-blue-400" : p.role === "insider" ? "text-red-400" : "text-gray-400"
                      }`}>
                        {p.role === "host" ? "🏛️ Host" : p.role === "insider" ? "👤 Insider" : "👥 Player"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={resetGame}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-colors">
              &#x1F504;&nbsp; เล่นอีกครั้ง
            </motion.button>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Insider;
