document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('input-form');

  // Inicializar Chart.js
  const ctxSalary = document.getElementById('salaryChart').getContext('2d');
  const salaryChart = new Chart(ctxSalary, {
    type: 'line',
    data: { labels: [], datasets: [
      { label: 'Salario Mensual', data: [], fill: false },
      { label: 'Ahorro Mensual', data: [], fill: false }
    ]},
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  });

  const ctxPort = document.getElementById('portfolioChart').getContext('2d');
  const portChart = new Chart(ctxPort, {
    type: 'line',
    data: { labels: [], datasets: [
      { label: 'Portafolio Nominal', data: [], fill: false },
      { label: 'Portafolio Real', data: [], fill: false }
    ]},
    options: { responsive: true, plugins: { legend: { position: 'top' } } }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Leer valores
    const years     = +document.getElementById('years').value;
    const salaryAn  = +document.getElementById('salary').value;
    const salGrow   = +document.getElementById('salGrowth').value / 100;
    const savePct   = +document.getElementById('savePct').value   / 100;
    const annRet    = +document.getElementById('retorno').value   / 100;
    const inflation = +document.getElementById('inflacion').value / 100;

    const months   = years * 12;
    const mRet     = Math.pow(1 + annRet,  1/12) - 1;
    const mInf     = Math.pow(1 + inflation,1/12) - 1;
    const mSalGrow = Math.pow(1 + salGrow, 1/12) - 1;

    let labels     = [];
    let salaryArr  = [];
    let saveArr    = [];
    let portfolio  = [0];
    let realPort   = [];

    // Generar datos
    for (let t = 0; t <= months; t++) {
      labels.push((t/12).toFixed(1));
      const salM  = (salaryAn/12) * Math.pow(1 + mSalGrow, t);
      const saveM = salM * savePct;

      salaryArr.push(salM.toFixed(2));
      saveArr.push(saveM.toFixed(2));

      if (t > 0) {
        portfolio[t] = portfolio[t-1] * (1 + mRet) + saveM;
      }
      realPort.push((portfolio[t] / Math.pow(1 + mInf, t)).toFixed(2));
    }

    // Actualizar gráficas
    salaryChart.data.labels = labels;
    salaryChart.data.datasets[0].data = salaryArr;
    salaryChart.data.datasets[1].data = saveArr;
    salaryChart.update();

    portChart.data.labels = labels;
    portChart.data.datasets[0].data = portfolio.map(v => v.toFixed(2));
    portChart.data.datasets[1].data = realPort;
    portChart.update();
  });

  // Calcula al cargar por primera vez
  form.dispatchEvent(new Event('submit'));
});
