require("dotenv").config();
const cors = require('cors');
const express = require("express");
const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default;
const { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-document-intelligence");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
// Use CORS and allow requests from your frontend 
// List of allowed origins
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://tgccai.vercel.app'] // Only allow production domain
  : ['http://localhost:8080']; // Allow localhost in development


const corsOptions = {
    origin: function (origin, callback) {
        // If no origin or the origin is in the allowed list, allow the request
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST',
};

const PORT = process.env.PORT || 3000;
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
const key = process.env.FORM_RECOGNIZER_KEY;
const modelId = process.env.CUSTOM_MODEL_ID;


app.use(cors(corsOptions));

app.post("/analyze", async (req, res) => {
  try {
    const { formUrl } = req.body;

    if (!formUrl) {
      return res.status(400).json({ error: "Missing formUrl in request body" });
    }

    const client = DocumentIntelligence(endpoint, { key });

    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", modelId)
      .post({
        contentType: "application/json",
        body: { urlSource: formUrl },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = getLongRunningPoller(client, initialResponse);
    const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

    const documents = analyzeResult?.documents;
    const document = documents && documents[0];

    if (!document) {
      return res.status(400).json({ error: "No document found in the result." });
    }
    const fields = document.fields
    // Get the last item in the "appro" array
    const lastApproItem = fields.appro.valueArray[fields.appro.valueArray.length - 1];
    
    const appro_actuel = lastApproItem.valueObject.actuel?.valueString?parseFloat(lastApproItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const appro_actuel_confidence=lastApproItem.valueObject.actuel.confidence
    const appro_precedent = lastApproItem.valueObject.precedent?.valueString?parseFloat(lastApproItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const appro_precedent_confidence=lastApproItem.valueObject.precedent.confidence
    const appro_mensuel = lastApproItem.valueObject.mensuel?.valueString?parseFloat(lastApproItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const appro_mensuel_confidence=lastApproItem.valueObject.mensuel.confidence

    // Get the last item in the "travaux" array
    const lastTravauxItem = fields.travaux.valueArray[fields.travaux.valueArray.length - 1];
    
    const travaux_actuel = lastTravauxItem.valueObject.actuel?.valueString?parseFloat(lastTravauxItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const travaux_actuel_confidence=lastTravauxItem.valueObject.actuel.confidence
    const travaux_precedent = lastTravauxItem.valueObject.precedent?.valueString?parseFloat(lastTravauxItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const travaux_precedent_confidence=lastTravauxItem.valueObject.precedent.confidence
    const travaux_mensuel = lastTravauxItem.valueObject.mensuel?.valueString?parseFloat(lastTravauxItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const travaux_mensuel_confidence=lastTravauxItem.valueObject.mensuel.confidence

    // Get the last item in the "retenues" array
    const lastRetenuesItem = fields.retenues.valueArray[fields.retenues.valueArray.length - 1];
    
    const retenues_actuel = lastRetenuesItem.valueObject['CUMUL ACTUEL']?.valueString?parseFloat(lastRetenuesItem.valueObject['CUMUL ACTUEL'].valueString.replace(/\s/g, '').replace(',', '.')):0;
    const retenues_actuel_confidence=lastRetenuesItem.valueObject['CUMUL ACTUEL'].confidence
    const retenues_precedent = lastRetenuesItem.valueObject['CUMUL PRECEDENT']?.valueString?parseFloat(lastRetenuesItem.valueObject['CUMUL PRECEDENT'].valueString.replace(/\s/g, '').replace(',', '.')):0;
    const retenues_precedent_confidence=lastRetenuesItem.valueObject['CUMUL PRECEDENT'].confidence
    const retenues_mensuel = lastRetenuesItem.valueObject['MENSUEL REALISE']?.valueString?parseFloat(lastRetenuesItem.valueObject['MENSUEL REALISE'].valueString.replace(/\s/g, '').replace(',', '.')):0;
    const retenues_mensuel_confidence=lastRetenuesItem.valueObject['MENSUEL REALISE'].confidence
    
    // Get the last item in the "liberation retenues" array
    const lastLibRetenuesItem = fields.liberation_retenues.valueArray[fields.liberation_retenues.valueArray.length - 1];
    
    const libretenues_actuel = lastLibRetenuesItem.valueObject.actuel?.valueString?parseFloat(lastLibRetenuesItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const libretenues_actuel_confidence=lastLibRetenuesItem.valueObject.actuel.confidence
    const libretenues_precedent = lastLibRetenuesItem.valueObject.precedent?.valueString?parseFloat(lastLibRetenuesItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const libretenues_precedent_confidence=lastLibRetenuesItem.valueObject.precedent.confidence
    const libretenues_mensuel = lastLibRetenuesItem.valueObject.mensuel?.valueString?parseFloat(lastLibRetenuesItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const libretenues_mensuel_confidence=lastLibRetenuesItem.valueObject.mensuel.confidence

    // Get the items in the "total_dp" array
    const totalItem=fields.total_dp.valueArray[0]
    const total_actuel= totalItem.valueObject.actuel?.valueString?parseFloat(totalItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const total_actuel_confidence=totalItem.valueObject.actuel.confidence
    const total_precedent= totalItem.valueObject['CUMUL PRECEDENT']?.valueString?parseFloat(totalItem.valueObject['CUMUL PRECEDENT'].valueString.replace(/\s/g, '').replace(',', '.')):0;
    const total_precedent_confidence=totalItem.valueObject['CUMUL PRECEDENT'].confidence
    const total_mensuel= totalItem.valueObject.mensuel?.valueString?parseFloat(totalItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const total_mensuel_confidence=totalItem.valueObject.mensuel.confidence
    
    const tvaItem=fields.total_dp.valueArray[1]
    const tva_actuel=tvaItem.valueObject.actuel?.valueString?parseFloat(tvaItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const tva_actuel_confidence=tvaItem.valueObject.actuel.confidence
    const tva_precedent=tvaItem.valueObject['CUMUL PRECEDENT']?.valueString?parseFloat(tvaItem.valueObject['CUMUL PRECEDENT'].valueString.replace(/\s/g, '').replace(',', '.')):0;
    const tva_precedent_confidence=tvaItem.valueObject['CUMUL PRECEDENT'].confidence
    const tva_mensuel=tvaItem.valueObject.mensuel?.valueString?parseFloat(tvaItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const tva_mensuel_confidence=tvaItem.valueObject.mensuel.confidence

    const montantduItem=fields.total_dp.valueArray[2]
    const montant_du_actuel= montantduItem.valueObject.actuel?.valueString?parseFloat(montantduItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const montant_du_actuel_confidence=montantduItem.valueObject.actuel.confidence
    const montant_du_precedent=montantduItem.valueObject['CUMUL PRECEDENT']?.valueString?parseFloat(montantduItem.valueObject['CUMUL PRECEDENT'].valueString.replace(/\s/g, '').replace(',', '.')):0;
    const montant_du_precedent_confidence=montantduItem.valueObject['CUMUL PRECEDENT'].confidence
    const montant_du_mensuel=montantduItem.valueObject.mensuel?.valueString?parseFloat(montantduItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.')):0;
    const montant_du_mensuel_confidence=montantduItem.valueObject.mensuel.confidence
    

    res.json({
      docType: document.docType,
      confidence: document.confidence || 0,
      chantier: fields.chantier.valueString || "N/A",
      chantier_confidence: fields.chantier.confidence || 0,
      maitre_ouvrage: fields.maitre_ouvrage.valueString || "N/A",
      maitre_ouvrage_confidence: fields.maitre_ouvrage.confidence || 0,
      lot: fields.lot.valueString || "N/A",
      lot_confidence: fields.lot.confidence || 0,
      sstraitant: fields.sstraitant.valueString || "N/A",
      sstraitant_confidence: fields.sstraitant.confidence || 0,
      numdp: fields.numero.valueString || "N/A",
      numdp_confidence: fields.numero.confidence || 0,
      date_dp: fields.date_dp.valueString || "N/A",
      date_dp_confidence: fields.date_dp.confidence || 0,
      appro_actuel_ttc:appro_actuel || 0,
      appro_actuel_ttc_confidence:appro_actuel_confidence || 0,
      appro_precedent_ttc:appro_precedent || 0,
      appro_precedent_ttc_confidence:appro_precedent_confidence || 0,
      appro_mensuel_ttc:appro_mensuel ||  0,
      appro_mensuel_ttc_confidence:appro_mensuel_confidence || 0,
      montant_travaux_actuel: travaux_actuel||  0,
      montant_travaux_actuel_confidence:travaux_actuel_confidence || 0,
      montant_travaux_precedent: travaux_precedent||  0,
      montant_travaux_precedent_confidence:travaux_precedent_confidence || 0,
      montant_travaux_mensuel: travaux_mensuel||  0,
      montant_travaux_mensuel_confidence:travaux_mensuel_confidence || 0,
      montant_retenues_actuel: retenues_actuel||  0,
      montant_retenues_actuel_confidence:retenues_actuel_confidence ||  0,
      montant_retenues_precedent: retenues_precedent|| 0,
      montant_retenues_precedent_confidence:retenues_precedent_confidence ||  0,
      montant_retenues_mensuel: retenues_mensuel||  0,
      montant_retenues_mensuel_confidence:retenues_mensuel_confidence | 0,
      montant_libretenues_actuel: libretenues_actuel|| 0,
      montant_libretenues_actuel_confidence:libretenues_actuel_confidence ||  0,
      montant_libretenues_precedent: libretenues_precedent||  0,
      montant_libretenues_precedent_confidence:libretenues_precedent_confidence ||  0,
      montant_libretenues_mensuel: libretenues_mensuel||  0,
      montant_libretenues_mensuel_confidence:libretenues_mensuel_confidence ||  0,
      total_ht_actuel:total_actuel || 0,
      total_ht_actuel_confidence:total_actuel_confidence || 0,
      total_ht_precedent:total_precedent || 0,
      total_ht_precedent_confidence:total_precedent_confidence || 0,
      total_ht_mensuel:total_mensuel||  0,
      total_ht_mensuel_confidence:total_mensuel_confidence|| 0,
      tva_actuel:tva_actuel || 0,
      tva_actuel_confidence:tva_actuel_confidence || 0,
      tva_precedent:tva_precedent || 0,
      tva_precedent_confidence:tva_precedent_confidence || 0,
      tva_mensuel:tva_mensuel || 0,
      tva_mensuel_confidence:tva_mensuel_confidence || 0,
      montant_du_actuel:montant_du_actuel || 0,
      montant_du_actuel_confidence:montant_du_actuel_confidence || 0,
      montant_du_precedent:montant_du_precedent || 0,
      montant_du_precedent_confidence:montant_du_precedent_confidence || 0,
      montant_du_mensuel:montant_du_mensuel || 0,
      montant_du_mensuel_confidence:montant_du_mensuel_confidence || 0,     

    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
