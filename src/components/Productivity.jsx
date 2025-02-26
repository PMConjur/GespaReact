import Chart from "react-apexcharts";
import { userProductivity } from "../services/gespawebServices";
import { useEffect, useState } from "react";

const Productivity = () => {
  const idEjecutivo = 38410;
  //const location = useLocation();
  //const responseData =
  //location.state || JSON.parse(localStorage.getItem("responseData"));
  //const idEjecutivo = 38410//responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo || ""; // Get idEjecutivo from respo
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
    dataLabels: {
      enabled: false
    },
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
