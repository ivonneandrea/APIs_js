const create = document.querySelector("#conversor");
const charter = document.querySelector("#myChart");
const actualizarIcono = document.querySelector("#actualizar");
let myChart;


const gettingCoins = async (codigo) => {
    try {
        const valores = await fetch(`https://mindicador.cl/api/${codigo}`);
        const results = await valores.json();
        return results.serie;
    } catch (error) {
        alert("Error: ", error.message);
    }
};


const calculateCoinsTotal = (valores, datos) => {
    const coinValue = datos[0].valor;
    const total = valores / coinValue;
    return Math.round(total * 100) / 100; //math para funciones con decimales
};


const showResults = (total) => {
    document.querySelector("#totalValor").innerHTML = total;
};


const obteinValues = (datos) => {
    return datos.map((item) => item.valor);
};


const obteinDates = (datos) => {
    return datos.slice(0, 10).map(
        (item) => new Date(item.fecha).toLocaleDateString("en-US") 
    );
};


const destroyPreviousGraphic = () => {
    if (myChart) {
        myChart.destroy();
    }
};


const calculateCoinsValue = async (valor, moneda) => {
    const datos = await gettingCoins(moneda);
    showGraphic(datos, valor);
};


const showGraphic = (datos, valor) => {     //forma diferente de mostrar grafico 
    const total = calculateCoinsTotal(valor, datos);
    showResults(total);

    const labels = obteinDates(datos);
    const values = obteinValues(datos);

    const datasets = [
        {
            label: "Historial ultimos 10 dias",
            borderColor: "rgb(170, 130, 238)",
            borderWidth: 2,
            data: values,
        },
    ];

    const config = {
        type: "line",
        data: { labels, datasets },
    };

    destroyPreviousGraphic();

    charter.style.backgroundColor = "white";
    charter.style.borderRadius = "3rem";
    charter.style.padding = "0.5rem";
    charter.style.margin = "0.5rem";

    myChart = new Chart(charter, config);
};


create.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = create.elements["value"].value;
    const coin = create.elements["coin"].value;

    if (!value) {
        alert("Agregar valor");
        return;
    }
    if (!coin) {
        alert("Seleccionar moneda");
        return;
    }

    await calculateCoinsValue(value, coin);
});


const actualizar = () => {
    location.reload(true);
};

actualizarIcono.addEventListener("click", actualizar);