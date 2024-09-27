import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState(0);
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true); // Thêm trạng thái để theo dõi

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startGame = () => {
    const numericValue = value === "" ? 0 : parseInt(value, 10);
    // Kiểm tra điều kiện lỗi
    if (numericValue < 1 || numericValue > 1000) {
      alert("Giá trị phải nằm trong khoảng từ 1 đến 1000!");
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
        alert("you lose");
        setValue("");
        setIsPlaying(false);
        setPoints([]);
        setClickedNumbers([]);
        setTime(0);
      }
    }

    // Dọn dẹp interval khi component unmount hoặc time thay đổi
    return () => clearInterval(timer);
  }, [time]);

  const handleRestart = () => {
    setTime(0);
    setValue(0);
    setPoints([]);
    setClickedNumbers([]);
    setIsPlaying(false);
  };

  const handleButtonClick = (num) => {
    // check click theo số thứ tự
    if (num === currentNumber) {
      console.log("số", num);
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

  return (
    <div className="App">
      <div>
        <h1>LET'S PLAY</h1>
        <label>Points: </label>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <br />
        <label>Time: </label>
        <span>{time}s</span>
        <br />
        <button onClick={isPlaying ? handleRestart : startGame}>
          {isPlaying ? "Restart" : "Play"}
        </button>
      </div>

      <div className="display">
        {points.map((num) => {
          const x = Math.random() * 270;
          const y = Math.random() * 270;
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
