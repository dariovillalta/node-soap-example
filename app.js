/*jslint node: true */
"use strict";


var soap = require('soap');
var express = require('express');
var fs = require('fs');
const xml_lib = require('xml');

// the splitter function, used by the service
function splitter_function(args) {
    console.log('splitter_function');
    console.log('args', args);
    var splitter = args.splitter;
    var splitted_msg = args.message.split(splitter);
    var result = [];
    for(var i=0; i<splitted_msg.length; i++){
      result.push(splitted_msg[i]);
    }
    return xml_lib( {pregunta: '1'} );
}

// the service
var serviceObject = {
  ProviderService: {
    ProviderSoapPort: {
      SaveProvider: splitter_function
    }
  }
};

// load the WSDL file
var xml = fs.readFileSync('service.wsdl', 'utf8');
// create express app
var app = express();

// root handler
app.get('/', function (req, res) {
  res.send('Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>');
})

app.post('/wsdl', function (XmlDocument doc) {
  console.log('1');
  XmlNamespaceManager nsManager = new XmlNamespaceManager(doc.NameTable); 
  nsManager .AddNamespace(formNamespace, formURI);
  nsManager .AddNamespace("dfs",
"http://schemas.microsoft.com/office/infopath/2003/dataFormSolution");

  XmlNode root = doc.DocumentElement;
  XmlNodeList list = root.SelectNodes("/dfs:IPDocument/my:myFields/my:prodList/my:product", nsManager);

  foreach (XmlNode node in list)
  {
    string name = node.SelectSingleNode
        ("/dfs:IPDocument/my:myFields/my:prodList/my:product/my:name", nsManager).InnerText;
    string price = node.SelectSingleNode
        ("/dfs:IPDocument/my:myFields/my:prodList/my:product/my:price", nsManager).InnerText;
    string amount = node.SelectSingleNode
        ("/dfs:IPDocument/my:myFields/my:prodList/my:product/my:amount", nsManager).InnerText;

    SubmitToDataBase(name,price, amount);
  }
  console.log('req', req);
  console.log('\n\n\n\n');
  console.log('xml_lib', xml_lib(req));
})

app.post('/wsdl?wsdl', function (req, res) {
  console.log('2');
  console.log('req', req);
})

// Launch the server and listen
var port = 8000;
app.listen(process.env.PORT || port, function () {
  console.log('Listening on port ' + port);
  var wsdl_path = "/wsdl";
  soap.listen(app, wsdl_path, serviceObject, xml);
  console.log("Check http://localhost:" + port + wsdl_path +"?wsdl to see if the service is working");
});