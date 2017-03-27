using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace SoftiDoc.Web.Api.Controllers
{
    [RoutePrefix("api/softidoc")]
    public class SoftiDocController : ApiController
    {
        public SoftiDocController()
        {
        }

        [HttpGet]
        [Route("getDatabases")]
        public HttpResponseMessage GetDatabases()
        {

            string connStr = ConfigurationManager.ConnectionStrings["myConnectionString"].ConnectionString;

            var command = new SqlCommand("select * from Databases", new SqlConnection(connStr));
            var adapter = new SqlDataAdapter(command);
            var dataset = new DataSet();
            adapter.Fill(dataset);

            var str = dataset.Tables[0].Rows[0]["Databasename"].ToString();

            return Request.CreateResponse(HttpStatusCode.OK, "hello im here");
        }

    }
}
   
   