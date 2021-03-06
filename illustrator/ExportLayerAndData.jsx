#include AltLayerExporter.jsx
#include DataExtractor.jsx
#include ../common/Utils.jsx
#include ../common/json2.js

$.exportLayersAndData = function (defaultParams, ignoreHidden, namingFunc, doc, destFolder) {
    
    if(!doc) doc = app.activeDocument;
    if(!destFolder) destFolder = Folder.selectDialog ("Select Destination Folder");
    if(!destFolder) return;
    
    var reg = new RegExp("\\s", "g");
        
    if(!namingFunc) namingFunc = function(lname) {return lname.replace(reg, "-");};
    
    
    function readLayerParams(lName) {
        
        //if(lName.charAt(0) == "!") return null;
        
        var obj = {
            name:lName,
            exportType: defaultParams.exportType,
            svgFont: defaultParams.svgFont,
            jpgQuality: defaultParams.jpgQuality,
            precision: defaultParams.precision,
            embedImages: defaultParams.embedImages
        };        
        
        var nameParts = lName.split(".");
        
        if(nameParts.length > 1) obj.exportType = nameParts[1];
        
        obj.name = namingFunc(nameParts[0]);
        
        /*TODO: option parsing*/
        /*
        obj.svgFont = false;//TODO
        obj.jpgQuality = 100;//TODO
        obj.precision = 2;//TODO
        obj.embedImages = true;//TODO
        */
        
        return obj;
    }
    
    
    AltLayerExporter.exportLayers(doc, destFolder, ignoreHidden, readLayerParams);

    var data = DataExtractor.getLayersCoords(doc, readLayerParams); 
    
    var text = JSON.stringify(data, null, '\t');
    var filepath = destFolder.absoluteURI + "/data.json";
    saveTextFile(text, filepath);
            
}


var globalParams = {
    exportType: "svg",
    precision: 2,    
    svgFont: false,
    jpgQuality: 100,
    embedImages: true
};

$.exportLayersAndData(globalParams, true);
