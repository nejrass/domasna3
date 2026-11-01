// 1. Дефинирање на 10 возачи (име, тим, брзина, вештина, тип на гуми, време, дали бил во бокс, пишал статуси)
let vozaci = [
    { ime: "Max Verstappen", tim: "Red Bull", brzina: 95, vestina: 96, gumi: "Medium", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Lewis Hamilton", tim: "Ferrari", brzina: 94, vestina: 97, gumi: "Hard", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Lando Norris", tim: "McLaren", brzina: 95, vestina: 94, gumi: "Medium", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Charles Leclerc", tim: "Ferrari", brzina: 94, vestina: 95, gumi: "Hard", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Oscar Piastri", tim: "McLaren", brzina: 93, vestina: 92, gumi: "Medium", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "George Russell", tim: "Mercedes", brzina: 93, vestina: 93, gumi: "Hard", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Fernando Alonso", tim: "Aston Martin", brzina: 92, vestina: 98, gumi: "Medium", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Carlos Sainz", tim: "Williams", brzina: 92, vestina: 94, gumi: "Hard", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Sergio Perez", tim: "Red Bull", brzina: 91, vestina: 90, gumi: "Medium", pitStop: false, vreme: 0, status: "Нормално" },
    { ime: "Kimi Antonelli", tim: "Mercedes", brzina: 90, vestina: 89, gumi: "Hard", pitStop: false, vreme: 0, status: "Нормално" }
];

let tekovenKrug = 0;
const vkupnoKrugovi = 10;

// Иницијален приказ на табелата пред да почне трката
window.onload = function() {
    prikaziTabela();
};

function prikaziTabela() {
    let tbody = document.getElementById("tabelaVozaci");
    tbody.innerHTML = "";

    // Сортирање по вкупно време (помало време = подобра позиција)
    vozaci.sort((a, b) => a.vreme - b.vreme);

    vozaci.forEach((v, index) => {
        let statusKlasa = "status-normal";
        if (v.status.includes("Извртување") || v.status.includes("Излетување")) statusKlasa = "status-incident";
        else if (v.status.includes("Пит-стоп")) statusKlasa = "status-pit";

        let red = `<tr>
            <td><strong>#${index + 1}</strong></td>
            <td>${v.ime}</td>
            <td>${v.tim}</td>
            <td>${v.gumi}</td>
            <td>${v.pitStop ? "✅ Да" : "❌ Не"}</td>
            <td>${v.vreme.toFixed(2)} s</td>
            <td class="${statusKlasa}">${v.status}</td>
        </tr>`;
        tbody.innerHTML += red;
    });
}

function zapocniTrka() {
    tekovenKrug = 0;
    // Ресетирај време и статуси на почеток
    vozaci.forEach(v => {
        v.vreme = 0;
        v.pitStop = false;
        v.status = "Подготвен";
    });
    document.getElementById("startBtn").disabled = true;
    document.getElementById("sledenKrugBtn").disabled = false;
    sledenKrug();
}

function sledenKrug() {
    if (tekovenKrug >= vkupnoKrugovi) {
        alert("Трката заврши! Победник е " + vozaci[0].ime + " 🏆");
        document.getElementById("sledenKrugBtn").disabled = true;
        document.getElementById("startBtn").disabled = false;
        return;
    }

    tekovenKrug++;
    document.getElementById("krugInfo").innerHTML = `Тековен круг: ${tekovenKrug} / ${vkupnoKrugovi}`;

    // Проверка за безбедносно возило (Safety Car) на случаен круг (на пр. во 4ти или 7ми круг)
    let safetyCarAktiven = (Math.random() < 0.25); // 25% шанса за Safety Car во секој круг
    if (safetyCarAktiven) {
        alert(`🚨 ИЗЛЕЗ НА БЕЗБЕДНОСНО ВОЗИЛО (SAFETY CAR) во круг ${tekovenKrug}! Брзините се намалени.`);
    }

    vozaci.forEach(v => {
        let krugVreme = 80 + (100 - v.brzina) - (v.vestina * 0.1);
        v.status = "Нормално вози";

        // Проверка за пит-стоп (случаен избор, но мора барем еднаш до крајот)
        // Ако сме во претпоследниот круг а возачот не влегол во бокс, мора сега да влезе!
        let vleguvaVoBox = (Math.random() < 0.3 || (tekovenKrug === 9 && !v.pitStop));
        if (vleguvaVoBox) {
            v.pitStop = true;
            krugVreme += 22; // Додава време за промена на гуми во бокс
            v.gumi = (v.gumi === "Medium") ? "Hard" : "Medium"; // Промена на тип на гуми
            v.status = "🔄 Пит-стоп (Сменети гуми)";
        }

        // Проверка за извртување / излетување (5% шанса)
        let incident = (Math.random() < 0.08);
        if (incident) {
            krugVreme += 10; // Казна во време поради извртување
            v.status = "⚠️ Извртување / Излетување од патека!";
        }

        if (safetyCarAktiven) {
            krugVreme += 5; // Забавување зад safety car
            v.status += " | 🟡 Safety Car";
        }

        v.vreme += krugVreme;
    });

    prikaziTabela();

    if (tekovenKrug === vkupnoKrugovi) {
        document.getElementById("sledenKrugBtn").disabled = true;
        document.getElementById("startBtn").disabled = false;
        // Означување на победник
        setTimeout(() => {
            alert(`🏁 ТРКАТА ЗАВРШИ! ПОБЕДНИК НА ГРАН ПРИТО Е ${vozaci[0].ime} (${vozaci[0].tim}) со време ${vozaci[0].vreme.toFixed(2)}s! 🏆`);
        }, 200);
    }
}