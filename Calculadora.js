document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('input-form');
  const ctxSal    = document.getElementById('salaryChart').getContext('2d');
  const ctxPort   = document.getElementById('portfolioChart').getContext('2d');

  // Gráfico de Salario vs Ahorro
  const salaryChart = new Chart(ctxSal, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Salario Mensual', data: [], fill: false },
        { label: 'Ahorro Mensual',  data: [], fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } }
    }
  });

  // Gráfico de Portafolio con 4 líneas
  const portChart = new Chart(ctxPort, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Portafolio Nominal',            data: [], fill: false },
        { label: 'Portafolio Real',               data: [], fill: false },
        { label: 'Ahorro Nominal (sin invertir)', data: [], fill: false },
        { label: 'Ahorro Real (sin invertir)',    data: [], fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } }
    }
  });

  form.addEventListener('submit', ev => {
    ev.preventDefault();

    // Lectura de inputs
    const years     = +form.years.value;
    const salaryAn  = +form.salary.value;
    const salGrow   = +form.salGrowth.value / 100;
    const savePct   = +form.savePct.value   / 100;
    const annRet    = +form.retorno.value   / 100;
    const inflation = +form.inflacion.value / 100;

    // Tasas mensuales
    const months   = years * 12;
    const mRet     = Math.pow(1 + annRet,    1/12) - 1;
    const mInf     = Math.pow(1 + inflation, 1/12) - 1;
    const mSalGrow = Math.pow(1 + salGrow,   1/12) - 1;

    let labels       = [];
    let salaryArr    = [];
    let saveArr      = [];
    let portfolio    = [0];
    let realPort     = [];
    let baselineNom  = [0];
    let baselineReal = [];

    // Generar datos mes a mes
    for (let t = 0; t <= months; t++) {
      labels.push((t/12).toFixed(1));

      // Salario y ahorro mensual
      const salM  = (salaryAn/12) * Math.pow(1 + mSalGrow, t);
      const saveM = salM * savePct;
      salaryArr.push(salM.toFixed(2));
      saveArr.push(saveM.toFixed(2));

      // Portafolio con rentabilidad
      if (t > 0) {
        portfolio[t] = portfolio[t-1] * (1 + mRet) + saveM;
      }

      // Línea base: acumulado sin invertir
      if (t > 0) {
        baselineNom[t] = baselineNom[t-1] + saveM;
      }

      // Ajuste por inflación
      const infFactor = Math.pow(1 + mInf, t);
      realPort.push((portfolio[t] / infFactor).toFixed(2));
      baselineReal.push((baselineNom[t] / infFactor).toFixed(2));
    }

    // Actualiza Salary Chart
    salaryChart.data.labels                = labels;
    salaryChart.data.datasets[0].data      = salaryArr;
    salaryChart.data.datasets[1].data      = saveArr;
    salaryChart.update();

    // Actualiza Portfolio Chart
    portChart.data.labels                  = labels;
    portChart.data.datasets[0].data        = portfolio.map(v => v.toFixed(2));
    portChart.data.datasets[1].data        = realPort;
    portChart.data.datasets[2].data        = baselineNom.map(v => v.toFixed(2));
    portChart.data.datasets[3].data        = baselineReal;
    portChart.update();
  });

  // Cálculo inicial al cargar página
  form.dispatchEvent(new Event('submit'));
});
