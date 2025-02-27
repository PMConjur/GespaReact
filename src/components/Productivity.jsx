import Chart from "react-apexcharts";
import { userProductivity } from "../services/gespawebServices";
import { useEffect, useState } from "react";

const Productivity = () => {
  //const idEjecutivo = 38316;
  const responseData = JSON.parse(localStorage.getItem("responseData"));

  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo || ""; // Get idEjecutivo from respo
  const [series, setSeries] = useState([
    {
      data: []
    }
  ]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        const data = await userProductivity(idEjecutivo);
        const productividadInfo = data.productividadInfo;
        setCategories(Object.keys(productividadInfo));
        setSeries([
          {
            data: Object.values(productividadInfo).map(Number)
          }
        ]);
      } catch (error) {
        console.error("Error fetching productivity data:", error);
      }
    };

    if (idEjecutivo) {
      fetchProductivityData();
    }
  }, [idEjecutivo]);

  const options = {
    chart: {
      type: "bar",
      height: 350,
      foreColor: "#ffffff"
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true
      }
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value}`,
        title: {
          formatter: () => "Cantidad:"
        }
      },
      style: {
        fontSize: "14px",
        colors: ["#ffff"]
      },
      background: "#ffffff",
      border: {
        color: "#e5e7eb",
        width: 1
      },
      marker: {
        show: true,
        fillColors: ["#3B82F6"]
      }
    },
    dataLabels: {
      enabled: true
    },
    yaxis: {
      labels: {
        style: {
          colors: "#ffffff", // Color de las etiquetas del eje Y
          fontSize: "14px"
        }
      }
    },
    // Opcional: Personalizar la leyenda
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#ffff" // Color labels eje X
        }
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default Productivity;
