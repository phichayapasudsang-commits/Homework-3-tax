document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. ระบบสลับโหมด --- */
    const themeSwitch = document.querySelector('#checkbox');
    const themeLabel = document.getElementById('themeLabel');
    
    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeLabel.textContent = '☀️';
        } else {
            themeLabel.textContent = '🌙';
        }
    });

    /* --- 2. ระบบคำนวณภาษีเงินได้บุคคลธรรมดา --- */
    const maxInputs = 3;
    const minInputs = 1;
    let currentInputs = 1;

    const addBtn = document.getElementById('addBtn');
    const removeBtn = document.getElementById('removeBtn');
    const inputsContainer = document.getElementById('incomeInputsContainer');
    const warningMessage = document.getElementById('warningMessage');
    
    const totalIncomeEl = document.getElementById('totalIncome');
    const taxRateEl = document.getElementById('taxRate');
    const totalTaxEl = document.getElementById('totalTax');

    function createInput() {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `<input type="text" class="income-input" placeholder="กรอกรายได้..." autocomplete="off">`;
        div.querySelector('input').addEventListener('input', calculateTax);
        return div;
    }

    addBtn.addEventListener('click', () => {
        if (currentInputs < maxInputs) {
            inputsContainer.appendChild(createInput());
            currentInputs++;
            calculateTax();
        }
    });

    removeBtn.addEventListener('click', () => {
        if (currentInputs > minInputs) {
            inputsContainer.removeChild(inputsContainer.lastChild);
            currentInputs--;
            calculateTax();
        }
    });

    document.querySelectorAll('.income-input').forEach(input => {
        input.addEventListener('input', calculateTax);
    });

    // ตรวจสอบและคำนวณ
    function calculateTax() {
        const inputs = document.querySelectorAll('.income-input');
        let totalIncome = 0;
        
        // แยกตัวแปรเก็บสถานะ Error
        let hasNegativeError = false;
        let hasNonNumericError = false;

        inputs.forEach(input => {
            const rawValue = input.value.trim();
            
            if (rawValue !== "") {
                const val = Number(rawValue);
                
                // ตรวจสอบว่าไม่ใช่ตัวเลข
                if (isNaN(val)) {
                    hasNonNumericError = true;
                } 
                // ตรวจสอบว่าติดลบ
                else if (val < 0) {
                    hasNegativeError = true;
                } 
                // ถ้าถูกต้องให้นำมาบวกรวม
                else {
                    totalIncome += val;
                }
            }
        });

        // จัดการข้อความแจ้งเตือนแบบเจาะจง
        if (hasNegativeError || hasNonNumericError) {
            warningMessage.classList.remove('hidden');
            
            if (hasNegativeError && hasNonNumericError) {
                warningMessage.textContent = "* มีรายได้บางรายการเป็นค่าติดลบ และไม่ใช่ตัวเลข (non-numeric)";
            } else if (hasNegativeError) {
                warningMessage.textContent = "* กรุณาแก้ไข: มีรายได้บางรายการเป็นค่าติดลบ";
            } else if (hasNonNumericError) {
                warningMessage.textContent = "* กรุณาแก้ไข: มีข้อมูลที่ไม่ใช่ตัวเลข (non-numeric)";
            }

            // แสดง Error ที่ช่องผลลัพธ์
            totalIncomeEl.value = "Error";
            taxRateEl.value = "-";
            totalTaxEl.value = "-";
            return; // หยุดการทำงาน ไม่ต้องคำนวณต่อ
        } else {
            warningMessage.classList.add('hidden');
        }

        // --- ส่วนคำนวณภาษีด้านล่างใช้เหมือนเดิม ---
        totalIncomeEl.value = totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        let taxToPay = 0;
        let maxRate = 0;
        let remainingIncome = totalIncome;

        if (remainingIncome > 5000000) {
            taxToPay += (remainingIncome - 5000000) * 0.35;
            remainingIncome = 5000000;
            maxRate = 35;
        }
        if (remainingIncome > 2000000) {
            taxToPay += (remainingIncome - 2000000) * 0.30;
            remainingIncome = 2000000;
            if (maxRate === 0) maxRate = 30;
        }
        if (remainingIncome > 1000000) {
            taxToPay += (remainingIncome - 1000000) * 0.25;
            remainingIncome = 1000000;
            if (maxRate === 0) maxRate = 25;
        }
        if (remainingIncome > 750000) {
            taxToPay += (remainingIncome - 750000) * 0.20;
            remainingIncome = 750000;
            if (maxRate === 0) maxRate = 20;
        }
        if (remainingIncome > 500000) {
            taxToPay += (remainingIncome - 500000) * 0.15;
            remainingIncome = 500000;
            if (maxRate === 0) maxRate = 15;
        }
        if (remainingIncome > 300000) {
            taxToPay += (remainingIncome - 300000) * 0.10;
            remainingIncome = 300000;
            if (maxRate === 0) maxRate = 10;
        }
        if (remainingIncome > 150000) {
            taxToPay += (remainingIncome - 150000) * 0.05;
            remainingIncome = 150000;
            if (maxRate === 0) maxRate = 5;
        }

        if (totalIncome === 0) {
            taxRateEl.value = "0%";
            totalTaxEl.value = "0.00";
        } else if (totalIncome <= 150000) {
            taxRateEl.value = "ได้รับการยกเว้น";
            totalTaxEl.value = "0.00";
        } else {
            taxRateEl.value = maxRate + "%";
            totalTaxEl.value = taxToPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    /* --- 3. ระบบแสดงเวลาเรียลไทม์ (ใช้โค้ดเดิม) --- */
    const timeDisplay = document.getElementById('timeDisplay');
    const apiUrl = 'https://learningportal.ocsc.go.th/learningspaceapi/localdatetime';

    async function fetchTime() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            const response = await fetch(apiUrl, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Network not ok');
            const data = await response.json();
            const dateObj = new Date(data.datetime);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const thaiDate = dateObj.toLocaleDateString('th-TH', options);
            const timeString = dateObj.toLocaleTimeString('th-TH');

            timeDisplay.textContent = `วันที่ ${thaiDate} เวลา ${timeString} น.`;
            timeDisplay.classList.remove('time-error');
        } catch (error) {
            timeDisplay.textContent = 'ระบบเครือข่ายล้มเหลว';
            timeDisplay.classList.add('time-error');
        }
    }

    fetchTime();
    setInterval(fetchTime, 1000);
});