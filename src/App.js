import "./App.scss";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Board from "./components/Board/Board";

const emojiList = [..."👾🥵🐒🦍🍕🌮💣💟"];

const App = () => {
  const [shuffledMemoBlocks, setShuffledMemoBlocks] = useState([]);
  const [selectedMemoBlock, setselectedMemoBlock] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [moves, setMoves] = useState(0);
  const [movesFail, setMovesFail] = useState(0);

  useEffect(() => {
    const shuffledEmojiList = shuffleArray([...emojiList, ...emojiList]);
    setShuffledMemoBlocks(
      shuffledEmojiList.map((emoji, i) => ({ index: i, emoji, flipped: false }))
    );
  }, []);

  const shuffleArray = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleMemoClick = (memoBlock) => {
    const flippedMemoBlock = { ...memoBlock, flipped: true };
    let shuffledMemoBlocksCopy = [...shuffledMemoBlocks];
    shuffledMemoBlocksCopy.splice(memoBlock.index, 1, flippedMemoBlock);
    setShuffledMemoBlocks(shuffledMemoBlocksCopy);
    if (selectedMemoBlock === null) {
      setselectedMemoBlock(memoBlock);
    } else if (selectedMemoBlock.emoji === memoBlock.emoji) {
      setselectedMemoBlock(null);
      setMoves((moves) => moves + 1);

      if (allMemoBlocksMatched(shuffledMemoBlocksCopy)) {
        setAnimating(true);
        // const totalMoves = moves + movesFail;
        // const message = `Lo hiciste en ${totalMoves} movimiento${
        //   totalMoves > 1 ? "s" : ""
        // }`;

        // Swal.fire({
        //   title: "¡Felicidades, ganaste!",
        //   text: message,
        //   icon: "success",
        // });

        Swal.fire({
          title: "¡Felicidades, ganaste! 🤩",
          icon: "success",
        });

        setTimeout(() => {
          resetGame();
        }, 2000);
      }
    } else {
      setAnimating(true);
      setMovesFail((movesFail) => movesFail + 1);
      setTimeout(() => {
        shuffledMemoBlocksCopy.splice(memoBlock.index, 1, memoBlock);
        shuffledMemoBlocksCopy.splice(
          selectedMemoBlock.index,
          1,
          selectedMemoBlock
        );
        setShuffledMemoBlocks(shuffledMemoBlocksCopy);
        setselectedMemoBlock(null);
        setAnimating(false);
      }, 1000);
    }
  };

  const allMemoBlocksMatched = (memoBlocks) => {
    return memoBlocks.every((memoBlock) => memoBlock.flipped);
  };
  console.log("olo", allMemoBlocksMatched(shuffledMemoBlocks));

  const resetGame = () => {
    const shuffledEmojiList = shuffleArray([...emojiList, ...emojiList]);
    setShuffledMemoBlocks(
      shuffledEmojiList.map((emoji, i) => ({ index: i, emoji, flipped: false }))
    );
    setselectedMemoBlock(null);
    setAnimating(false);
    setMoves(0);
    setMovesFail(0);
  };

  return (
    <div>
      <h1>Listo para jugar 😇</h1>
      <div className="score">
        <p>Movimientos acertados: {moves}</p>
        <p>Movimientos fallidos: {movesFail}</p>
      </div>
      <Board
        memoBlocks={shuffledMemoBlocks}
        animating={animating}
        handleMemoClick={handleMemoClick}
      />
    </div>
  );
};

export default App;
