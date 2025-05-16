document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('input-form');
  const ctxSal  = document.getElementById('salaryChart').getContext('2d');
  const ctxPort = document.getElementById('portfolioChart').getContext('2d');

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff' } }
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.2)' } },
      y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.2)' } }
    }
  };

  const salaryChart = new Chart(ctxSal, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Salario Mensual', data: [], fill: false, borderColor: '#4dabf7' },
        { label: 'Ahorro Mensual',  data: [], fill: false, borderColor: '#f06595' }
      ]
    },
    options: commonOptions
  });

  const portChart = new Chart(ctxPort, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Portafolio Nominal',            data: [], fill: false, borderColor: '#74c0fc' },
        { label: 'Portafolio Real',               data: [], fill: false, borderColor: '#ffd43b' },
        { label: 'Ahorro Nominal (sin invertir)', data: [], fill: false, borderColor: '#a5d8ff' },
        { label: 'Ahorro Real (sin invertir)',    data: [], fill: false, borderColor: '#ffe066' }
      ]
    },
    options: commonOptions
  });

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const years     = +form.years.value;
    const salaryAn  = +form.salary.value;
    const salGrow   = +form.salGrowth.value / 100;
    const savePct   = +form.savePct.value   / 100;
    const annRet    = +form.retorno.value   / 100;
    const inflation = +form.inflacion.value / 100;

    const months    = years * 12;
    const mRet      = Math.pow(1 + annRet,    1/12) - 1;
    const mInf      = Math.pow(1 + inflation, 1/12) - 1;
    const mSalGrow  = Math.pow(1 + salGrow,   1/12) - 1;

    let labels       = [];
    let salaryArr    = [];
    let saveArr      = [];
    let portfolio    = [0];
    let realPort     = [];
    let baselineNom  = [0];
    let baselineReal = [];

    for (let t = 0; t <= months; t++) {
      labels.push((t/12).toFixed(1));
      const salM  = (salaryAn/12) * Math.pow(1 + mSalGrow, t);
      const saveM = salM * savePct;
      salaryArr.push(+salM.toFixed(2));
      saveArr.push(+saveM.toFixed(2));

      if (t > 0) {
        portfolio[t]   = portfolio[t-1] * (1 + mRet) + saveM;
        baselineNom[t] = baselineNom[t-1] + saveM;
      }

      const infFactor = Math.pow(1 + mInf, t);
      realPort.push(+(portfolio[t]   / infFactor).toFixed(2));
      baselineReal.push(+(baselineNom[t] / infFactor).toFixed(2));
    }

    salaryChart.data.labels               = labels;
    salaryChart.data.datasets[0].data     = salaryArr;
    salaryChart.data.datasets[1].data     = saveArr;
    salaryChart.update();

    portChart.data.labels                 = labels;
    portChart.data.datasets[0].data       = portfolio.map(v => v.toFixed(2));
    portChart.data.datasets[1].data       = realPort;
    portChart.data.datasets[2].data       = baselineNom.map(v => v.toFixed(2));
    portChart.data.datasets[3].data       = baselineReal;
    portChart.update();
  });

  form.dispatchEvent(new Event('submit'));
});
