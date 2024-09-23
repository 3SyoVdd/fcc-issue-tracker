const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

var validId = "xxx"
//der dumme fehler war den Pfad nicht immer gleich zu haben...

const arr= ["title","text","created_by", "assigned_to", "status_text", "open"]
chai.use(chaiHttp);

suite('Functional Tests', function() {
    test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .post("/api/issues/projects")
          .set("content-type", "application/json")
          .send({
            issue_title: arr[0],
            issue_text:  arr[1],
            created_by:  arr[2],
            assigned_to: arr[3],
            status_text: arr[4],
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, arr[0]);
            assert.equal(res.body.issue_text,  arr[1]);
            assert.equal(res.body.created_by,  arr[2]);
            assert.equal(res.body.assigned_to, arr[3]);
            assert.equal(res.body.status_text, arr[4]);
           validId = res.body._id;
           console.log ("Valid id", validId);
            done();
          });
        });
/*
        test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
            chai
              .request(server)
              .post("/api/issues/projects")
              .set("content-type", "application/json")
              .send({
                issue_title: arr[0],
                issue_text:  arr[1],
                created_by:  arr[2],
                assigned_to: arr[3],
                status_text: arr[4],
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, arr[0]);
                assert.equal(res.body.issue_text,  arr[1]);
                assert.equal(res.body.created_by,  arr[2]);
                assert.equal(res.body.assigned_to, arr[3]);
                assert.equal(res.body.status_text, arr[4]);
               validId = res.body._id;
               console.log ("Valid id", validId);
                done();
              });
            });
    */


        test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
            chai
              .request(server)
              .post("/api/issues/projects")
              .set("content-type", "application/json")
              .send({
                issue_title: arr[0],
                issue_text:  arr[1],
                created_by:  arr[2],
                //assigned_to: arr[3],
                //status_text: arr[4],
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, arr[0]);
                assert.equal(res.body.issue_text,  arr[1]);
                assert.equal(res.body.created_by,  arr[2]);
                //assert.equal(res.body.assigned_to, arr[3]);
                //assert.equal(res.body.status_text, arr[4]);
                done();
              });
            });

            test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
                chai
                  .request(server)
                  .post("/api/issues/projects")
                  .set("content-type", "application/json")
                  .send({
                    issue_title: arr[0],
                    //issue_text:  arr[1],
                    created_by:  arr[2],
                    assigned_to: arr[3],
                    status_text: arr[4],
                  })
                  .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                  });
                });
        
                
                    test("View issues on a project: GET request to /api/issues/{project}", function (done) {
                      chai
                        .request(server)
                        .get("/api/issues/projects")
                        .end(function (err, res) {
                          assert.equal(res.status, 200);
                          
                          //assert.isAbove(res.body.length, 0);
                          done();
                        });
                    });

                    test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
                        chai
                        .request(server)
                        .get("/api/issues/projects")
                        .query({
                          open: "true",
                        })
                        .end(function (err, res) {
                          assert.equal(res.status, 200);
                          done();
                        });
                      });


                      test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
                        chai
                        .request(server)
                        .get("/api/issues/projects")
                        .query({
                          open: "true",
                          createdBy:"Alice"
                        })
                        .end(function (err, res) {
                          assert.equal(res.status, 200);
                          done();
                        });
                      });

                      test("Update one field on an issue: PUT request to /api/issues/apitest", function (done) {
                        chai
                          .request(server)
                          .put("/api/issues/projects")
                          .send({
                            _id: validId,
                            issue_title: "Change Title",
                          })
                          .end(function (err, res) {
                            assert.equal(res.status, 200);
                            console.log ("update " +res.body.result+ res.body.err);
                            assert.equal(res.body.result, "successfully updated");
                            assert.equal(res.body._id, validId);
                
                            done();
                          });
                      });


                      test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
                        chai
                          .request(server)
                          .put("/api/issues/projects")
                          .send({
                            _id: validId,
                            issue_title: "Change Title",
                            issue_text: "Change Text"
                          })
                          .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, "successfully updated");
                            assert.equal(res.body._id, validId);
                
                            done();
                          });
                      });

                      test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
                        chai
                          .request(server)
                          .put("/api/issues/projects")
                          .send({
                            //_id: validId,
                            issue_title: "Change Title",
                            issue_text: "Change Text"
                          })
                          .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.error, "missing _id");
                
                            done();
                          });
                      });

                      test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
                        chai
                          .request(server)
                          .put("/api/issues/projects")
                          .send({
                            _id: validId,
                            //issue_title: "Change Title",
                            //issue_text: "Change Text"
                          })
                          .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.error, "no update field(s) sent");
                
                            done();
                          });
                      });
                      

                      test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
                        chai
                          .request(server)
                          .put("/api/issues/projects")
                          .send({
                            _id: 5,
                            issue_title: "Change Title",
                            //issue_text: "Change Text"
                          })
                          .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.error, "could not update");
                
                            done();
                          });
                      });

                      test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
                        chai
                          .request(server)
                          .delete("/api/issues/projects")
                          .send({
                            _id: validId,
                            //issue_title: "Change Title",
                            //issue_text: "Change Text"
                          })
                          .end(function (err, res) {
                            assert.equal(res.status, 200);
                            console.log ("test Error Ausgabe: " + res.body.error);
                            assert.equal(res.body.result, "successfully deleted");
                
                            done();
                          });
                      });

                      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
                        chai
                          .request(server)
                          .delete("/api/issues/projects")
                          .send({
                            _id: 5,
                            //issue_title: "Change Title",
                            //issue_text: "Change Text"
                          })
                          .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.error, "could not delete");
                
                            done();
                          });
                      });

                      test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
                        chai
                            .request(server)
                            .delete("/api/issues/projects")
                            .send({
                            //_id: 5,
                            //issue_title: "Change Title",
                            //issue_text: "Change Text"
                            })
                            .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.error, "missing _id");
                
                            done();
                            });
                        });

});
