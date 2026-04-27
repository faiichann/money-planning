import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type Role = "Citizen" | "Undercover" | "Mr. White";

interface Player {
  id: number;
  name: string;
  role: Role;
  word: string;
  eliminated: boolean;
}

interface HistoryEntry {
  round: number;
  name: string;
  role: Role;
}

type Screen = "setup" | "reveal" | "game" | "gameover";

const WORD_PAIRS: [string, string][] = [
  ["\u0e1f\u0e38\u0e15\u0e1a\u0e2d\u0e25", "\u0e23\u0e31\u0e01\u0e1a\u0e35\u0e49"],
  ["\u0e41\u0e21\u0e27", "\u0e40\u0e2a\u0e37\u0e2d"],
  ["\u0e1e\u0e34\u0e0b\u0e0b\u0e48\u0e32", "\u0e1e\u0e32\u0e22"],
  ["\u0e17\u0e30\u0e40\u0e25", "\u0e17\u0e30\u0e40\u0e25\u0e2a\u0e32\u0e1a"],
  ["\u0e23\u0e16\u0e22\u0e19\u0e15\u0e4c", "\u0e23\u0e16\u0e21\u0e2d\u0e40\u0e15\u0e2d\u0e23\u0e4c\u0e44\u0e0b\u0e04\u0e4c"],
  ["\u0e14\u0e32\u0e1a", "\u0e21\u0e35\u0e14"],
  ["\u0e01\u0e32\u0e41\u0e1f", "\u0e0a\u0e32"],
  ["\u0e0a\u0e49\u0e32\u0e07", "\u0e41\u0e23\u0e14"],
  ["\u0e41\u0e2d\u0e1b\u0e40\u0e1b\u0e34\u0e49\u0e25", "\u0e25\u0e39\u0e01\u0e41\u0e1e\u0e23\u0e4c"],
  ["\u0e23\u0e32\u0e40\u0e21\u0e19", "\u0e1a\u0e30\u0e2b\u0e21\u0e35\u0e48"],
  ["\u0e1d\u0e19", "\u0e2b\u0e34\u0e21\u0e30"],
  ["\u0e2a\u0e34\u0e07\u0e42\u0e15", "\u0e40\u0e2a\u0e37\u0e2d\u0e42\u0e04\u0e23\u0e48\u0e07"],
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const ROLE_LABEL: Record<Role, string> = {
  Citizen: "\u{1F464} \u0e1e\u0e25\u0e40\u0e21\u0e37\u0e2d\u0e07",
  Undercover: "\u{1F575}\uFE0F Undercover",
  "Mr. White": "\u2B1C Mr. White",
};

const ROLE_COLOR: Record<Role, string> = {
  Citizen: "text-blue-400",
  Undercover: "text-red-400",
  "Mr. White": "text-gray-300",
};

const WINNER_LABEL: Record<Role, string> = {
  Citizen: "พลเมือง",
  Undercover: "Undercover",
  "Mr. White": "Mr.white",
};

const BOARD_GROUP_NAMES = ["ฝ้าย", "ฟร้อง", "เอฟ", "เฟิร์น", "มาร์ค", "ตูน", "โอเปค", "เอิร์ท", "ซุง", "พีท", "จอย"];
const DEFAULT_PLAYER_NAMES = new Set(["A", "B", "C", ""]);

const FlipCard = ({
  player,
  onFlip,
}: {
  player: Player;
  onFlip: (id: number) => void;
}) => {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    if (next) onFlip(player.id);
  };
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
          <span className="text-2xl">&#x1F0CF;</span>
          <p className="text-white font-semibold text-sm">{player.name}</p>
          <p className="text-white/35 text-xs">&#x0E41;&#x0E15;&#x0E30;&#x0E40;&#x0E1E;&#x0E37;&#x0E48;&#x0E2D;&#x0E14;&#x0E39;</p>
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-blue-500/40 bg-blue-950/70 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 px-3"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className={`font-bold text-sm ${ROLE_COLOR[player.role]}`}>{ROLE_LABEL[player.role]}</p>
          {player.role !== "Mr. White" ? (
            <p className="text-white text-lg font-bold">{player.word}</p>
          ) : (
            <p className="text-white/50 text-xs text-center">&#x0E40;&#x0E14;&#x0E32;&#x0E04;&#x0E33;&#x0E08;&#x0E32;&#x0E01;&#x0E1A;&#x0E23;&#x0E34;&#x0E1A;&#x0E17;</p>
          )}
          <p className="text-white/30 text-xs">&#x0E41;&#x0E15;&#x0E30;&#x0E40;&#x0E1E;&#x0E37;&#x0E48;&#x0E2D;&#x0E1B;&#x0E34;&#x0E14;</p>
        </div>
      </motion.div>
    </div>
  );
};

const UnderCover = () => {
  const navigate = useNavigate();
  const [playerNames, setPlayerNames] = useState<string[]>(["A", "B", "C", ""]);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [mrWhiteCount, setMrWhiteCount] = useState(0);
  const [screen, setScreen] = useState<Screen>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [round, setRound] = useState(1);
  const [flashRed, setFlashRed] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const [selectedVote, setSelectedVote] = useState<number | null>(null);
  const [confirmResult, setConfirmResult] = useState<Player | null>(null);
  const [gameOverMsg, setGameOverMsg] = useState("");
  const [winnerRole, setWinnerRole] = useState<Role | null>(null);
  const [mrWhiteGuess, setMrWhiteGuess] = useState("");
  const [citizenWordFinal, setCitizenWordFinal] = useState("");
  const [undercoverWordFinal, setUndercoverWordFinal] = useState("");

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
  const removePlayer = (i: number) => setPlayerNames((p) => p.filter((_, idx) => idx !== i));
  const updateName = (i: number, val: string) => setPlayerNames((p) => p.map((n, idx) => (idx === i ? val : n)));
  const validNames = playerNames.filter((n) => n.trim());
  const citizenCount = validNames.length - undercoverCount - mrWhiteCount;
  const canStart = validNames.length >= 3 && citizenCount >= 1 && undercoverCount >= 1 && undercoverCount + mrWhiteCount < validNames.length;

  const handleStartSetup = () => {
    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    const [citizenWord, undercoverWord] = pair;
    const roles: Role[] = [
      ...Array<Role>(undercoverCount).fill("Undercover"),
      ...Array<Role>(mrWhiteCount).fill("Mr. White"),
      ...Array<Role>(Math.max(0, citizenCount)).fill("Citizen"),
    ];
    const shuffledRoles = shuffle(roles);
    const names = shuffle(validNames);
    const assigned: Player[] = names.map((name, i) => ({
      id: i, name,
      role: shuffledRoles[i],
      word: shuffledRoles[i] === "Citizen" ? citizenWord : shuffledRoles[i] === "Undercover" ? undercoverWord : "",
      eliminated: false,
    }));
    setCitizenWordFinal(citizenWord);
    setUndercoverWordFinal(undercoverWord);
    setPlayers(assigned);
    setRevealedIds(new Set());
    setHistory([]);
    setRound(1);
    setScreen("reveal");
  };

  const handleFlip = (id: number) => setRevealedIds((s) => new Set([...s, id]));
  const allRevealed = revealedIds.size === players.length;
  const alivePlayers = players.filter((p) => !p.eliminated);

  const confirmVote = () => {
    if (selectedVote === null) return;
    const target = players.find((p) => p.id === selectedVote)!;
    setConfirmResult(target);
    setMrWhiteGuess("");
    setVoteOpen(false);
    setSelectedVote(null);
  };

  const normalizeWord = (word: string) => word.trim().toLowerCase();

  const getEnemyWinnerRole = (remaining: Player[]): Role => {
    if (remaining.some((p) => p.role === "Undercover")) return "Undercover";
    return "Mr. White";
  };

  const applyElimination = () => {
    if (!confirmResult) return;

    if (confirmResult.role === "Mr. White" && normalizeWord(mrWhiteGuess) === normalizeWord(citizenWordFinal)) {
      setHistory((h) => [...h, { round, name: confirmResult.name, role: confirmResult.role }]);
      setWinnerRole("Mr. White");
      setGameOverMsg(WINNER_LABEL["Mr. White"]);
      setConfirmResult(null);
      setMrWhiteGuess("");
      setScreen("gameover");
      return;
    }

    const updated = players.map((p) => p.id === confirmResult.id ? { ...p, eliminated: true } : p);
    setPlayers(updated);
    setHistory((h) => [...h, { round, name: confirmResult.name, role: confirmResult.role }]);
    setRound((r) => r + 1);
    if (confirmResult.role === "Citizen") { setFlashRed(true); setTimeout(() => setFlashRed(false), 900); }
    const remaining = updated.filter((p) => !p.eliminated);
    const hasEnemy = remaining.some((p) => p.role === "Undercover" || p.role === "Mr. White");
    if (!hasEnemy) {
      setWinnerRole("Citizen");
      setGameOverMsg(WINNER_LABEL.Citizen);
      setConfirmResult(null);
      setMrWhiteGuess("");
      setScreen("gameover");
      return;
    }
    if (remaining.length <= 2) {
      const enemyWinner = getEnemyWinnerRole(remaining);
      setWinnerRole(enemyWinner);
      setGameOverMsg(WINNER_LABEL[enemyWinner]);
      setConfirmResult(null);
      setMrWhiteGuess("");
      setScreen("gameover");
      return;
    }
    setConfirmResult(null);
    setMrWhiteGuess("");
  };

  const resetGame = () => {
    setScreen("setup");
    setPlayers([]);
    setHistory([]);
    setRound(1);
    setGameOverMsg("");
    setWinnerRole(null);
    setMrWhiteGuess("");
  };

  return (
    <div className={`min-h-screen font-dm-sans flex flex-col transition-colors duration-500 ${flashRed ? "bg-red-950" : "bg-[#080d1a]"}`}>
      <header className="flex items-center px-4 pt-8 pb-4 max-w-2xl mx-auto w-full">
        <button onClick={() => screen === "setup" ? navigate("/") : resetGame()} className="text-white/40 hover:text-white text-sm transition-colors text-left">
          {screen === "setup" ? "👈 " : "👈"}
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-xl">&#x1F575;&#xFE0F;</span>
          <span className="text-white font-bold tracking-wide">Undercover</span>
        </div>
        <div className="w-8" />
      </header>

      <AnimatePresence mode="wait">
        {screen === "setup" && (
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
                </div>
                <button onClick={addPlayer} className="text-blue-400 text-sm hover:text-blue-300 transition-colors">+ </button>
              </div>
              <div className="flex flex-col gap-2">
                {playerNames.map((name, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <input type="text" placeholder={` ${i + 1}`} value={name} onChange={(e) => updateName(i, e.target.value)}
                      className="flex-1 bg-white/10 border border-white/15 text-white rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 transition-colors" />
                    {playerNames.length > 3 && (
                      <button onClick={() => removePlayer(i)} className="text-white/25 hover:text-red-400 text-xl transition-colors leading-none">×</button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
              <p className="text-white font-semibold text-sm">💀 🎭</p>
              {[
                { label: "Undercover", value: undercoverCount, setter: setUndercoverCount, min: 1 },
                { label: "Mr. White", value: mrWhiteCount, setter: setMrWhiteCount, min: 0 },
              ].map(({ label, value, setter, min }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">{label}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setter((v) => Math.max(min, v - 1))} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-bold">−</button>
                    <span className="text-white font-bold w-4 text-center text-sm">{value}</span>
                    <button onClick={() => setter((v) => v + 1)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-bold">+</button>
                  </div>
                </div>
              ))}
              <div className="h-px bg-white/10" />
              <div className="flex justify-between text-xs text-white/40">
                <span>&#x1F464; &nbsp; พลเมือง: {Math.max(0, citizenCount)}</span>
                <span>ผู้เล่น: {validNames.length}</span>
              </div>
              {!canStart && validNames.length > 0 && <p className="text-red-400 text-xs"> Role เกินรึเปล่า </p>}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleStartSetup} disabled={!canStart}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/30 text-white font-bold text-base transition-colors">
               แสดง Role
            </motion.button>
          </motion.main>
        )}

        {screen === "reveal" && (
          <motion.main key="reveal" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-5">
            <div className="text-center">
              <p className="text-white font-semibold"> </p>
              <p className="text-white/40 text-xs mt-1"> </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {players.map((p) => <FlipCard key={p.id} player={p} onFlip={handleFlip} />)}
            </div>
            <AnimatePresence>
              {allRevealed && (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.97 }} onClick={() => setScreen("game")}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-colors">
                  &#x1F3AE;&nbsp;เริ่มเกม
                </motion.button>
              )}
            </AnimatePresence>
          </motion.main>
        )}

        {screen === "game" && (
          <motion.main key="game" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm"> ผู้รอดชีวิต: {alivePlayers.length} คน</span>
              <span className="bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs px-3 py-1 rounded-full">รอบที่ {round}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {players.map((p) => (
                <motion.div key={p.id} animate={{ opacity: p.eliminated ? 0.25 : 1 }} transition={{ duration: 0.4 }}
                  className={`rounded-2xl border px-4 py-5 flex flex-col items-center gap-1.5 ${p.eliminated ? "border-white/5 bg-transparent" : "border-white/10 bg-white/5"}`}>
                  <span className="text-2xl">{p.eliminated ? "💀" : "👤"}</span>
                  <p className={`text-sm font-semibold text-center ${p.eliminated ? "text-white/25 line-through" : "text-white"}`}>{p.name}</p>
                </motion.div>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setVoteOpen(true)}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-colors">
              &#x1F5F3;&#xFE0F; &nbsp; โหวต
            </motion.button>
            {history.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3"></p>
                <div className="flex flex-col gap-2">
                  {history.map((h, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-sm">
                      <span className="text-white/35 w-16 shrink-0"> {h.round}</span>
                      <span className="text-white">{h.name}</span>
                      <span className={`ml-auto text-xs shrink-0 ${ROLE_COLOR[h.role]}`}>{ROLE_LABEL[h.role]}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.main>
        )}

        {screen === "gameover" && (
          <motion.main key="gameover" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="flex-1 max-w-2xl w-full mx-auto px-4 pb-12 flex flex-col gap-4">
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
              className="bg-white/5 border border-blue-500/30 rounded-2xl p-6 text-center">
              <p className="text-5xl mb-3">&#x1F3C1;</p>
              <h2 className="text-white font-bold text-2xl mb-2">{winnerRole === "Citizen" ? "Win" : "Game Over"}</h2>
              <p className="text-blue-300 text-sm leading-relaxed">{gameOverMsg} ชนะ</p>
            </motion.div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3"></p>
              <div className="flex flex-col">
                {players.map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between py-3 ${i < players.length - 1 ? "border-b border-white/5" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${ROLE_COLOR[p.role]}`}>{ROLE_LABEL[p.role]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                <div className="bg-blue-900/30 border border-blue-500/20 rounded-xl p-3 text-center">
                  <p className="text-blue-400 text-xs mb-1"></p>
                  <p className="text-white font-bold">{citizenWordFinal}</p>
                </div>
                <div className="bg-red-900/30 border border-red-500/20 rounded-xl p-3 text-center">
                  <p className="text-red-400 text-xs mb-1"> Undercover</p>
                  <p className="text-white font-bold">{undercoverWordFinal}</p>
                </div>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={resetGame}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-colors">
              &#x1F504;&nbsp; เล่นอีกครั้ง
            </motion.button>
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {voteOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-6 sm:pb-0"
            onClick={(e) => e.target === e.currentTarget && setVoteOpen(false)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-[#0f172a] border border-white/15 rounded-2xl p-5 w-full max-w-sm">
              <p className="text-white font-semibold mb-4 text-sm"> </p>
              <div className="flex flex-col gap-2 mb-5 max-h-60 overflow-y-auto">
                {alivePlayers.map((p) => (
                  <button key={p.id} onClick={() => setSelectedVote(p.id === selectedVote ? null : p.id)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-left transition-all duration-150 ${selectedVote === p.id ? "bg-blue-600 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"}`}>
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setVoteOpen(false); setSelectedVote(null); }} className="flex-1 py-3 rounded-xl border border-white/15 text-white/50 text-sm hover:bg-white/5 transition-colors">ยกเลิก</button>
                <button onClick={confirmVote} disabled={selectedVote === null} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/30 text-white text-sm font-semibold transition-colors">คอนเฟิร์ม</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 24 }}
              className="bg-[#0f172a] border border-white/15 rounded-2xl p-8 w-full max-w-sm text-center">
              <p className="text-white/50 text-sm mb-1"> </p>
              <p className="text-white text-2xl font-bold mb-4">{confirmResult.name}</p>
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-5 ${
                confirmResult.role === "Citizen" ? "bg-blue-900/50 text-blue-300 border border-blue-500/30"
                : confirmResult.role === "Undercover" ? "bg-red-900/50 text-red-300 border border-red-500/30"
                : "bg-gray-800 text-gray-300 border border-gray-600/30"}`}>
                {ROLE_LABEL[confirmResult.role]}
              </div>
              {confirmResult.role === "Mr. White" && (
                <input
                  type="text"
                  value={mrWhiteGuess}
                  onChange={(e) => setMrWhiteGuess(e.target.value)}
                  placeholder="ใส่คำตอบ"
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm placeholder:text-white/35 focus:outline-none focus:border-blue-500/60 mb-6"
                />
              )}

              <button onClick={applyElimination} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">
                {confirmResult.role === "Mr. White" ? "ตอบ" : "ตกลง"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnderCover;