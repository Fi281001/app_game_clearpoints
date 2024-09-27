import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const [value, setValue] = useState(0);
  const [time, setTime] = useState(30);
  const [points, setPoints] = useState([]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const numericValue = value === "" ? 0 : parseInt(value, 10);

      // Kiểm tra điều kiện lỗi
      if (numericValue < 1 || numericValue > 1000) {
        alert("Giá trị phải nằm trong khoảng từ 1 đến 1000!");
        handleRestart();
      } else {
        setValue(numericValue);
        setPoints(
          shuffleArray(Array.from({ length: numericValue }, (_, i) => i + 1))
        );
      }
    }
  };

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000); // Giảm 1 giây mỗi lần

      // Cleanup interval khi component bị unmount hoặc thời gian kết thúc
      return () => clearInterval(timer);
    }
  }, [time]);
  const handleRestart = () => {
    setTime(30);
    setValue(0);
    setPoints([]);
    setClickedNumbers([]);
  };

  const [currentNumber, setCurrentNumber] = useState(1);
  const [clickedNumbers, setClickedNumbers] = useState([]);

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
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <br />
        <label>Time: </label>
        <span>{time}s</span>
        <br />
        <button onClick={handleRestart}>Restart</button>
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
