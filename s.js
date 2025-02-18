require("dotenv").config();
const express = require("express");
const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default;
const { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-document-intelligence");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

const PORT = process.env.PORT || 3000;
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
const key = process.env.FORM_RECOGNIZER_KEY;
const modelId = process.env.CUSTOM_MODEL_ID;

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
    
    const appro_actuel = parseFloat(lastApproItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const appro_actuel_confidence=lastApproItem.valueObject.actuel.confidence
    const appro_precedent = parseFloat(lastApproItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.'));
    const appro_precedent_confidence=lastApproItem.valueObject.precedent.confidence
    const appro_mensuel = parseFloat(lastApproItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const appro_mensuel_confidence=lastApproItem.valueObject.mensuel.confidence

    // Get the last item in the "travaux" array
    const lastTravauxItem = fields.travaux.valueArray[fields.travaux.valueArray.length - 1];
    
    const travaux_actuel = parseFloat(lastTravauxItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const travaux_actuel_confidence=lastTravauxItem.valueObject.actuel.confidence
    const travaux_precedent = parseFloat(lastTravauxItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.'));
    const travaux_precedent_confidence=lastTravauxItem.valueObject.precedent.confidence
    const travaux_mensuel = parseFloat(lastTravauxItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const travaux_mensuel_confidence=lastTravauxItem.valueObject.mensuel.confidence

    // Get the last item in the "retenues" array
    const lastRetenuesItem = fields.retenues.valueArray[fields.retenues.valueArray.length - 1];
    
    const retenues_actuel = parseFloat(lastRetenuesItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const retenues_actuel_confidence=lastRetenuesItem.valueObject.actuel.confidence
    const retenues_precedent = parseFloat(lastRetenuesItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.'));
    const retenues_precedent_confidence=lastRetenuesItem.valueObject.precedent.confidence
    const retenues_mensuel = parseFloat(lastRetenuesItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const retenues_mensuel_confidence=lastRetenuesItem.valueObject.mensuel.confidence
    
    // Get the last item in the "liberation retenues" array
    const lastLibRetenuesItem = fields.liberation_retenues.valueArray[fields.liberation_retenues.valueArray.length - 1];
    
    const libretenues_actuel = parseFloat(lastLibRetenuesItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const libretenues_actuel_confidence=lastLibRetenuesItem.valueObject.actuel.confidence
    const libretenues_precedent = parseFloat(lastLibRetenuesItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.'));
    const libretenues_precedent_confidence=lastLibRetenuesItem.valueObject.precedent.confidence
    const libretenues_mensuel = parseFloat(lastLibRetenuesItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const libretenues_mensuel_confidence=lastLibRetenuesItem.valueObject.mensuel.confidence

    // Get the items in the "total_dp" array
    const totalItem=fields.total_dp.valueArray[0]
    const total_actuel=parseFloat(totalItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const total_actuel_confidence=totalItem.valueObject.actuel.confidence
    const total_precedent=parseFloat(totalItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.'));
    const total_precedent_confidence=totalItem.valueObject.precedent.confidence
    const total_mensuel=parseFloat(totalItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const total_mensuel_confidence=totalItem.valueObject.mensuel.confidence
    
    const tvaItem=fields.total_dp.valueArray[1]
    const tva_actuel=parseFloat(tvaItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const tva_actuel_confidence=tvaItem.valueObject.actuel.confidence
    const tva_precedent=parseFloat(tvaItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.'));
    const tva_precedent_confidence=tvaItem.valueObject.precedent.confidence
    const tva_mensuel=parseFloat(tvaItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const tva_mensuel_confidence=tvaItem.valueObject.mensuel.confidence

    const montantduItem=fields.total_dp.valueArray[1]
    const montant_du_actuel=parseFloat(montantduItem.valueObject.actuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const montant_du_actuel_confidence=montantduItem.valueObject.actuel.confidence
    const montant_du_precedent=parseFloat(montantduItem.valueObject.precedent.valueString.replace(/\s/g, '').replace(',', '.'));
    const montant_du_precedent_confidence=montantduItem.valueObject.precedent.confidence
    const montant_du_mensuel=parseFloat(montantduItem.valueObject.mensuel.valueString.replace(/\s/g, '').replace(',', '.'));
    const montant_du_mensuel_confidence=montantduItem.valueObject.mensuel.confidence
    

    res.json({
      docType: document.docType,
      confidence: document.confidence || "N/A",
      chantier: fields.chantier.valueString || "N/A",
      chantier_confidence: fields.chantier.confidence || "N/A",
      maitre_ouvrage: fields.maitre_ouvrage.valueString || "N/A",
      maitre_ouvrage_confidence: fields.maitre_ouvrage.confidence || "N/A",
      lot: fields.lot.valueString || "N/A",
      lot_confidence: fields.lot.confidence || "N/A",
      sstraitant: fields.sstraitant.valueString || "N/A",
      sstraitant_confidence: fields.sstraitant.confidence || "N/A",
      numdp: fields.numero.valueString || "N/A",
      numdp_confidence: fields.numero.confidence || "N/A",
      date_dp: fields.date_dp.valueString || "N/A",
      date_dp_confidence: fields.date_dp.confidence || "N/A",
      appro_actuel_ttc:appro_actuel || "N/A",
      appro_actuel_ttc_confidence:appro_actuel_confidence || "N/A",
      appro_precedent_ttc:appro_precedent || "N/A",
      appro_precedent_ttc_confidence:appro_precedent_confidence || "N/A",
      appro_mensuel_ttc:appro_mensuel || "N/A",
      appro_mensuel_ttc_confidence:appro_mensuel_confidence || "N/A",
      montant_travaux_actuel: travaux_actuel|| "N/A",
      montant_travaux_actuel_confidence:travaux_actuel_confidence || "N/A",
      montant_travaux_precedent: travaux_precedent|| "N/A",
      montant_travaux_precedent_confidence:travaux_precedent_confidence || "N/A",
      montant_travaux_mensuel: travaux_mensuel|| "N/A",
      montant_travaux_mensuel_confidence:travaux_mensuel_confidence || "N/A",
      montant_retenues_actuel: retenues_actuel|| "N/A",
      montant_retenues_actuel_confidence:retenues_actuel_confidence || "N/A",
      montant_retenues_precedent: retenues_precedent|| "N/A",
      montant_retenues_precedent_confidence:retenues_precedent_confidence || "N/A",
      montant_retenues_mensuel: retenues_mensuel|| "N/A",
      montant_retenues_mensuel_confidence:retenues_mensuel_confidence || "N/A",
      montant_libretenues_actuel: libretenues_actuel|| "N/A",
      montant_libretenues_actuel_confidence:libretenues_actuel_confidence || "N/A",
      montant_libretenues_precedent: libretenues_precedent|| "N/A",
      montant_libretenues_precedent_confidence:libretenues_precedent_confidence || "N/A",
      montant_libretenues_mensuel: libretenues_mensuel|| "N/A",
      montant_libretenues_mensuel_confidence:libretenues_mensuel_confidence || "N/A",
      total_ht_actuel:total_actuel || "N/A",
      total_ht_actuel_confidence:total_actuel_confidence || "N/A",
      total_ht_precedent:total_precedent || "N/A", 
      total_ht_precedent_confidence:total_precedent_confidence || "N/A", 
      total_ht_mensuel:total_mensuel|| "N/A", 
      total_ht_mensuel_confidence:total_mensuel_confidence|| "N/A", 
      tva_actuel:tva_actuel || "N/A",
      tva_actuel_confidence:tva_actuel_confidence || "N/A",
      tva_precedent:tva_precedent || "N/A",
      tva_precedent_confidence:tva_precedent_confidence || "N/A",
      tva_mensuel:tva_mensuel || "N/A",
      tva_mensuel_confidence:tva_mensuel_confidence || "N/A",
      montant_du_actuel:montant_du_actuel || "N/A",
      montant_du_actuel_confidence:montant_du_actuel_confidence || "N/A",
      montant_du_precedent:montant_du_precedent || "N/A",
      montant_du_precedent_confidence:montant_du_precedent_confidence || "N/A",
      montant_du_mensuel:montant_du_mensuel || "N/A",
      montant_du_mensuel_confidence:montant_du_mensuel_confidence || "N/A",     

    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
