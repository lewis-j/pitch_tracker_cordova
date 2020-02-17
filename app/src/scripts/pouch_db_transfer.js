/*global PouchDB*/
/*global storeData*/
/*global loadSQL*/

var pitchersDB = new PouchDB('pitchers');
var pitchesDB = new PouchDB('pitch');
var rostlistDB = new PouchDB('roster_list');
var rostDB = new PouchDB('roster');
var userDB = new PouchDB('user');

function getPouchRosterList(){


 // rostlistDB.destroy();


return new Promise((response,rej)=>{

  rostlistDB.info().then((res)=>{

  return new Promise((resolve, reject)=>{
    if(res.doc_count === 0){
        resolve();
    }else{
      rostlistDB.allDocs({include_docs: true ,startkey: '_', descending:true})
     .then((res)=>{
     response(res.rows);
     reject("returned from db.info() promise");
   });
  }
  });
})
  .then((res) => {
    return getRosterList();
  }).then((obj)=> {
      return rostlistDB.bulkDocs(obj.teamList);

  }).then((res)=>{
    return rostlistDB.allDocs({include_docs: true, descending:true});
  }).then((found)=>{
    response(found.rows);
  }).catch(e => {
    rej("Error in pouchDBTransfer: "+e);
  });
  });



}

function getPouchRoster(team_id){


// db.destroy();

return new Promise ((response,rej)=>{

  rostDB.info().then((res)=>{

  return new Promise((resolve, reject)=>{
    if(res.doc_count === 0){
        resolve();
    }else{
   rostDB.createIndex({
       index: {
         fields:['team_id']
       }
     }).then((res)=>{
          return rostDB.find({
      selector: {
        team_id: team_id
      }
    });
     }).then((found)=>{
      response(found.docs);
     reject("returned from db.info() promise");
   });
    }
  });
})
  .then((res) => {
    return getRoster();
  }).then((obj)=> {
    console.log("object returend", obj);
     return rostDB.bulkDocs(obj.teamList);
  }).then(()=>{

  return rostDB.createIndex({
       index: {
         fields:['team_id']
       }
     });
   }).then((res)=>{
          return rostDB.find({
      selector: {
        team_id: team_id
      }
    });
     }).then((found)=>{
   response(found.docs)

  })
  .catch(e => {
    rej(e);
  });
  });



}

function deletePouchPitches(id){

pitchesDB.find({
  selector:{
    pitcher_id: id
  }
}).then((res)=>{

  console.log("pitch data to delete:", res.docs);
  res.docs.forEach( function(item){
    console.log("item", item);
    pitchesDB.remove(item);
  });

 return pitchersDB.get(id).then((res)=>{
   pitchersDB.remove(res);
 });

}).then(()=>{

}).catch((err)=>{
  console.error("error in pouchDBTransfer deletepouchpitch", err);
});


}

function getPouchPitcher(id = -1){

       if(id == -1){
         return pitchersDB.allDocs({include_docs: true, limit: 1, descending:true})
            .then((res)=>{
               return res.rows[0].doc;
               });
         }else{
               return pitchersDB.get(id).then((res)=>{
                 console.log("getPouchPitcher:", res._id);
                 return res;
               });
         }

  }

function getPouchPitchers(){

        return pitchersDB.allDocs({include_docs: true, descending:true})
           .then((res)=>{
              return res.rows;
      });
    }

function pouchHasPitcher(){
   return pitchersDB.allDocs({include_docs: true, limit: 1, descending:true})
         .then((res)=>{
            return res.total_rows != 0;
    });

}

function getPouchPitches(id){
  return pitchesDB.createIndex({
       index: {
         fields:['pitcher_id']
       }
     }).then((res)=>{

       return pitchesDB.find({
      selector: {
        pitcher_id: id
      }
    })


     });


}

function storePouch(data){
  console.log("data object: ", data.objType);
 switch(data.objType) {
   case "1": return pitchersDB.put(data);
   case "2": return pitchesDB.put(data);
  }
}

function transferPouchToSql(){

    // pitchesDB.allDocs({include_docs: true}).then((res)=>{
    //     console.log("returned docs: ", res);
    //   });
  return new Promise ((pass,fail)=>{
    pitchersDB.allDocs({include_docs: true})
  .then((res)=>{
    console.log(res.total_rows);

      return res.rows.reduce((promise, docItem)=>{
        console.log("docitem",docItem.doc);
        return promise.then((res)=>{
           return storeData(docItem.doc);

        }).then((res)=>{
          return pitchesDB.createIndex({
                      index: {
                      fields: ['pitcher_id']
                  }
                });


        }).then(function () {
          console.log("DOCITEM:", docItem.doc);
                return pitchesDB.find({
                        selector: {
                        pitcher_id: docItem.doc.pitcher_id,
                        }
                     });
                }).then((res)=>{
                  console.log("item for bulkStoreData:", res.docs);
           return bulkStoreData(res.docs, ).then((res)=>{
             console.log("response from bulk store:", res);
           });
        });


      }, Promise.resolve());


  }).then((res)=>{
    console.log("db destroyed");
    pitchersDB.destroy().then((res)=>{
    pitchersDB = new PouchDB('pitchers');
    });
    pitchesDB.destroy().then((res)=>{

 pitchesDB = new PouchDB('pitch');
    });
    pass("Success!");

  }).catch((error)=>{

    console.log("no pitchers saved!:",error);
    fail(error);
  });
  });
}

function syncRoster(){
return new Promise((resolve, reject)=>{

  rostDB.destroy().then((res)=>{
    rostDB = new PouchDB('roster');
      return getRoster();
    }).then((obj)=> {
        return rostDB.bulkDocs(obj.teamList);
    }).then(()=>{
      return rostlistDB.destroy();
    }).then((res)=>{
      rostlistDB = new PouchDB('roster_list');
      return getRosterList();
    }).then((obj)=>{
      return rostlistDB.bulkDocs(obj.teamList);
    }).then((res)=>{
     return rostlistDB.allDocs({include_docs: true, descending:true});
   }).then((found)=>{
     console.log("found list: ",found);
     resolve(found.rows);
   }).catch((err)=>{
       reject(err);

   });
});
}
