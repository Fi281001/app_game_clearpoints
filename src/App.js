import "./App.css";
import { useState, useEffect, useMemo, useRef } from "react";
import Swal from "sweetalert2";
function App() {
  const [value, setValue] = useState(0);
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true); // Thêm trạng thái để theo dõi
  const valueRef = useRef();
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startGame = () => {
    const numericValue = value === "" ? 0 : parseInt(value, 10);

    if (numericValue < 1 || numericValue > 1000) {
      Swal.fire({
        title: "The value must be greater than 1 and less than 1000",
        text: "Try Agian",
        confirmButtonText: "OK",
      });
      setValue(0);
      setTime(0);
    } else {
      setPoints(
        shuffleArray(Array.from({ length: numericValue }, (_, i) => i + 1))
      );

      setIsPlaying(true);
      setTime(10);
    }
  };

  useEffect(() => {
    let timer;
    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsPlaying(false); // Đánh dấu là không còn chơi khi hết thời gian
      if (points != 0) {
        Swal.fire({
          title: "GAME OVER",
          text: "Try Agian",
          confirmButtonText: "OK",
        });
        // setValue(0);
        // setIsPlaying(false);
        // setPoints([]);
        // setClickedNumbers([]);
        // setTime(0);
        // setCurrentNumber(1);
        // valueRef.current.focus();
        handleRestart();
      }
    }

    // Dọn dẹp interval khi component unmount hoặc time thay đổi
    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    if (points.length === 0 && time > 0) {
      Swal.fire({
        title: "YOU WIN",
        text: "Congratulations!",
        confirmButtonText: "OK",
      });
      // setIsPlaying(false);
      // setPoints([]);
      // setClickedNumbers([]);
      // setValue(0);
      // setTime(0);
      // setCurrentNumber(1);
      // valueRef.current.focus();
      handleRestart();
    }
  }, [points, time]);

  const handleRestart = () => {
    setTime(0);
    setValue(0);
    setPoints([]);
    setClickedNumbers([]);
    setIsPlaying(false);
    setCurrentNumber(1);
    valueRef.current.focus();
  };

  const handleButtonClick = (num) => {
    // check click theo số thứ tự
    if (num === currentNumber) {
      setClickedNumbers((prev) => [...prev, num]); // Lưu số đã nhấp
      setCurrentNumber((prev) => prev + 1); // Tăng số hiện tại
      setTimeout(() => {
        setPoints((prev) => {
          // Kiểm tra và chỉ xóa nếu số vẫn tồn tại
          if (prev.includes(num)) {
            return prev.filter((point) => point !== num); // Xóa số khỏi danh sách sau 1 giây
          }
          return prev; // Trả về danh sách không thay đổi nếu số không còn
        });
      }, 1000);
    } else {
      console.error(
        "Lỗi: Bạn đã nhấp sai thứ tự! Mong muốn: số",
        currentNumber
      );
    }
  };

  const getButtonStyle = (num) => {
    // Đổi màu nút nếu đã nhấp đúng
    return clickedNumbers.includes(num)
      ? { backgroundColor: "green", color: "white" }
      : {};
  };
  const randomizedPositions = useMemo(() => {
    return points.map((num) => {
      return {
        num,
        x: Math.random() * 250,
        y: Math.random() * 250,
      };
    });
  }, [points]);
  return (
    <div className="App">
      <div>
        <h1>LET'S PLAY</h1>
        <label>Points: </label>
        <input
          ref={valueRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <br />
        <label>Time: </label>
        <span>{time}s</span>
        <br />
        <button onClick={isPlaying ? handleRestart : startGame}>
          {isPlaying ? "Restart" : "Play"}
        </button>
      </div>

      <div className="display">
        {randomizedPositions.map(({ num, x, y }) => {
          // const x = Math.random() * 250;
          // const y = Math.random() * 250;
          return (
            <button
              key={num}
              className="point-button"
              style={{
                position: "absolute",
                top: `${y}px`,
                left: `${x}px`,
                ...getButtonStyle(num),
              }}
              onClick={() => handleButtonClick(num)}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
