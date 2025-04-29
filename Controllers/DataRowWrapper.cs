using System.Data;

namespace NoriAPI.Controllers
{
	public class DataRowWrapper
	{
		public int IdCartera { get; set; }
		public string IdCuenta { get; set; }

		public DataRowWrapper(int idCartera, string idCuenta)
		{
			IdCartera = idCartera;
			IdCuenta = idCuenta;
		}
	}
}