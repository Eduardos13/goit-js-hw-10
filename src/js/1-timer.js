import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker"); // отримую інпут\
const startBtn = document.querySelector("button");

let userSelectedDate = null;

const options = {   // задаю налаштування пікеру, такі як 24-годинний формат
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      console.log(selectedDates[0]);

      if(selectedDates[0].getTime() < Date.now()) { // перевіряю що дата не раніше моменту зараз
        startBtn.classList.add("disable-btn"); // роблю кнопку не актівною якщо дата раніше ніж зараз
        startBtn.disabled = true;
        return iziToast.show({
          title: "",
          message: "Please choose a date in the future"
      }); // виводжу повідомлення про вибір дати в майбутньому
      }
      userSelectedDate = selectedDates[0]; // присвоюю обрану валідну дату змінній
      startBtn.classList.remove("disable-btn"); // роблю кнопку активною
      startBtn.disabled = false;
    }
}

const handleClick = () => {

    const intervalId = setInterval(convertMs, 1000);

    function convertMs() {

        const ms = userSelectedDate.getTime() - Date.now();

        // Number of milliseconds per unit of time
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
      
        // Remaining days
        const days = Math.floor(ms / day);
        // Remaining hours
        const hours = Math.floor((ms % day) / hour);
        // Remaining minutes
        const minutes = Math.floor(((ms % day) % hour) / minute);
        // Remaining seconds
        const seconds = Math.floor((((ms % day) % hour) % minute) / second);

        const updatedTimeValue = (dataAttribute, newValue) => {  // функція для відмалювання компонентів в інтерфейс таймера

          const timeValue = document.querySelector(`.value[data-${dataAttribute}]`);

          if(timeValue) {
            timeValue.textContent = newValue;
          }
        }

        updatedTimeValue('days', days.toString().padStart(2, '0'));
        updatedTimeValue('hours', hours.toString().padStart(2, '0'));
        updatedTimeValue('minutes', minutes.toString().padStart(2, '0'));
        updatedTimeValue('seconds', seconds.toString().padStart(2, '0'));

        if(ms <= 0) {
          clearInterval(intervalId);
        }

        return { days, hours, minutes, seconds };
      }

      startBtn.disabled = true;
      startBtn.classList.add("disable-btn");
      input.disabled = true;
      input.classList.add("disabled-input");
}

const fp = flatpickr("#datetime-picker", options);  // ініціалізую бібліотеку

startBtn.addEventListener("click", handleClick);