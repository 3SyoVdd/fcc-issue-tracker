'use strict';

const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res)=>{
      let project = req.params.project; //name vom projekt zu dem alle einträge gefunden werden sollen
      console.log ("ich bin Get route. Suche nach issues im Project: " + project)
      
      //erstellen der Variablen und zuweisung von req query werten:

      const {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.query;


     // Suche nach dem Project mit dem namen
     const projectfound= await ProjectModel.findOne({name: project});
      if (!projectfound){res.json("project not found")}


     console.log (project + " GET projectF found Anzahl:" + projectfound.issues.length);
     
      //issues copieren (ist ein array von dicts)
      var myIssues=[...projectfound.issues];
      
      
      var Filterarray = [];//array zum filtern
     
      if (_id!=undefined){Filterarray.push(["_id", _id])};
      if (open!=undefined){Filterarray.push(["open", open])};
      if (issue_title!=undefined){Filterarray.push([" issue_title",  issue_title])};
      if (issue_text!=undefined){Filterarray.push(["issue_text", issue_text])};
      if (created_by!=undefined){Filterarray.push(["created_by", created_by])};
      if (assigned_to!=undefined){Filterarray.push(["assigned_to", assigned_to])};
      if (status_text!=undefined){Filterarray.push(["status_text", status_text])};


      //issues filtern
      //console.log ("Filter:");
      //console.log (Filterarray);

      for (let n = 0; n<Filterarray.length; n++){//filterarray durchlaufen
        let key = Filterarray[n][0];
        let value = Filterarray[n][1];
        for (let i = 0; i<myIssues.length; i++){
          if (myIssues[i][key]!=value){//wenn key nicht enhalten ist
            myIssues.splice(i, 1);//arrayelement löschen
            i--;//index zurücksetzen
          }
        }
      }

      //console.log ("myIssues");
      //console.log (myIssues);

     //ganz einfache rückmeldung der issues des gefundenen projects
      res.json(myIssues);
    })
    
    .post(async (req, res)=>{
      // werte aus form übernehmen
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let status_text  = req.body.status_text; 
      let open = true;

      if (!issue_title || !issue_text || !created_by){//wenn was fehlt dann rückmeldung
        res.json({error: "required field(s) missing"});
        return;
      }

      
        let projectModel = await ProjectModel.findOne({ name: project});//nach dem titel suchen wenn es den titel nicht gibt dann einen erstellen
        if (!projectModel){
          projectModel = new ProjectModel({name:project});
          projectModel = await projectModel.save();
        }
      

        //Ein Issue Model erstellen mit der ID vom ProjectModel
      let issueModel = new IssueModel({
        //projectId: projectModel._id, //wird nicht benötigt, da issue ohnehin teil von project ist
        issue_title: issue_title || "",
        issue_text : issue_text,
        created_by: created_by || "",
        assigned_to: assigned_to|| "",
        status_text: status_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        open:true
      });
/* hat schon funktioniert
      let issueModel = new IssueModel({
        projectId: projectModel._id,
        issue_title: issue_title || "",
        issue_text : issue_text,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        created_on: 
        updated_on:
        open:true
      });
*/

      //hier existieren das project model und das issue Model. sind aber noch nicht zusammengeführt

      //issueModel = await issueModel.save(); //frage: muss hier das issue model überhaupt gespeichert werden??

      projectModel.issues.push(issueModel);
      projectModel.save();

      
      //console.log ("ich bin post" + title);
       //console.log (projectModel._id + " " + issueModel._id + issue_title + " " + issue_text + " " + created_by + " " + assigned_to + " " + status_text );
       console.log ("GET Erstellt:" +project._id + " " + issueModel._id + issue_title + " " + issue_text + " " + created_by + " " + assigned_to + " " + status_text );

      //Rückmeldung:
      res.json(issueModel);


    })
    
    .put(async (req, res)=>{
      let project = req.params.project;
      console.log ("ich bin put id: " + req.body._id);
      //daten vom request Body holen und zuweisen
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      if (_id == undefined){
        res.json({ error: 'missing _id' });
        return;
      }
      
      //wenn alle felder leer sind
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        res.json({ error: "no update field(s) sent", _id: _id });
        return;
      }


      //suchen nach Projektnamen in Projektmodel
      const projectfound= await ProjectModel.findOne({name: project});
     // console.log ("put gefunden" + projectfound);
      if (!projectfound){ res.json({ error: 'could not update', '_id': _id }); return;};

      //versuch eine Issue Data zu holen mittels id()
      const issueData = projectfound.issues.id(_id);
      if (!issueData) {
        res.json({ error: "could not update", _id: _id });
        return;
      }
      //update wenn wert vorhanden. sonst alten wert übernehmen
          issueData.updated_on = new Date();
          issueData.issue_title = issue_title || issueData.issue_title;
          issueData.created_by = created_by || issueData.created_by;
          issueData.assigned_to = assigned_to || issueData.assigned_to;
          issueData.status_text = status_text || issueData.status_text;
          issueData.issue_text = issue_text || issueData.issue_text;
          issueData.open = open || issueData.open;


          //project model speichern
          projectfound.save();
          res.json({ result: "successfully updated", _id: _id });

      //console.log (_id + " issueDatagefiltert " + issueData);

      //res.json("noch nicht fertig");
/*
      ProjectModel.findOne({name: project}, (err, projectData)=>{
        if (err){ res.json({ error: 'could not update', '_id': _id })};
        if (!projectData){ res.json({ error: 'could not update', '_id': _id })};
      })
*/
    })
    
    .delete(async (req, res)=>{
      let project = req.params.project;
      
      console.log ("ich bin delete id: " + req.body._id + " projektname:" +project);
      //daten vom request Body holen und zuweisen
      const {
        _id
      } = req.body

      //id not set
      if (!_id){
        console.log("loesch mich 1");
        res.json({  error: 'missing _id' });
        return;
      }

      const projectfound= await ProjectModel.findOne({name: project});
      //wenn nicht gefunden
       if (!projectfound){
         console.log("loesch mich 2"); 
         res.json({ error: 'could not delete', '_id': _id }); return;
      };
      
       let issueData = projectfound.issues.id(_id);//suche nach arrayelement mit der id --> das funktioniert!

       //console.log("projectfound");
       //console.log(projectfound.issues);

console.log("projectfound.issues");
console.log(projectfound.issues);
//console.log(issueData.length);
console.log(issueData);
/*
       if (!issueData) {
        console.log("loesch mich 3");
         res.json({error: "could not delete", _id: _id });
         return;
       }
*/
//datensatz mit der ID löschen
      let validIdFound = false;
       for (let i= 0; i<projectfound.issues.length; i++){
        console.log ("ids der issues" + projectfound.issues[i]["_id"]);
          if (projectfound.issues[i]["_id"] == _id){
            console.log ("ids match splice");
            projectfound.issues.splice(i, 1);//arrayelement löschen
            validIdFound = true;
            projectfound.save();
            res.json({ result: 'successfully deleted', '_id': _id });
            return;
            break;//für die Fisch
          }
       }
       
       if (!validIdFound){//wenn keine gültige Id gefunden wurde 
       console.log ("error could not delete weil keine valide id gefunden");
       res.json({ error: "could not delete", _id: _id });
        return;

       }
        
       //issueData.remove();

      
       console.log("HAAAAAAAAAAAAAAAAAAAAAAAAAALo  geloescht" + _id);
        res.json({ result: 'successfully deleted', '_id': _id });

    });
    
};
